"use client";

// Lazy-initialized plugin reference — safe for Next.js SSR
let _plugin = null;

function getPlugin() {
  if (typeof window === "undefined") return null;
  if (_plugin !== null) return _plugin;
  try {
    const { Capacitor, registerPlugin } = require("@capacitor/core");
    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android") {
      _plugin = registerPlugin("HealthConnectActivities");
    } else {
      _plugin = false; // mark as "checked but unavailable"
    }
  } catch {
    _plugin = false;
  }
  return _plugin || null;
}

export function isAndroidNative() {
  if (typeof window === "undefined") return false;
  try {
    const { Capacitor } = require("@capacitor/core");
    return Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android";
  } catch {
    return false;
  }
}

export async function hcCheckAvailability() {
  const p = getPlugin();
  if (!p) return { availability: "NotSupported" };
  try { return await p.checkAvailability(); }
  catch { return { availability: "Error" }; }
}

export async function hcCheckPermissions() {
  const p = getPlugin();
  if (!p) return { hasAllPermissions: false };
  try { return await p.checkHCPermissions(); }
  catch { return { hasAllPermissions: false }; }
}

export async function hcRequestPermissions() {
  const p = getPlugin();
  if (!p) throw new Error("plugin not available");
  return await p.requestHCPermissions(); // let errors bubble up for debugging
}

export async function hcReadActivities(daysBack = 30) {
  const p = getPlugin();
  if (!p) return { activities: [] };
  return await p.readActivities({ daysBack });
}
