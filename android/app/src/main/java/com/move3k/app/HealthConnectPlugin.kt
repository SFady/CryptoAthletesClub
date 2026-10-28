package com.move3k.app

import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.DistanceRecord
import androidx.health.connect.client.records.ExerciseSessionRecord
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.time.Instant
import java.time.temporal.ChronoUnit

@CapacitorPlugin(name = "HealthConnectActivities")
class HealthConnectPlugin : Plugin() {

    companion object {
        val PERMISSIONS = setOf(
            HealthPermission.getReadPermission(ExerciseSessionRecord::class),
            HealthPermission.getReadPermission(DistanceRecord::class),
        )
    }

    private var launchPermissions: (() -> Unit)? = null
    private var pendingPermissionCall: PluginCall? = null

    override fun load() {
        val launcher = activity.registerForActivityResult(
            PermissionController.createRequestPermissionResultContract()
        ) { granted ->
            val call = pendingPermissionCall ?: return@registerForActivityResult
            pendingPermissionCall = null
            val ret = JSObject()
            ret.put("hasAllPermissions", granted.containsAll(PERMISSIONS))
            call.resolve(ret)
        }
        launchPermissions = { launcher.launch(PERMISSIONS) }
    }

    @PluginMethod
    fun checkAvailability(call: PluginCall) {
        val status = when (HealthConnectClient.getSdkStatus(context)) {
            HealthConnectClient.SDK_AVAILABLE -> "Available"
            HealthConnectClient.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED -> "NeedsUpdate"
            else -> "NotAvailable"
        }
        val ret = JSObject()
        ret.put("availability", status)
        call.resolve(ret)
    }

    @PluginMethod
    fun checkHCPermissions(call: PluginCall) {
        val client = HealthConnectClient.getOrCreate(context)
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val granted = client.permissionController.getGrantedPermissions()
                val ret = JSObject()
                ret.put("hasAllPermissions", granted.containsAll(PERMISSIONS))
                call.resolve(ret)
            } catch (e: Exception) {
                call.reject("Error: ${e.message}")
            }
        }
    }

    @PluginMethod
    fun requestHCPermissions(call: PluginCall) {
        try {
            pendingPermissionCall = call
            launchPermissions?.invoke() ?: call.reject("launcher not ready")
        } catch (e: Exception) {
            pendingPermissionCall = null
            call.reject("requestHCPermissions error: ${e.message}")
        }
    }

    @PluginMethod
    fun readActivities(call: PluginCall) {
        val daysBack = (call.getInt("daysBack") ?: 30).toLong()
        val client = HealthConnectClient.getOrCreate(context)

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val endTime = Instant.now()
                val startTime = endTime.minus(daysBack, ChronoUnit.DAYS)
                val timeFilter = TimeRangeFilter.between(startTime, endTime)

                val sessions = client.readRecords(
                    ReadRecordsRequest(ExerciseSessionRecord::class, timeFilter)
                ).records

                val distances = client.readRecords(
                    ReadRecordsRequest(DistanceRecord::class, timeFilter)
                ).records

                val array = JSArray()
                for (session in sessions.sortedByDescending { it.startTime }) {
                    val meters = distances
                        .filter { it.startTime >= session.startTime && it.endTime <= session.endTime }
                        .sumOf { it.distance.inMeters }

                    val durationMin = ChronoUnit.SECONDS.between(session.startTime, session.endTime) / 60.0

                    val obj = JSObject()
                    obj.put("id", session.metadata.id)
                    obj.put("type", typeToName(session.exerciseType))
                    obj.put("startTime", session.startTime.toString())
                    obj.put("endTime", session.endTime.toString())
                    obj.put("title", session.title ?: "")
                    obj.put("distanceKm", Math.round(meters / 10.0) / 100.0)
                    obj.put("durationMin", Math.round(durationMin * 10.0) / 10.0)
                    array.put(obj)
                }

                val ret = JSObject()
                ret.put("activities", array)
                call.resolve(ret)

            } catch (e: Exception) {
                call.reject("Error reading activities: ${e.message}")
            }
        }
    }

    private fun typeToName(type: Int) = when (type) {
        ExerciseSessionRecord.EXERCISE_TYPE_RUNNING,
        ExerciseSessionRecord.EXERCISE_TYPE_RUNNING_TREADMILL -> "Run"
        ExerciseSessionRecord.EXERCISE_TYPE_WALKING -> "Walk"
        ExerciseSessionRecord.EXERCISE_TYPE_BIKING,
        ExerciseSessionRecord.EXERCISE_TYPE_BIKING_STATIONARY -> "Bike"
        ExerciseSessionRecord.EXERCISE_TYPE_SWIMMING_POOL,
        ExerciseSessionRecord.EXERCISE_TYPE_SWIMMING_OPEN_WATER -> "Swim"
        else -> "Other"
    }
}
