module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/lib/db.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@neondatabase/serverless/index.mjs [app-route] (ecmascript)");
;
const sql = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["neon"])(process.env.DATABASE_URL);
const __TURBOPACK__default__export__ = sql;
}),
"[project]/src/app/api/get-users-activities/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.js [app-route] (ecmascript)");
;
async function GET(req) {
    try {
        const url = new URL(req.url);
        const userId = Number(url.searchParams.get("userId")) || 0;
        let result;
        if (userId === 0) {
            result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]`
        select 
          uac.id, 
          uac.date_claimed, 
          usr.name as user_name, 
          act.name as activity_name, 
          uac.defit_amount, 
          uac.participation_percentage,
          uac.boost
        from user_activities uac
        inner join users usr on uac.user_id = usr.id
        inner join activity_type act on uac.activity_type = act.id
        order by uac.date_claimed desc;
      `;
        } else {
            result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]`
        select 
          uac.id, 
          uac.date_claimed, 
          usr.name as user_name, 
          act.name as activity_name, 
          uac.defit_amount, 
          uac.participation_percentage,
          uac.boost
        from user_activities uac
        inner join users usr on uac.user_id = usr.id
        inner join activity_type act on uac.activity_type = act.id
        where uac.user_id = ${userId}
        order by uac.date_claimed desc;
      `;
        }
        return new Response(JSON.stringify({
            result: result
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (err) {
        console.error('❌ DB error:', err);
        return new Response(JSON.stringify({
            result: 0,
            error: err.message
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
} // SELECT 
 //     COALESCE(t.value1, 0) AS value1,
 //     uas.*
 // FROM user_activities uas
 // LEFT JOIN LATERAL (
 //     SELECT uts.value1
 //     FROM user_transactions uts
 //     WHERE uts.user_id = uas.user_id
 //       AND uts.transaction_date > uas.date_claimed  -- prochaine transaction
 //     ORDER BY uts.transaction_date ASC             -- la plus proche après
 //     LIMIT 1
 // ) t ON TRUE
 // WHERE uas.user_id = 1
 // ORDER BY uas.date_claimed ASC;
 // SELECT 
 //     uac.id, 
 //     uac.date_claimed, 
 //     usr.name AS user_name, 
 //     act.name AS activity_name, 
 //     uac.defit_amount, 
 //     uac.participation_percentage,
 //     CASE 
 //         WHEN t.value1 IS NULL OR t.value1 = 0 THEN -1
 //         ELSE t.value2 / t.value1
 //     END AS ratio
 // FROM user_activities uac
 // INNER JOIN users usr 
 //     ON uac.user_id = usr.id
 // INNER JOIN activity_type act 
 //     ON uac.activity_type = act.id
 // LEFT JOIN LATERAL (
 //     SELECT 
 //         uts.value1,
 //         uts.value2
 //     FROM user_transactions uts
 //     WHERE uts.user_id = uac.user_id
 //       AND uts.transaction_date > uac.date_claimed
 //     ORDER BY uts.transaction_date ASC
 //     LIMIT 1
 // ) t ON TRUE
 // ORDER BY uac.date_claimed DESC;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0485ec81._.js.map