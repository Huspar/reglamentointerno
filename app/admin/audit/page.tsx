import Link from "next/link";
import { getAuditMetrics } from "@/app/actions/getAuditMetrics";


export const dynamic = 'force-dynamic';

export default async function AuditAdminPage() {
    let metrics = null;
    let error = null;

    try {
        metrics = await getAuditMetrics();
    } catch (e) {
        console.error(e);
        error = "Error al cargar datos de auditoría.";
    }

    if (error) return <div className="p-12 text-center text-red-500">{error}</div>;
    if (!metrics) return <div className="p-12 text-center text-slate-500">Cargando métricas...</div>;

    // Suggestions based on presence rate > 30%
    const suggestions = metrics.topFixes.byDocPresence.filter(f => f.presenceRate > 30);

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Panel de Telemetría de Auditoría</h1>
                        <p className="text-slate-500 mt-1">Monitoreo de calidad normativa y correcciones automáticas.</p>
                    </div>
                    <Link href="/" className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors">
                        ← Volver al Generador
                    </Link>
                </header>

                {/* PROMOTED RULES BANNER */}
                {metrics.promotions && metrics.promotions.length > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
                        <h3 className="text-purple-900 font-bold text-lg mb-3 flex items-center gap-2">
                            <span>🚀</span> Reglas Promovidas al Builder
                        </h3>
                        <p className="text-sm text-purple-700 mb-4">
                            Estas correcciones han sido tan frecuentes que ahora se aplican por defecto (ya no cuentan como autofixes).
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {metrics.promotions.map(p => (
                                <div key={p.id} className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm flex justify-between items-center">
                                    <div>
                                        <div className="font-mono text-sm font-bold text-purple-900">{p.code}</div>
                                        <div className="text-xs text-purple-500">Promovido el {new Date(p.at).toLocaleDateString()}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-purple-700">{p.rate.toFixed(0)}%</div>
                                        <div className="text-[10px] text-purple-400 uppercase">Presence</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card
                        title="Documentos Generados"
                        value={metrics.kpis.totalEvents}
                        sub="Últimos 30 días"
                        icon="📄"
                    />
                    <Card
                        title="Tasa de Autofix"
                        value={`${metrics.kpis.autofixRateDocs}%`}
                        sub={`${metrics.kpis.docsWithAutofix} docs corregidos`}
                        icon="🛠️"
                        trend={parseFloat(metrics.kpis.autofixRateDocs) > 50 ? 'high' : 'normal'}
                    />
                    <Card
                        title="Tasa de Error"
                        value={`${metrics.kpis.errorRateDocs}%`}
                        sub={`${metrics.kpis.docsWithError} fallidos`}
                        icon="⚠️"
                        trend={parseFloat(metrics.kpis.errorRateDocs) > 0 ? 'bad' : 'good'}
                    />
                    <Card
                        title="Intensidad de Fixes"
                        value={metrics.kpis.avgFixesPerDoc}
                        sub="Promedio fixes / doc"
                        icon="📊"
                    />
                </div>

                {/* Recommendations */}
                {suggestions.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg className="w-24 h-24 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" /></svg>
                        </div>
                        <h3 className="text-blue-900 font-bold text-lg mb-3 flex items-center gap-2">
                            <span>💡</span> Oportunidades de Mejora
                        </h3>
                        <div className="space-y-3 relative z-10">
                            {suggestions.map(s => (
                                <div key={s.code} className="flex items-start gap-3 text-blue-800 bg-white/60 p-3 rounded-lg">
                                    <span className="font-mono font-bold text-sm bg-blue-200 px-2 py-1 rounded text-blue-900">{s.code}</span>
                                    <div>
                                        <p className="text-sm">
                                            Presente en el <strong>{s.presenceRate.toFixed(1)}%</strong> de los documentos ({s.docsWithFix}/{metrics.kpis.totalEvents}).
                                        </p>
                                        <p className="text-xs text-blue-600 font-medium mt-1">Sugerencia: Este patrón es muy común. Considera actualizar el `ReglamentoBuilder` para incluirlo por defecto.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Issues */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span>🚫</span> Top Errores (Bloqueantes)
                        </h3>
                        <div className="space-y-4 flex-1">
                            {metrics.topIssues.map((item: any, i: number) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-slate-700 font-medium text-sm font-mono">{item.code}</span>
                                        <span className="text-slate-900 font-bold text-sm">{item.count}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-red-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${(item.count / metrics.kpis.totalEvents) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                            {metrics.topIssues.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                                    <span className="text-4xl mb-2">🎉</span>
                                    <p>Sin errores en los últimos 30 días.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Fixes (Simple List for Server Component simplicity) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <span>🛠️</span> Autofixes (Por Presencia)
                            </h3>
                        </div>

                        <div className="space-y-4 flex-1">
                            {metrics.topFixes.byDocPresence.map((item: any, i: number) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-slate-700 font-medium text-sm font-mono" title={`${item.docsWithFix} documentos`}>{item.code}</span>
                                        <span className="text-slate-900 font-bold text-sm">{item.presenceRate.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${item.presenceRate}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}

                            {metrics.topFixes.byCount.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                                    <p>No se han aplicado fixes.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* History Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-bold text-slate-700">Historial Reciente</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3">Fecha</th>
                                    <th className="px-6 py-3">Variante (Rubro_Tamaño)</th>
                                    <th className="px-6 py-3">Estado</th>
                                    <th className="px-6 py-3">Detalle</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {metrics.recentEvents.map((evt: any) => (
                                    <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                                            {new Date(evt.createdAt).toLocaleString('es-CL')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${evt.modelVariant.includes('unknown')
                                                ? 'bg-gray-100 text-gray-600 border-gray-200'
                                                : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                                }`}>
                                                {evt.modelVariant}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {evt.autofixApplied && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-700">
                                                        Autofix
                                                    </span>
                                                )}
                                                {evt.hasError && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">
                                                        Error
                                                    </span>
                                                )}
                                                {!evt.autofixApplied && !evt.hasError && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-600">
                                                        OK
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                                            {evt.issues?.length > 0 ? (
                                                <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">{evt.issues.map((i: any) => i.code).slice(0, 2).join(", ")}{evt.issues.length > 2 ? '...' : ''}</code>
                                            ) : (
                                                <span className="text-slate-400 italic">Sin observaciones</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Card({ title, value, sub, icon, trend }: { title: string, value: string | number, sub: string, icon: string, trend?: 'high' | 'normal' | 'good' | 'bad' }) {
    let trendColor = "text-slate-900";
    if (trend === 'high') trendColor = "text-amber-600";
    if (trend === 'bad') trendColor = "text-red-600";
    if (trend === 'good') trendColor = "text-emerald-600";

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</h3>
                <span className="text-2xl opacity-80 filter grayscale hover:grayscale-0 transition-all">{icon}</span>
            </div>
            <div>
                <div className={`text-3xl font-bold mb-1 ${trendColor}`}>{value}</div>
                <div className="text-slate-400 text-sm font-medium">{sub}</div>
            </div>
        </div>
    );
}
