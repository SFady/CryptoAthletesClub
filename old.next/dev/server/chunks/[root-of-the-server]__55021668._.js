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
"[project]/src/app/api/get-user-totals/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
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
        const id = Number(url.searchParams.get('id')) || 0;
        let result;
        if (id === 1) {
            result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]`
        SELECT
            uss.name AS name,
            COALESCE(SUM(uas.kilometers), 0)    AS kilometers,
            COALESCE(SUM(uas.defit_amount), 0)  AS defit_amount,
            COALESCE(SUM(uas.boost), 0)         AS boost
        FROM users uss
        LEFT JOIN user_activities uas
          ON uas.user_id = uss.id
        AND EXTRACT(YEAR FROM uas.date_claimed) = EXTRACT(YEAR FROM CURRENT_DATE)
        GROUP BY uss.id, uss.name
        ORDER BY uss.id;
      `;
        } else if (id === 2) {
            result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]`
        SELECT
            uss.name AS name,
            COALESCE(SUM(uas.kilometers), 0)    AS kilometers,
            COALESCE(SUM(uas.defit_amount), 0)  AS defit_amount,
            COALESCE(SUM(uas.boost), 0)         AS boost
        FROM users uss
        LEFT JOIN user_activities uas
          ON uas.user_id = uss.id
        AND EXTRACT(MONTH FROM uas.date_claimed) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM uas.date_claimed) = EXTRACT(YEAR FROM CURRENT_DATE)
        GROUP BY uss.id, uss.name
        ORDER BY uss.id;  
      `;
        } else if (id === 3) {
            result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]`
        SELECT
            uss.name AS name,
            COALESCE(SUM(uas.kilometers), 0)    AS kilometers,
            COALESCE(SUM(uas.defit_amount), 0)  AS defit_amount,
            COALESCE(SUM(uas.boost), 0)         AS boost
        FROM users uss
        LEFT JOIN user_activities uas
          ON uas.user_id = uss.id
        AND EXTRACT(WEEK FROM uas.date_claimed) = EXTRACT(WEEK FROM CURRENT_DATE) AND EXTRACT(MONTH FROM uas.date_claimed) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM uas.date_claimed) = EXTRACT(YEAR FROM CURRENT_DATE)
        GROUP BY uss.id, uss.name
        ORDER BY uss.id;    
      `;
        } else {
            result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]`
        SELECT
            uss.name AS name,
            COALESCE(SUM(uas.kilometers), 0)    AS kilometers,
            COALESCE(SUM(uas.defit_amount), 0)  AS defit_amount,
            COALESCE(SUM(uas.boost), 0)         AS boost
        FROM users uss
        LEFT JOIN user_activities uas
          ON uas.user_id = uss.id
        GROUP BY uss.id, uss.name
        ORDER BY uss.id;
      `;
        }
        const response = result.map((row)=>({
                name: row.name,
                kilometers: Number(row.kilometers ?? 0),
                defit_amount: Number(row.defit_amount ?? 0),
                boost: Number(row.boost ?? 0)
            }));
        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.error('❌ DB error:', err);
        return new Response(JSON.stringify({
            euros: 0,
            defits: 0,
            error: err.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
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
 //     COALESCE(t.value1, -1) AS value1,
 //     COALESCE(t.value2, -1) AS value2,
 //     CASE 
 //         WHEN t.value1 IS NULL OR t.value1 = 0 THEN NULL
 //         ELSE t.value2 / t.value1
 //     END AS ratio,
 //     uas.*
 // FROM user_activities uas
 // LEFT JOIN LATERAL (
 //     SELECT 
 //         uts.value1,
 //         uts.value2
 //     FROM user_transactions uts
 //     WHERE uts.user_id = uas.user_id
 //       AND uts.transaction_date > uas.date_claimed
 //     ORDER BY uts.transaction_date ASC
 //     LIMIT 1
 // ) t ON TRUE
 // WHERE uas.user_id = 1
 // ORDER BY uas.date_claimed ASC;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__55021668._.js.map