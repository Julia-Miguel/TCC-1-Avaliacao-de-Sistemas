(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_80266a._.js", {

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
"[project]/src/app/questionarios/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// frontend/src/app/questionarios/[id]/page.tsx
__turbopack_esm__({
    "default": (()=>EditQuestionarioForm)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/services/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
;
;
function EditQuestionarioForm() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { id } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const questionarioId = Number(id);
    const [titulo, setTitulo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [quePergs, setQuePergs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditQuestionarioForm.useEffect": ()=>{
            if (!questionarioId) {
                setIsLoading(false);
                setError("ID do Questionário inválido.");
                return;
            }
            setIsLoading(true);
            setError(null);
            const loadData = {
                "EditQuestionarioForm.useEffect.loadData": async ()=>{
                    try {
                        // Busca o título do questionário
                        const respQuestionario = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/questionarios/${questionarioId}`);
                        setTitulo(respQuestionario.data.titulo);
                        // Busca as perguntas associadas a ESTE questionário
                        const respQuePerg = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/quePerg?questionarioId=${questionarioId}`);
                        const sanitizedQuePergs = respQuePerg.data.map({
                            "EditQuestionarioForm.useEffect.loadData.sanitizedQuePergs": (qp)=>({
                                    ...qp,
                                    pergunta: {
                                        ...qp.pergunta,
                                        opcoes: qp.pergunta.opcoes || []
                                    }
                                })
                        }["EditQuestionarioForm.useEffect.loadData.sanitizedQuePergs"]);
                        setQuePergs(sanitizedQuePergs);
                    } catch (err) {
                        console.error("Erro ao carregar dados:", err);
                        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                            setError("Acesso não autorizado. Faça login como administrador.");
                        // router.push('/empresas/login'); // O AdminAuthGuard cuidaria disso
                        } else if (err.response && err.response.status === 404) {
                            setError("Questionário não encontrado ou não pertence à sua empresa.");
                        } else {
                            setError("Não foi possível carregar os dados para edição.");
                        }
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["EditQuestionarioForm.useEffect.loadData"];
            loadData();
        }
    }["EditQuestionarioForm.useEffect"], [
        questionarioId,
        router
    ]);
    const handlePerguntaChange = (index, novoEnunciado)=>{};
    const handleTipoChange = (index, novoTipo)=>{};
    const handleOptionChange = (qIndex, oIndex, novoTexto)=>{};
    const addOption = (qIndex)=>{};
    const removeOption = (qIndex, oIndex)=>{};
    // --- NOVA FUNÇÃO PARA ADICIONAR PERGUNTA ---
    const handleAddPergunta = ()=>{
        setQuePergs((prevQuePergs)=>[
                ...prevQuePergs,
                {
                    // Nova pergunta não tem perguntaId do banco ainda
                    // O ID da relação QuePerg também não existe
                    questionarioId: questionarioId,
                    pergunta: {
                        // id: undefined, // ou um ID temporário negativo para a key se precisar
                        enunciado: '',
                        tipos: 'TEXTO',
                        opcoes: []
                    }
                }
            ]);
    };
    // -----------------------------------------
    const handleSaveChanges = async (event)=>{
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            // 1. Salvar o título do questionário
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/questionarios`, {
                id: questionarioId,
                titulo: titulo
            });
            // 2. Salvar/Atualizar Perguntas e suas Opções, e associações QuePerg
            for (const qp of quePergs){
                let perguntaParaSalvar = qp.pergunta;
                let perguntaIdSalva = qp.pergunta.id; // ID da pergunta existente ou undefined se nova
                if (!perguntaIdSalva) {
                    // Cria a pergunta
                    const responseNovaPergunta = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/perguntas', {
                        enunciado: perguntaParaSalvar.enunciado,
                        tipos: perguntaParaSalvar.tipos,
                        // Envia as opções para serem criadas junto com a pergunta
                        opcoes: perguntaParaSalvar.tipos === 'MULTIPLA_ESCOLHA' ? perguntaParaSalvar.opcoes : undefined
                    });
                    perguntaIdSalva = responseNovaPergunta.data.id; // Pega o ID da pergunta recém-criada
                    // Associa a nova pergunta ao questionário atual
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/queperg', {
                        questionario_id: questionarioId,
                        pergunta_id: perguntaIdSalva
                    });
                } else {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/perguntas`, {
                        id: perguntaIdSalva,
                        enunciado: perguntaParaSalvar.enunciado,
                        tipos: perguntaParaSalvar.tipos,
                        opcoes: perguntaParaSalvar.opcoes // O controller de update de perguntas já lida com as opções
                    });
                }
            }
            alert("Questionário atualizado com sucesso!");
            // Opcional: Recarregar os dados para refletir IDs de novas perguntas/opções
            // ou simplesmente voltar.
            router.push("/questionarios");
        } catch (err) {
            console.error('Erro ao salvar:', err.response?.data ?? err.message, err);
            setError(err.response?.data?.message ?? 'Erro ao salvar as alterações!');
        } finally{
            setIsLoading(false);
        }
    };
    if (isLoading) {}
    if (error) {}
    return(// <AdminAuthGuard> // Se você já criou o AdminAuthGuard
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "page-container",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: handleSaveChanges,
            className: "editor-form-card",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "form-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: "Editando Questionário"
                        }, void 0, false, {
                            fileName: "[project]/src/app/questionarios/page.tsx",
                            lineNumber: 173,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-header-actions",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>router.push("/questionarios"),
                                    className: "btn-secondary",
                                    children: "Cancelar"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/questionarios/page.tsx",
                                    lineNumber: 175,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "btn-primary",
                                    disabled: isLoading,
                                    children: isLoading ? "Salvando..." : "Salvar Alterações"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/questionarios/page.tsx",
                                    lineNumber: 176,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/questionarios/page.tsx",
                            lineNumber: 174,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/questionarios/page.tsx",
                    lineNumber: 172,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "display-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "titulo-input",
                            children: "Título"
                        }, void 0, false, {
                            fileName: "[project]/src/app/questionarios/page.tsx",
                            lineNumber: 183,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "titulo-input",
                            type: "text",
                            value: titulo,
                            onChange: (e)=>setTitulo(e.target.value),
                            className: "input-edit-mode title-input"
                        }, void 0, false, {
                            fileName: "[project]/src/app/questionarios/page.tsx",
                            lineNumber: 184,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/questionarios/page.tsx",
                    lineNumber: 182,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "display-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "perguntas-list",
                            children: "Perguntas"
                        }, void 0, false, {
                            fileName: "[project]/src/app/questionarios/page.tsx",
                            lineNumber: 188,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            id: "perguntas-list",
                            className: "perguntas-edit-list",
                            children: [
                                quePergs.map((qp, qIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pergunta-editor-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                value: qp.pergunta.enunciado,
                                                onChange: (e)=>handlePerguntaChange(qIndex, e.target.value),
                                                className: "input-edit-mode question-textarea",
                                                rows: 2,
                                                placeholder: "Digite o enunciado da pergunta"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/questionarios/page.tsx",
                                                lineNumber: 199,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "pergunta-meta-editor",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        htmlFor: `tipo-pergunta-${qIndex}`,
                                                        children: "Tipo de Pergunta"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/questionarios/page.tsx",
                                                        lineNumber: 207,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        id: `tipo-pergunta-${qIndex}`,
                                                        value: qp.pergunta.tipos,
                                                        onChange: (e)=>handleTipoChange(qIndex, e.target.value),
                                                        className: "select-tipo-pergunta",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "TEXTO",
                                                                children: "Texto"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/questionarios/page.tsx",
                                                                lineNumber: 214,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "MULTIPLA_ESCOLHA",
                                                                children: "Múltipla Escolha"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/questionarios/page.tsx",
                                                                lineNumber: 215,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/questionarios/page.tsx",
                                                        lineNumber: 208,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/questionarios/page.tsx",
                                                lineNumber: 206,
                                                columnNumber: 33
                                            }, this),
                                            qp.pergunta.tipos === 'MULTIPLA_ESCOLHA' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "opcoes-editor-container",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "label",
                                                        children: "Opções de Resposta"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/questionarios/page.tsx",
                                                        lineNumber: 221,
                                                        columnNumber: 41
                                                    }, this),
                                                    qp.pergunta.opcoes.map((opt, oIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "opcao-editor-item",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: opt.texto,
                                                                    onChange: (e)=>handleOptionChange(qIndex, oIndex, e.target.value),
                                                                    placeholder: `Opção ${oIndex + 1}`,
                                                                    className: "input-edit-mode"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/questionarios/page.tsx",
                                                                    lineNumber: 224,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>removeOption(qIndex, oIndex),
                                                                    className: "btn-remover-opcao",
                                                                    children: "×"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/questionarios/page.tsx",
                                                                    lineNumber: 231,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, `q${qIndex}-o${oIndex}`, true, {
                                                            fileName: "[project]/src/app/questionarios/page.tsx",
                                                            lineNumber: 223,
                                                            columnNumber: 45
                                                        }, this)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>addOption(qIndex),
                                                        className: "btn-adicionar-opcao",
                                                        children: "+ Adicionar Opção"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/questionarios/page.tsx",
                                                        lineNumber: 236,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/questionarios/page.tsx",
                                                lineNumber: 220,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, qp.pergunta.id ?? `nova-pergunta-${qIndex}`, true, {
                                        fileName: "[project]/src/app/questionarios/page.tsx",
                                        lineNumber: 191,
                                        columnNumber: 29
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: handleAddPergunta,
                                    className: "btn-adicionar-opcao" // Reutilize ou crie um estilo novo
                                    ,
                                    style: {
                                        marginTop: '1rem',
                                        width: '100%'
                                    },
                                    children: "+ Adicionar Nova Pergunta ao Questionário"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/questionarios/page.tsx",
                                    lineNumber: 244,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/questionarios/page.tsx",
                            lineNumber: 189,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/questionarios/page.tsx",
                    lineNumber: 187,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/questionarios/page.tsx",
            lineNumber: 171,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/questionarios/page.tsx",
        lineNumber: 170,
        columnNumber: 9
    }, this));
}
_s(EditQuestionarioForm, "UYx4Lk2VxSXn5RlIwfZgaenwcxE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = EditQuestionarioForm;
var _c;
__turbopack_refresh__.register(_c, "EditQuestionarioForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/questionarios/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=src_80266a._.js.map