(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_836c31._.js", {

"[project]/src/services/api.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// frontend/src/services/api.ts
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: "http://localhost:4444"
});
// --- NOVO: Interceptor para adicionar o token JWT ---
api.interceptors.request.use(async (config)=>{
    // Verifica se estamos no ambiente do navegador antes de tentar acessar o localStorage
    if ("TURBOPACK compile-time truthy", 1) {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error)=>{
    return Promise.reject(new Error(error?.message ?? String(error)));
});
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/auth/AdminAuthGuard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// frontend/src/components/auth/AdminAuthGuard.tsx
__turbopack_esm__({
    "default": (()=>AdminAuthGuard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)"); // Ajuste o caminho se o AuthContext estiver em outro lugar
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
;
function AdminAuthGuard({ children }) {
    _s();
    const { loggedInAdmin, isLoadingAuth } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminAuthGuard.useEffect": ()=>{
            // Não faz nada enquanto o estado de autenticação ainda está carregando do localStorage
            if (isLoadingAuth) {
                return;
            }
            // Se não estiver logado E o carregamento inicial do auth já terminou, redireciona
            if (!loggedInAdmin && !isLoadingAuth) {
                router.push('/empresas/login'); // Ou para /admin/login se preferir um ponto de entrada único
            }
        }
    }["AdminAuthGuard.useEffect"], [
        loggedInAdmin,
        isLoadingAuth,
        router
    ]);
    // Se ainda estiver carregando o estado de autenticação ou se não estiver logado (e o redirecionamento vai acontecer),
    // pode mostrar um loader ou nada para evitar flash de conteúdo.
    if (isLoadingAuth || !loggedInAdmin) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "page-container center-content",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Verificando autorização..."
            }, void 0, false, {
                fileName: "[project]/src/components/auth/AdminAuthGuard.tsx",
                lineNumber: 26,
                columnNumber: 59
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/auth/AdminAuthGuard.tsx",
            lineNumber: 26,
            columnNumber: 12
        }, this);
    // Ou return null; para não mostrar nada até o redirecionamento ocorrer.
    }
    // Se estiver logado, renderiza a página protegida
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(AdminAuthGuard, "/r44jAHoE41KAQtgQVI7SwUU9CU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AdminAuthGuard;
var _c;
__turbopack_refresh__.register(_c, "AdminAuthGuard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/dashboard/StatCard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// frontend/src/components/dashboard/StatCard.tsx
__turbopack_esm__({
    "StatCard": (()=>StatCard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
const StatCard = ({ title, value, icon: Icon, color, bgColor })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-element-bg p-5 rounded-xl shadow-md border border-main-border transition-shadow duration-200",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `p-2 rounded-lg ${bgColor}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                        size: 24,
                        className: color,
                        strokeWidth: 1.5
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/StatCard.tsx",
                        lineNumber: 18,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/StatCard.tsx",
                    lineNumber: 17,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/StatCard.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xl md:text-2xl font-semibold text-text-base",
                        children: value
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/StatCard.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-text-muted mt-1 truncate",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/StatCard.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/StatCard.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/dashboard/StatCard.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
};
_c = StatCard;
var _c;
__turbopack_refresh__.register(_c, "StatCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/dashboard/ChartContainer.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// frontend/src/components/dashboard/ChartContainer.tsx
__turbopack_esm__({
    "ChartContainer": (()=>ChartContainer)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
const ChartContainer = ({ title, children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-element-bg p-4 md:p-6 rounded-xl shadow-md border border-main-border",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: "text-md font-semibold text-foreground mb-4",
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/ChartContainer.tsx",
                lineNumber: 12,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full h-72",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/ChartContainer.tsx",
                lineNumber: 13,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/dashboard/ChartContainer.tsx",
        lineNumber: 11,
        columnNumber: 3
    }, this);
_c = ChartContainer;
var _c;
__turbopack_refresh__.register(_c, "ChartContainer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/dashboard/QuestionBarChart.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// frontend/src/components/dashboard/QuestionBarChart.tsx
__turbopack_esm__({
    "QuestionBarChart": (()=>QuestionBarChart)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$ChartContainer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/dashboard/ChartContainer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/recharts/es6/chart/BarChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/recharts/es6/cartesian/Bar.js [app-client] (ecmascript)");
'use client';
;
;
;
const QuestionBarChart = ({ data, title })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$ChartContainer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChartContainer"], {
        title: title,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
            width: "100%",
            height: "100%",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"], {
                data: data,
                margin: {
                    top: 5,
                    right: 20,
                    left: -10,
                    bottom: 5
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                        strokeDasharray: "3 3",
                        stroke: "var(--color-border)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/QuestionBarChart.tsx",
                        lineNumber: 21,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                        dataKey: "name",
                        fontSize: 12,
                        tickLine: false,
                        axisLine: false
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/QuestionBarChart.tsx",
                        lineNumber: 22,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
                        fontSize: 12,
                        tickLine: false,
                        axisLine: false
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/QuestionBarChart.tsx",
                        lineNumber: 23,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                        cursor: {
                            fill: 'rgba(var(--color-primary-rgb), 0.1)'
                        },
                        contentStyle: {
                            backgroundColor: 'var(--color-background-element)',
                            borderColor: 'var(--color-border)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/QuestionBarChart.tsx",
                        lineNumber: 24,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                        dataKey: "value",
                        fill: "var(--color-primary)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/QuestionBarChart.tsx",
                        lineNumber: 31,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/QuestionBarChart.tsx",
                lineNumber: 20,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/QuestionBarChart.tsx",
            lineNumber: 19,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/dashboard/QuestionBarChart.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
};
_c = QuestionBarChart;
var _c;
__turbopack_refresh__.register(_c, "QuestionBarChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/dashboard/GenericChartContainer.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// frontend/src/components/dashboard/GenericChartContainer.tsx
__turbopack_esm__({
    "GenericChartContainer": (()=>GenericChartContainer)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
const GenericChartContainer = ({ title, children })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full rounded-lg border border-border bg-card-background p-4 shadow-sm dark:bg-gray-800",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "mb-4 text-base font-semibold text-foreground",
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/GenericChartContainer.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-[calc(100%-2rem)] w-full",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/GenericChartContainer.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/dashboard/GenericChartContainer.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
};
_c = GenericChartContainer;
var _c;
__turbopack_refresh__.register(_c, "GenericChartContainer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/dashboard/WordCloud.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// frontend/src/components/dashboard/WordCloud.tsx
__turbopack_esm__({
    "WordCloud": (()=>WordCloud)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$GenericChartContainer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/dashboard/GenericChartContainer.tsx [app-client] (ecmascript)");
'use client';
;
;
;
// A importação dinâmica continua sendo a melhor prática para componentes de visualização
const WordCloudComponent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_require__("[project]/node_modules/react-d3-cloud/lib/esm/index.js [app-client] (ecmascript, async loader)")(__turbopack_import__), {
    loadableGenerated: {
        modules: [
            "src/components/dashboard/WordCloud.tsx -> " + "react-d3-cloud"
        ]
    },
    ssr: false
});
_c = WordCloudComponent;
// A nova biblioteca pede uma função para mapear o tamanho da fonte
const fontSizeMapper = (word)=>Math.log2(word.value) * 5 + 16;
const WordCloud = ({ words })=>{
    if (!words || words.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$GenericChartContainer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GenericChartContainer"], {
            title: "Nuvem de Palavras",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-full w-full items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-text-muted",
                    children: "Selecione uma pergunta para analisar ou não há dados."
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/WordCloud.tsx",
                    lineNumber: 24,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/WordCloud.tsx",
                lineNumber: 23,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/WordCloud.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$GenericChartContainer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GenericChartContainer"], {
        title: "Nuvem de Palavras",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WordCloudComponent, {
            data: words,
            font: "sans-serif",
            fontSize: fontSizeMapper,
            padding: 2
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/WordCloud.tsx",
            lineNumber: 32,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/dashboard/WordCloud.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
};
_c1 = WordCloud;
var _c, _c1;
__turbopack_refresh__.register(_c, "WordCloudComponent");
__turbopack_refresh__.register(_c1, "WordCloud");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/SortableItem.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "SortableItem": (()=>SortableItem)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@dnd-kit/sortable/dist/sortable.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$utilities$2f$dist$2f$utilities$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@dnd-kit/utilities/dist/utilities.esm.js [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
function SortableItem({ id, children }) {
    _s();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSortable"])({
        id
    });
    const style = {
        transform: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$utilities$2f$dist$2f$utilities$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CSS"].Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: setNodeRef,
        style: style,
        ...attributes,
        ...listeners,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/SortableItem.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_s(SortableItem, "V3M7/V83udwZW8GPiodMh2TFy/I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSortable"]
    ];
});
_c = SortableItem;
var _c;
__turbopack_refresh__.register(_c, "SortableItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/questionarios/[id]/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// frontend/src/app/questionarios/[id]/page.tsx
__turbopack_esm__({
    "default": (()=>EditQuestionarioPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/services/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$auth$2f$AdminAuthGuard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/auth/AdminAuthGuard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$StatCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/dashboard/StatCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$QuestionBarChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/dashboard/QuestionBarChart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$WordCloud$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/dashboard/WordCloud.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@dnd-kit/core/dist/core.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@dnd-kit/sortable/dist/sortable.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SortableItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/SortableItem.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>"); // Adicionado ícones
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusIcon$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as PlusIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$checks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListChecks$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/list-checks.js [app-client] (ecmascript) <export default as ListChecks>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-client] (ecmascript) <export default as CalendarDays>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/square-check-big.js [app-client] (ecmascript) <export default as CheckSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
function EditQuestionarioPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "page-container center-content",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Carregando..."
            }, void 0, false, {
                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                lineNumber: 97,
                columnNumber: 76
            }, void 0)
        }, void 0, false, {
            fileName: "[project]/src/app/questionarios/[id]/page.tsx",
            lineNumber: 97,
            columnNumber: 29
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$auth$2f$AdminAuthGuard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditQuestionarioFormContent, {}, void 0, false, {
                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                lineNumber: 99,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/questionarios/[id]/page.tsx",
            lineNumber: 98,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
        lineNumber: 97,
        columnNumber: 9
    }, this);
}
_c = EditQuestionarioPage;
function EditQuestionarioFormContent() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const questionarioId = Number(params.id);
    const [titulo, setTitulo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [quePergs, setQuePergs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('editar');
    const [avaliacoesComRespostas, setAvaliacoesComRespostas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoadingRespostas, setIsLoadingRespostas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedAvaliacaoId, setSelectedAvaliacaoId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [dashboardData, setDashboardData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [wordCloudData, setWordCloudData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedTextQuestion, setSelectedTextQuestion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isLoadingDashboard, setIsLoadingDashboard] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoadingWordCloud, setIsLoadingWordCloud] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [semestresExpandidos, setSemestresExpandidos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const sensors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensors"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensor"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointerSensor"], {
        activationConstraint: {
            delay: 150,
            tolerance: 5
        }
    }));
    const handleDragStart = (event)=>{
        const interactiveElements = [
            'INPUT',
            'TEXTAREA',
            'SELECT',
            'BUTTON'
        ];
        if (interactiveElements.includes(event?.active?.event?.target?.tagName)) {
            event.cancel(); // evita o drag em campos interativos
        }
    };
    const handleDragEnd = (event)=>{
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = quePergs.findIndex((q)=>(q.pergunta.id || q.pergunta.tempId) === active.id);
        const newIndex = quePergs.findIndex((q)=>(q.pergunta.id || q.pergunta.tempId) === over.id);
        const novos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayMove"])(quePergs, oldIndex, newIndex);
        setQuePergs(novos);
    };
    // useEffect para carregar dados do dashboard quando o modo muda para 'analise'
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditQuestionarioFormContent.useEffect": ()=>{
            if (viewMode === 'analise' && questionarioId) {
                setIsLoadingDashboard(true);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/dashboard?questionarioId=${questionarioId}`).then({
                    "EditQuestionarioFormContent.useEffect": (response)=>{
                        setDashboardData(response.data);
                    }
                }["EditQuestionarioFormContent.useEffect"]).catch({
                    "EditQuestionarioFormContent.useEffect": (err)=>{
                        console.error("Erro ao buscar dados do dashboard específico:", err);
                    // Lidar com erro
                    }
                }["EditQuestionarioFormContent.useEffect"]).finally({
                    "EditQuestionarioFormContent.useEffect": ()=>{
                        setIsLoadingDashboard(false);
                    }
                }["EditQuestionarioFormContent.useEffect"]);
            }
        }
    }["EditQuestionarioFormContent.useEffect"], [
        viewMode,
        questionarioId
    ]);
    // useEffect para carregar dados da nuvem de palavras
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditQuestionarioFormContent.useEffect": ()=>{
            if (viewMode === 'analise' && selectedTextQuestion) {
                const fetchWordCloud = {
                    "EditQuestionarioFormContent.useEffect.fetchWordCloud": async ()=>{
                        try {
                            setIsLoadingWordCloud(true);
                            // Passa o questionarioId para filtrar a análise
                            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/analise-texto?perguntaId=${selectedTextQuestion}&questionarioId=${questionarioId}`);
                            setWordCloudData(response.data.wordCloud);
                        } catch (error) {
                            console.error("Erro ao carregar nuvem de palavras:", error);
                        } finally{
                            setIsLoadingWordCloud(false);
                        }
                    }
                }["EditQuestionarioFormContent.useEffect.fetchWordCloud"];
                fetchWordCloud();
            }
        }
    }["EditQuestionarioFormContent.useEffect"], [
        viewMode,
        selectedTextQuestion,
        questionarioId
    ]);
    // --- Lógica de carregamento inicial (sem mudanças significativas) ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditQuestionarioFormContent.useEffect": ()=>{
            if (!questionarioId) {
                setError("ID do Questionário não encontrado na URL.");
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            const loadData = {
                "EditQuestionarioFormContent.useEffect.loadData": async ()=>{
                    try {
                        const respQuestionario = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/questionarios/${questionarioId}`);
                        setTitulo(respQuestionario.data.titulo);
                        const respQuePerg = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/quePerg?questionarioId=${questionarioId}`);
                        const sanitizedQuePergs = respQuePerg.data.map({
                            "EditQuestionarioFormContent.useEffect.loadData.sanitizedQuePergs": (qp)=>({
                                    ...qp,
                                    pergunta: {
                                        ...qp.pergunta,
                                        opcoes: (qp.pergunta.opcoes || []).map({
                                            "EditQuestionarioFormContent.useEffect.loadData.sanitizedQuePergs": (opt)=>({
                                                    ...opt
                                                })
                                        }["EditQuestionarioFormContent.useEffect.loadData.sanitizedQuePergs"])
                                    }
                                })
                        }["EditQuestionarioFormContent.useEffect.loadData.sanitizedQuePergs"]);
                        setQuePergs(sanitizedQuePergs);
                    } catch (err) {
                        console.error("Erro ao carregar dados do questionário:", err);
                        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                            setError("Acesso não autorizado ou negado. Faça o login novamente.");
                        } else if (err.response && err.response.status === 404) {
                            setError("Questionário não encontrado. Verifique o ID ou se ele pertence à sua empresa.");
                        } else {
                            setError("Não foi possível carregar os dados para edição. Tente novamente.");
                        }
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["EditQuestionarioFormContent.useEffect.loadData"];
            loadData();
        }
    }["EditQuestionarioFormContent.useEffect"], [
        questionarioId
    ]);
    // --- Lógica para buscar respostas quando o modo de visualização muda ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditQuestionarioFormContent.useEffect": ()=>{
            if (viewMode === 'respostas' && questionarioId) {
                setIsLoadingRespostas(true);
                setError(null);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/questionarios/${questionarioId}/avaliacoes-com-respostas`) // Endpoint ajustado conforme backend
                .then({
                    "EditQuestionarioFormContent.useEffect": (response)=>{
                        setAvaliacoesComRespostas(response.data);
                    }
                }["EditQuestionarioFormContent.useEffect"]).catch({
                    "EditQuestionarioFormContent.useEffect": (err)=>{
                        console.error("Erro ao buscar avaliações com respostas:", err);
                        setError("Erro ao buscar dados das respostas.");
                    }
                }["EditQuestionarioFormContent.useEffect"]).finally({
                    "EditQuestionarioFormContent.useEffect": ()=>{
                        setIsLoadingRespostas(false);
                    }
                }["EditQuestionarioFormContent.useEffect"]);
            }
        }
    }["EditQuestionarioFormContent.useEffect"], [
        viewMode,
        questionarioId
    ]);
    // --- Funções de manipulação de perguntas e opções (sem mudanças) ---
    const handlePerguntaChange = (qIndex, novoEnunciado)=>{
        setQuePergs((prevQuePergs)=>prevQuePergs.map((qp, index)=>index === qIndex ? {
                    ...qp,
                    pergunta: {
                        ...qp.pergunta,
                        enunciado: novoEnunciado
                    }
                } : qp));
    };
    const removePergunta = (indexToRemove)=>{
        // Confirmação para evitar exclusão acidental
        if (!window.confirm("Tem certeza de que deseja remover esta pergunta?")) {
            return;
        }
        // Filtra o array de perguntas, mantendo todas exceto a do índice a ser removido
        const novasPerguntas = quePergs.filter((_, index)=>index !== indexToRemove);
        setQuePergs(novasPerguntas);
    };
    const handleTipoChange = (qIndex, novoTipo)=>{
        setQuePergs((prevQuePergs)=>prevQuePergs.map((qp, index)=>{
                if (index !== qIndex) {
                    return qp;
                }
                const perguntaAtual = qp.pergunta;
                let novasOpcoes;
                if (novoTipo === 'TEXTO') {
                    novasOpcoes = [];
                } else if (perguntaAtual.opcoes.length === 0) {
                    novasOpcoes = [
                        {
                            texto: '',
                            tempId: `temp-opt-${Date.now()}`
                        }
                    ];
                } else {
                    novasOpcoes = perguntaAtual.opcoes.map((o)=>({
                            ...o
                        }));
                }
                return {
                    ...qp,
                    pergunta: {
                        ...perguntaAtual,
                        tipos: novoTipo,
                        opcoes: novasOpcoes
                    }
                };
            }));
    };
    const handleOptionChange = (qIndex, oIndex, novoTexto)=>{
        setQuePergs((prevQuePergs)=>prevQuePergs.map((qp, index)=>{
                if (index === qIndex) {
                    const novasOpcoes = qp.pergunta.opcoes.map((opt, optIdx)=>optIdx === oIndex ? {
                            ...opt,
                            texto: novoTexto
                        } : opt);
                    return {
                        ...qp,
                        pergunta: {
                            ...qp.pergunta,
                            opcoes: novasOpcoes
                        }
                    };
                }
                return qp;
            }));
    };
    const addOptionToList = (qIndex)=>{
        setQuePergs((prevQuePergs)=>prevQuePergs.map((qp, index)=>{
                if (index === qIndex) {
                    const novasOpcoes = [
                        ...qp.pergunta.opcoes,
                        {
                            texto: '',
                            tempId: `temp-opt-${Date.now()}-${qp.pergunta.opcoes.length}`
                        }
                    ];
                    return {
                        ...qp,
                        pergunta: {
                            ...qp.pergunta,
                            opcoes: novasOpcoes
                        }
                    };
                }
                return qp;
            }));
    };
    const removeOption = (qIndex, oIndex)=>{
        setQuePergs((prevQuePergs)=>prevQuePergs.map((qp, index)=>{
                if (index === qIndex) {
                    const novasOpcoes = qp.pergunta.opcoes.filter((_, optIdx)=>optIdx !== oIndex);
                    return {
                        ...qp,
                        pergunta: {
                            ...qp.pergunta,
                            opcoes: novasOpcoes
                        }
                    };
                }
                return qp;
            }));
    };
    const handleAddNewPergunta = ()=>{
        const novaPerguntaDefault = {
            tempId: `temp-perg-${Date.now()}`,
            enunciado: "",
            tipos: "TEXTO",
            opcoes: []
        };
        const novoQuePerg = {
            questionarioId: questionarioId,
            pergunta: novaPerguntaDefault
        };
        setQuePergs((prevQuePergs)=>[
                ...prevQuePergs,
                novoQuePerg
            ]);
    };
    const handleSaveChanges = async (e)=>{
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        // Transformando o estado do frontend para o formato que o backend espera
        const perguntasParaEnviar = quePergs.map((qp, index)=>({
                id: qp.pergunta.id,
                enunciado: qp.pergunta.enunciado,
                tipos: qp.pergunta.tipos,
                ordem: index,
                opcoes: qp.pergunta.opcoes.map((opt)=>({
                        id: opt.id,
                        texto: opt.texto
                    }))
            }));
        const payload = {
            titulo: titulo,
            perguntas: perguntasParaEnviar
        };
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/questionarios/${questionarioId}`, payload);
            setTitulo(response.data.titulo);
            const sanitizedQuePergs = response.data.perguntas.map((p)=>({
                    id: p.questionarioPerguntaId,
                    questionarioId: p.questionarioId,
                    pergunta: {
                        id: p.id,
                        enunciado: p.enunciado,
                        tipos: p.tipos,
                        opcoes: p.opcoes ?? []
                    }
                }));
            setQuePergs(sanitizedQuePergs);
            alert("Questionário salvo com sucesso!");
            router.push('/questionarios');
        } catch (error) {
            console.error("Erro ao salvar:", error.response?.data ?? error);
            const errorMessage = error.response?.data?.error ?? 'Ocorreu um problema ao salvar.';
            setError(errorMessage);
            alert(`Erro ao salvar: ${errorMessage}`);
        } finally{
            setIsLoading(false);
        }
    };
    // NOVO: Agrupamento e ordenação das avaliações por semestre
    const avaliacoesAgrupadasPorSemestre = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "EditQuestionarioFormContent.useMemo[avaliacoesAgrupadasPorSemestre]": ()=>{
            if (viewMode !== 'respostas' || avaliacoesComRespostas.length === 0) {
                return {};
            }
            const agrupado = {};
            avaliacoesComRespostas.forEach({
                "EditQuestionarioFormContent.useMemo[avaliacoesAgrupadasPorSemestre]": (av)=>{
                    if (!agrupado[av.semestre]) {
                        agrupado[av.semestre] = [];
                    }
                    agrupado[av.semestre].push(av);
                }
            }["EditQuestionarioFormContent.useMemo[avaliacoesAgrupadasPorSemestre]"]);
            // Ordenar os semestres (mais recentes primeiro)
            const semestresOrdenados = Object.keys(agrupado).sort({
                "EditQuestionarioFormContent.useMemo[avaliacoesAgrupadasPorSemestre].semestresOrdenados": (a, b)=>{
                    const [anoA, periodoA] = a.split('/').map(Number);
                    const [anoB, periodoB] = b.split('/').map(Number);
                    if (anoA !== anoB) return anoB - anoA;
                    return periodoB - periodoA;
                }
            }["EditQuestionarioFormContent.useMemo[avaliacoesAgrupadasPorSemestre].semestresOrdenados"]);
            const agrupadoOrdenado = {};
            semestresOrdenados.forEach({
                "EditQuestionarioFormContent.useMemo[avaliacoesAgrupadasPorSemestre]": (sem)=>{
                    // Ordenar avaliações dentro de cada semestre pela data de criação (mais recente primeiro)
                    agrupado[sem].sort({
                        "EditQuestionarioFormContent.useMemo[avaliacoesAgrupadasPorSemestre]": (evalA, evalB)=>new Date(evalB.created_at).getTime() - new Date(evalA.created_at).getTime()
                    }["EditQuestionarioFormContent.useMemo[avaliacoesAgrupadasPorSemestre]"]);
                    agrupadoOrdenado[sem] = agrupado[sem];
                }
            }["EditQuestionarioFormContent.useMemo[avaliacoesAgrupadasPorSemestre]"]);
            return agrupadoOrdenado;
        }
    }["EditQuestionarioFormContent.useMemo[avaliacoesAgrupadasPorSemestre]"], [
        viewMode,
        avaliacoesComRespostas
    ]);
    // Função para alternar a expansão de um semestre
    const toggleSemestreExpandido = (semestre)=>{
        setSemestresExpandidos((prev)=>{
            const novoSet = new Set(prev);
            if (novoSet.has(semestre)) {
                novoSet.delete(semestre);
            } else {
                novoSet.add(semestre);
            }
            return novoSet;
        });
    };
    const selectedAvaliacaoDetalhes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "EditQuestionarioFormContent.useMemo[selectedAvaliacaoDetalhes]": ()=>{
            if (!selectedAvaliacaoId) return null;
            return avaliacoesComRespostas.find({
                "EditQuestionarioFormContent.useMemo[selectedAvaliacaoDetalhes]": (av)=>av.id === selectedAvaliacaoId
            }["EditQuestionarioFormContent.useMemo[selectedAvaliacaoDetalhes]"]);
        }
    }["EditQuestionarioFormContent.useMemo[selectedAvaliacaoDetalhes]"], [
        selectedAvaliacaoId,
        avaliacoesComRespostas
    ]);
    // --- Renderização do Loading e Erro Inicial ---
    if (isLoading && quePergs.length === 0 && !titulo) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "page-container center-content",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Carregando dados do questionário..."
            }, void 0, false, {
                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                lineNumber: 435,
                columnNumber: 63
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/questionarios/[id]/page.tsx",
            lineNumber: 435,
            columnNumber: 16
        }, this);
    }
    if (error && quePergs.length === 0 && !titulo) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "page-container center-content",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        color: 'red'
                    },
                    children: error
                }, void 0, false, {
                    fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                    lineNumber: 440,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/questionarios",
                    className: "btn btn-secondary",
                    style: {
                        marginTop: '1rem'
                    },
                    children: "Voltar para Lista de Questionários"
                }, void 0, false, {
                    fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                    lineNumber: 441,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/questionarios/[id]/page.tsx",
            lineNumber: 439,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "page-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 flex space-x-2 border-b border-border pb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setViewMode('editar');
                            setSelectedAvaliacaoId(null);
                        },
                        className: `btn ${viewMode === 'editar' ? 'btn-primary' : 'btn-outline'}`,
                        children: "Configurar Perguntas"
                    }, void 0, false, {
                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                        lineNumber: 451,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setViewMode('respostas');
                            setSelectedAvaliacaoId(null);
                        },
                        className: `btn ${viewMode === 'respostas' ? 'btn-primary' : 'btn-outline'}`,
                        children: "Visualizar Respostas"
                    }, void 0, false, {
                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                        lineNumber: 457,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setViewMode('analise'),
                        className: `btn ${viewMode === 'analise' ? 'btn-primary' : 'btn-outline'}`,
                        children: "Análise / Dashboard"
                    }, void 0, false, {
                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                        lineNumber: 463,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                lineNumber: 450,
                columnNumber: 13
            }, this),
            viewMode === 'editar' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSaveChanges,
                className: "editor-form-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "form-header",
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: [
                                    "Editando Questionário: ",
                                    titulo || "Carregando Título..."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                lineNumber: 475,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-header-actions",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>router.push("/questionarios"),
                                        className: "btn btn-secondary",
                                        disabled: isLoading,
                                        children: "Cancelar"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                        lineNumber: 477,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: "btn btn-primary",
                                        disabled: isLoading,
                                        children: isLoading ? "Salvando..." : "Salvar Alterações"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                        lineNumber: 478,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                lineNumber: 476,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                        lineNumber: 474,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "display-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "titulo-input",
                                className: "form-label",
                                children: "Título do Questionário"
                            }, void 0, false, {
                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                lineNumber: 485,
                                columnNumber: 25
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                id: "titulo-input",
                                type: "text",
                                value: titulo,
                                onChange: (e)=>setTitulo(e.target.value),
                                className: "input-edit-mode title-input" // Sua classe ou a global para inputs
                                ,
                                disabled: isLoading,
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                lineNumber: 486,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                        lineNumber: 484,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "display-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "form-label",
                                children: "Perguntas do Questionário"
                            }, void 0, false, {
                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                lineNumber: 498,
                                columnNumber: 25
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "perguntas-edit-list",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DndContext"], {
                                        sensors: sensors,
                                        collisionDetection: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closestCenter"],
                                        onDragEnd: handleDragEnd,
                                        onDragStart: handleDragStart,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SortableContext"], {
                                            items: quePergs.map((qp)=>qp.pergunta.id ?? qp.pergunta.tempId).filter((id)=>id !== undefined),
                                            strategy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["verticalListSortingStrategy"],
                                            children: quePergs.map((qp, qIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SortableItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SortableItem"], {
                                                    id: qp.pergunta.id ?? qp.pergunta.tempId,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "pergunta-editor-item",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                htmlFor: `enunciado-pergunta-${qIndex}`,
                                                                className: "form-label sr-only",
                                                                children: [
                                                                    "Enunciado da Pergunta ",
                                                                    qIndex + 1
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                lineNumber: 513,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                id: `enunciado-pergunta-${qIndex}`,
                                                                value: qp.pergunta.enunciado,
                                                                onChange: (e)=>handlePerguntaChange(qIndex, e.target.value),
                                                                className: "input-edit-mode question-textarea",
                                                                rows: 2,
                                                                placeholder: `Enunciado da Pergunta ${qIndex + 1}`,
                                                                required: true
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                lineNumber: 514,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mt-4 flex items-end gap-x-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex-grow",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                htmlFor: `tipo-pergunta-${qIndex}`,
                                                                                className: "form-label",
                                                                                children: "Tipo"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                                lineNumber: 526,
                                                                                columnNumber: 57
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                id: `tipo-pergunta-${qIndex}`,
                                                                                value: qp.pergunta.tipos,
                                                                                onChange: (e)=>handleTipoChange(qIndex, e.target.value),
                                                                                className: "input-edit-mode w-full",
                                                                                disabled: isLoading,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: "TEXTO",
                                                                                        children: "Texto"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                                        lineNumber: 536,
                                                                                        columnNumber: 61
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: "MULTIPLA_ESCOLHA",
                                                                                        children: "Múltipla Escolha"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                                        lineNumber: 537,
                                                                                        columnNumber: 61
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                                lineNumber: 529,
                                                                                columnNumber: 57
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                        lineNumber: 525,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>removePergunta(qIndex),
                                                                        className: "btn btn-danger p-2.5" // Reutiliza suas classes de botão para consistência
                                                                        ,
                                                                        title: "Remover Pergunta",
                                                                        disabled: isLoading,
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                            size: 18
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                            lineNumber: 549,
                                                                            columnNumber: 57
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                        lineNumber: 542,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                lineNumber: 523,
                                                                columnNumber: 49
                                                            }, this),
                                                            qp.pergunta.tipos === 'MULTIPLA_ESCOLHA' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "opcoes-editor-container",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "form-label",
                                                                        children: "Opções de Resposta"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                        lineNumber: 555,
                                                                        columnNumber: 57
                                                                    }, this),
                                                                    qp.pergunta.opcoes.map((opt, oIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "opcao-editor-item",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                    htmlFor: `opcao-q${qIndex}-o${oIndex}`,
                                                                                    className: "sr-only",
                                                                                    children: [
                                                                                        "Opção ",
                                                                                        oIndex + 1
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                                    lineNumber: 558,
                                                                                    columnNumber: 65
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    id: `opcao-q${qIndex}-o${oIndex}`,
                                                                                    type: "text",
                                                                                    value: opt.texto,
                                                                                    onChange: (e)=>handleOptionChange(qIndex, oIndex, e.target.value),
                                                                                    placeholder: `Texto da Opção ${oIndex + 1}`,
                                                                                    className: "input-edit-mode" // Sua classe ou a global para inputs
                                                                                    ,
                                                                                    disabled: isLoading,
                                                                                    required: qp.pergunta.tipos === 'MULTIPLA_ESCOLHA'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                                    lineNumber: 559,
                                                                                    columnNumber: 65
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    type: "button",
                                                                                    onClick: ()=>removeOption(qIndex, oIndex),
                                                                                    className: "btn-remover-opcao" // Estilo para este botão específico
                                                                                    ,
                                                                                    title: "Remover Opção",
                                                                                    disabled: isLoading,
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                                        size: 18
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                                        lineNumber: 576,
                                                                                        columnNumber: 69
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                                    lineNumber: 569,
                                                                                    columnNumber: 65
                                                                                }, this)
                                                                            ]
                                                                        }, opt.id ?? opt.tempId ?? `q${qIndex}-o${oIndex}`, true, {
                                                                            fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                            lineNumber: 557,
                                                                            columnNumber: 61
                                                                        }, this)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>addOptionToList(qIndex),
                                                                        className: "btn btn-outline btn-sm mt-2 flex items-center self-start" // Usando classes de botão genéricas
                                                                        ,
                                                                        disabled: isLoading,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusIcon$3e$__["PlusIcon"], {
                                                                                size: 16,
                                                                                className: "mr-1"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                                lineNumber: 586,
                                                                                columnNumber: 61
                                                                            }, this),
                                                                            " Adicionar Opção"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                        lineNumber: 580,
                                                                        columnNumber: 57
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                lineNumber: 554,
                                                                columnNumber: 53
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                        lineNumber: 512,
                                                        columnNumber: 45
                                                    }, this)
                                                }, qp.pergunta.id ?? qp.pergunta.tempId, false, {
                                                    fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                    lineNumber: 511,
                                                    columnNumber: 41
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                            lineNumber: 506,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                        lineNumber: 500,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleAddNewPergunta,
                                        className: "btn btn-primary mt-4 flex items-center" // Botão primário para ação principal
                                        ,
                                        style: {
                                            padding: '0.75rem 1.5rem',
                                            fontSize: '1rem'
                                        },
                                        disabled: isLoading,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusIcon$3e$__["PlusIcon"], {
                                                size: 20,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                lineNumber: 602,
                                                columnNumber: 33
                                            }, this),
                                            " Adicionar Nova Pergunta"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                        lineNumber: 595,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                lineNumber: 499,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                        lineNumber: 497,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                lineNumber: 472,
                columnNumber: 17
            }, this),
            viewMode === 'respostas' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "respostas-view-container mt-6",
                children: [
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xl sm:text-2xl font-semibold text-foreground mb-6",
                        children: [
                            "Respostas para o Questionário: ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-primary",
                                children: titulo
                            }, void 0, false, {
                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                lineNumber: 613,
                                columnNumber: 56
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                        lineNumber: 612,
                        columnNumber: 21
                    }, this),
                    isLoadingRespostas && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-text-muted",
                            children: "Carregando respostas..."
                        }, void 0, false, {
                            fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                            lineNumber: 616,
                            columnNumber: 79
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                        lineNumber: 616,
                        columnNumber: 44
                    }, this),
                    error && !isLoadingRespostas && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-red-600 dark:text-red-400",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                            lineNumber: 617,
                            columnNumber: 89
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                        lineNumber: 617,
                        columnNumber: 54
                    }, this),
                    !isLoadingRespostas && Object.keys(avaliacoesAgrupadasPorSemestre).length === 0 && !error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-10 px-4 bg-card-background dark:bg-gray-800 rounded-lg shadow border border-border",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$checks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListChecks$3e$__["ListChecks"], {
                                className: "mx-auto h-12 w-12 text-text-muted",
                                strokeWidth: 1.5
                            }, void 0, false, {
                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                lineNumber: 621,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 text-text-muted",
                                children: "Nenhuma avaliação utilizando este questionário foi encontrada ou nenhuma resposta foi submetida ainda."
                            }, void 0, false, {
                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                lineNumber: 622,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                        lineNumber: 620,
                        columnNumber: 25
                    }, this),
                    selectedAvaliacaoDetalhes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-card-background dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-border",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedAvaliacaoId(null),
                                className: "btn btn-outline btn-sm mb-6 inline-flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        width: "16",
                                        height: "16",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        className: "mr-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M19 12H5M12 19l-7-7 7-7"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                            lineNumber: 635,
                                            columnNumber: 228
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                        lineNumber: 635,
                                        columnNumber: 33
                                    }, this),
                                    "Voltar para Lista de Avaliações"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                lineNumber: 631,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-xl font-semibold text-primary mb-1",
                                children: selectedAvaliacaoDetalhes.semestre
                            }, void 0, false, {
                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                lineNumber: 638,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-text-muted mb-4",
                                children: [
                                    "ID da Avaliação: ",
                                    selectedAvaliacaoDetalhes.id,
                                    " - Requer Login: ",
                                    selectedAvaliacaoDetalhes.requerLoginCliente ? "Sim" : "Não"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                lineNumber: 641,
                                columnNumber: 29
                            }, this),
                            selectedAvaliacaoDetalhes.usuarios.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-text-muted py-4",
                                children: "Nenhuma resposta submetida para esta avaliação."
                            }, void 0, false, {
                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                lineNumber: 646,
                                columnNumber: 33
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6",
                                children: selectedAvaliacaoDetalhes.usuarios.map((respondente)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-4 border border-border rounded-md bg-page-bg dark:bg-gray-800/50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-md font-medium text-foreground",
                                                children: [
                                                    "Respondente: ",
                                                    respondente.usuario?.nome || respondente.usuario?.email || `Anônimo (Sessão: ...${respondente.anonymousSessionId?.slice(-6)})`
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                lineNumber: 652,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-text-muted mb-3",
                                                children: [
                                                    "Status: ",
                                                    respondente.status,
                                                    " (",
                                                    respondente.isFinalizado ? "Finalizado" : "Em Andamento",
                                                    ") - Em: ",
                                                    new Date(respondente.created_at).toLocaleString('pt-BR')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                lineNumber: 655,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "space-y-3",
                                                children: respondente.respostas.map((resp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        className: "text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                className: "block text-text-muted mb-0.5",
                                                                children: resp.pergunta.enunciado
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                lineNumber: 661,
                                                                columnNumber: 53
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-foreground pl-1",
                                                                children: resp.resposta
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                lineNumber: 662,
                                                                columnNumber: 53
                                                            }, this)
                                                        ]
                                                    }, resp.id, true, {
                                                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                        lineNumber: 660,
                                                        columnNumber: 49
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                lineNumber: 658,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, respondente.id, true, {
                                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                        lineNumber: 651,
                                        columnNumber: 37
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                lineNumber: 649,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                        lineNumber: 630,
                        columnNumber: 25
                    }, this),
                    !isLoadingRespostas && Object.keys(avaliacoesAgrupadasPorSemestre).length > 0 && !selectedAvaliacaoId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-8",
                        children: Object.entries(avaliacoesAgrupadasPorSemestre).map(([semestre, avaliacoesDoSemestre])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-card-background dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-border",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>toggleSemestreExpandido(semestre),
                                        className: "w-full flex justify-between items-center text-left py-2",
                                        "aria-expanded": semestresExpandidos.has(semestre) ? "true" : "false",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-lg font-semibold text-primary flex items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"], {
                                                        size: 20,
                                                        className: "mr-2 text-primary/80"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                        lineNumber: 684,
                                                        columnNumber: 45
                                                    }, this),
                                                    "Semestre: ",
                                                    semestre
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                lineNumber: 683,
                                                columnNumber: 41
                                            }, this),
                                            semestresExpandidos.has(semestre) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                lineNumber: 687,
                                                columnNumber: 78
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                lineNumber: 687,
                                                columnNumber: 104
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                        lineNumber: 677,
                                        columnNumber: 37
                                    }, this),
                                    semestresExpandidos.has(semestre) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4 space-y-3 pl-2 border-l-2 border-primary/30",
                                        children: avaliacoesDoSemestre.map((av)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 border border-border rounded-md hover:bg-page-bg dark:hover:bg-gray-700/40 cursor-pointer transition-colors duration-150",
                                                onClick: ()=>setSelectedAvaliacaoId(av.id),
                                                role: "button",
                                                tabIndex: 0,
                                                onKeyDown: (e)=>e.key === 'Enter' && setSelectedAvaliacaoId(av.id),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium text-foreground",
                                                        children: [
                                                            "Avaliação ID: ",
                                                            av.id,
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-text-muted ml-2",
                                                                children: [
                                                                    "(Criada em: ",
                                                                    new Date(av.created_at).toLocaleDateString('pt-BR'),
                                                                    ")"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                lineNumber: 702,
                                                                columnNumber: 57
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                        lineNumber: 700,
                                                        columnNumber: 53
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-text-muted flex items-center mt-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                                size: 14,
                                                                className: "mr-1.5 text-text-muted/80"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                lineNumber: 707,
                                                                columnNumber: 57
                                                            }, this),
                                                            av._count?.usuarios ?? 0,
                                                            " respondente(s)",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "mx-2",
                                                                children: "|"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                lineNumber: 709,
                                                                columnNumber: 57
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Requer Login: ",
                                                                    av.requerLoginCliente ? "Sim" : "Não"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                lineNumber: 710,
                                                                columnNumber: 57
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                        lineNumber: 706,
                                                        columnNumber: 53
                                                    }, this)
                                                ]
                                            }, av.id, true, {
                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                lineNumber: 693,
                                                columnNumber: 49
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                        lineNumber: 691,
                                        columnNumber: 41
                                    }, this)
                                ]
                            }, semestre, true, {
                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                lineNumber: 676,
                                columnNumber: 33
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                        lineNumber: 674,
                        columnNumber: 25
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                lineNumber: 611,
                columnNumber: 17
            }, this),
            viewMode === 'analise' && (()=>{
                if (isLoadingDashboard) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center p-10",
                        children: "Carregando análise..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                        lineNumber: 725,
                        columnNumber: 28
                    }, this);
                }
                if (!dashboardData) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center p-10",
                        children: "Não há dados para analisar."
                    }, void 0, false, {
                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                        lineNumber: 728,
                        columnNumber: 28
                    }, this);
                }
                let wordCloudContent;
                if (isLoadingWordCloud) {
                    wordCloudContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-full w-full items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Analisando textos..."
                        }, void 0, false, {
                            fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                            lineNumber: 735,
                            columnNumber: 29
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                        lineNumber: 734,
                        columnNumber: 25
                    }, this);
                } else if (wordCloudData && wordCloudData.length > 0) {
                    wordCloudContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$WordCloud$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WordCloud"], {
                        words: wordCloudData
                    }, void 0, false, {
                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                        lineNumber: 739,
                        columnNumber: 40
                    }, this);
                } else {
                    wordCloudContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-full w-full items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Nenhum dado de texto para exibir."
                        }, void 0, false, {
                            fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                            lineNumber: 743,
                            columnNumber: 29
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                        lineNumber: 742,
                        columnNumber: 25
                    }, this);
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xl sm:text-2xl font-semibold text-foreground",
                            children: [
                                "Análise do Questionário: ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-primary",
                                    children: titulo
                                }, void 0, false, {
                                    fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                    lineNumber: 750,
                                    columnNumber: 116
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                            lineNumber: 750,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$StatCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatCard"], {
                                    title: "Total de Avaliações",
                                    value: dashboardData.kpis.totalAvaliacoes,
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
                                    color: "text-indigo-500",
                                    bgColor: "bg-indigo-50 dark:bg-indigo-700/30"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                    lineNumber: 753,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$StatCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatCard"], {
                                    title: "Total de Respondentes",
                                    value: dashboardData.kpis.totalRespondentes,
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
                                    color: "text-blue-500",
                                    bgColor: "bg-blue-50 dark:bg-blue-700/30"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                    lineNumber: 754,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$StatCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatCard"], {
                                    title: "Respostas Finalizadas",
                                    value: dashboardData.kpis.totalFinalizados,
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"],
                                    color: "text-green-500",
                                    bgColor: "bg-green-50 dark:bg-green-700/30"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                    lineNumber: 755,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$StatCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatCard"], {
                                    title: "Taxa de Conclusão",
                                    value: `${dashboardData.kpis.taxaDeConclusao}%`,
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"],
                                    color: "text-amber-500",
                                    bgColor: "bg-amber-50 dark:bg-amber-700/30"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                    lineNumber: 756,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                            lineNumber: 752,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 lg:grid-cols-2 gap-8",
                            children: [
                                dashboardData.graficos.map((grafico)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$QuestionBarChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuestionBarChart"], {
                                        title: grafico.enunciado,
                                        data: grafico.respostas
                                    }, grafico.perguntaId, false, {
                                        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                        lineNumber: 761,
                                        columnNumber: 33
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "form-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "text-question-select-specific",
                                                    className: "form-label",
                                                    children: "Analisar Pergunta de Texto:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                    lineNumber: 766,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    id: "text-question-select-specific",
                                                    className: "input-edit-mode",
                                                    value: selectedTextQuestion,
                                                    onChange: (e)=>setSelectedTextQuestion(e.target.value),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "Selecione uma pergunta"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                            lineNumber: 773,
                                                            columnNumber: 41
                                                        }, this),
                                                        quePergs.filter((qp)=>qp.pergunta.tipos === 'TEXTO').map((qp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: qp.pergunta.id,
                                                                children: qp.pergunta.enunciado
                                                            }, qp.pergunta.id, false, {
                                                                fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                                lineNumber: 774,
                                                                columnNumber: 105
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                                    lineNumber: 767,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                            lineNumber: 765,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 h-[400px]",
                                            children: wordCloudContent
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                            lineNumber: 777,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                                    lineNumber: 764,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                            lineNumber: 759,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/questionarios/[id]/page.tsx",
                    lineNumber: 749,
                    columnNumber: 21
                }, this);
            })()
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/questionarios/[id]/page.tsx",
        lineNumber: 449,
        columnNumber: 9
    }, this);
}
_s(EditQuestionarioFormContent, "jjjVwYgvNYGIBTLKGmb+VoW9sk4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensors"]
    ];
});
_c1 = EditQuestionarioFormContent;
var _c, _c1;
__turbopack_refresh__.register(_c, "EditQuestionarioPage");
__turbopack_refresh__.register(_c1, "EditQuestionarioFormContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/questionarios/[id]/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=src_836c31._.js.map