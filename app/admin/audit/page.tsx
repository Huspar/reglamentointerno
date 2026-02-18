
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Metrics = {
    stats: {
        totalEvents: number;
        autofixRate: string;
        eventsWithAutofix: number;
    };
    topIssues: Array<{ code: string; count: number; percentage: number }>;
    topFixes: Array<{ code: string; count: number; percentage: number }>;
    lastEvents: Array<any>;
};

export default function AuditAdminPage() {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/audit-telemetry")
            .then(res => res.json())
            .then(data => {
                setMetrics(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando métricas...</div>;
    if (!metrics) return <div className="p-8 text-center">No hay datos disponibles.</div>;

    // Check for smart suggestions (Fix > 30%)
    const suggestions = metrics.topFixes.filter(f => f.percentage > 30);

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Panel de Telemetría de Auditoría</h1>
                        <p className="text-slate-600">Monitoreo de rendimiento del auditor y autofixes.</p>
                    </div>
                    <Link href="/" className="text-blue-600 hover:underline">Volver al Inicio</Link>
                </header>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card title="Total Generaciones" value={metrics.stats.totalEvents} sub="Eventos registrados" />
                    <Card title="Tasa de Autofix" value={`${metrics.stats.autofixRate}%`} sub={`${metrics.stats.eventsWithAutofix} documentos corregidos auto.`} />
                    <Card title="Top Issue" value={metrics.topIssues[0]?.code || "N/A"} sub="El error más común" />
                </div>

                {/* ALERTS / SUGGESTIONS */}
                {suggestions.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                        <h3 className="text-blue-800 font-semibold mb-2">💡 Recomendaciones de Mejora (Auto-Detectadas)</h3>
                        <ul className="list-disc list-inside text-blue-700">
                            {suggestions.map(s => (
                                <li key={s.code}>
                                    El fix <strong>{s.code}</strong> se aplica en el <strong>{s.percentage.toFixed(1)}%</strong> de los casos.
                                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Sugerencia: Promover al builder</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* TOP ISSUES */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold mb-4 text-slate-800">Top Problemas Detectados</h3>
                        <div className="space-y-3">
                            {metrics.topIssues.map((item, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-slate-600 font-medium font-mono text-sm">{item.code}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-400" style={{ width: `${Math.min(item.percentage, 100)}%` }}></div>
                                        </div>
                                        <span className="text-sm font-bold w-8 text-right">{item.count}</span>
                                    </div>
                                </div>
                            ))}
                            {metrics.topIssues.length === 0 && <p className="text-slate-400 italic">Sin datos aún.</p>}
                        </div>
                    </div>

                    {/* TOP FIXES */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold mb-4 text-slate-800">Autofixes Más Aplicados</h3>
                        <div className="space-y-3">
                            {metrics.topFixes.map((item, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-slate-600 font-medium font-mono text-sm">{item.code}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-400" style={{ width: `${Math.min(item.percentage, 100)}%` }}></div>
                                        </div>
                                        <span className="text-sm font-bold w-8 text-right">{item.count}</span>
                                    </div>
                                </div>
                            ))}
                            {metrics.topFixes.length === 0 && <p className="text-slate-400 italic">Sin datos aún.</p>}
                        </div>
                    </div>
                </div>

                {/* RECENT EVENTS TABLE */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800">Últimos 20 Eventos</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Timestamp</th>
                                    <th className="px-6 py-3">Variante</th>
                                    <th className="px-6 py-3">Autofix?</th>
                                    <th className="px-6 py-3">Issues</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {metrics.lastEvents.map((evt) => (
                                    <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-slate-600">{new Date(evt.createdAt).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium">
                                                {evt.modelVariant}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {evt.autofixApplied ? (
                                                <span className="text-emerald-600 font-bold">Sí</span>
                                            ) : (
                                                <span className="text-slate-400">No</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate text-slate-500" title={evt.issues.map((i: any) => i.code).join(", ")}>
                                            {evt.issues.length} problemas
                                        </td>
                                    </tr>
                                ))}
                                {metrics.lastEvents.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400">No hay eventos registrados.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}

function Card({ title, value, sub }: { title: string, value: string | number, sub: string }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wide mb-2">{title}</h3>
            <div className="text-4xl font-bold text-slate-900 mb-1">{value}</div>
            <div className="text-slate-400 text-sm">{sub}</div>
        </div>
    );
}
