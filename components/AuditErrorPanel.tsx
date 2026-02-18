import Link from "next/link";
import { useState } from "react";

export type AuditIssue = {
    severity: "info" | "warn" | "error";
    code: string;
    message: string;
    where?: { chapterTitle?: string; articleNumber?: number };
    snippet?: string;
};

interface AuditErrorPanelProps {
    issues: AuditIssue[];
    onContinue?: () => void;
    isDownloading?: boolean;
}

// Mapa de códigos a textos humanos
const HUMAN_TITLES: Record<string, string> = {
    JORNADA_INCONSISTENTE: "Inconsistencia en Jornada Laboral",
    RUBRO_GIRO_INCOHERENTE: "Coherencia de Rubro y Giro",
    EMAIL_PLACEHOLDER: "Email de contacto inválido",
    PLACEHOLDER_FOUND: "Datos incompletos detectados",
    ARTICULO_9_RIGIDO: "Flexibilidad Normativa (Art. 9)",
    PROHIBITED_STRING: "Referencia rígida a autoridad",
    REPETITIVE_START: "Redacción repetitiva",
};

// Mapa de errores a pasos del wizard
const ERROR_STEP_MAP: Record<string, number> = {
    RUBRO_GIRO_INCOHERENTE: 1,
    EMAIL_PLACEHOLDER: 1,
    PLACEHOLDER_FOUND: 1,
    JORNADA_INCONSISTENTE: 4,
    ARTICULO_9_RIGIDO: 6,
    PROHIBITED_STRING: 6,
};

export default function AuditErrorPanel({ issues, onContinue, isDownloading }: AuditErrorPanelProps) {
    if (!issues || issues.length === 0) return null;

    // Detectar si hay errores bloqueantes
    const hasErrors = issues.some(i => i.severity === "error");
    const isWarningOnly = !hasErrors;

    // Agrupar issues por código Y snippet base (para evitar spam visual)
    const groupedIssues = issues.reduce((acc, issue) => {
        const key = issue.code + (issue.snippet ? issue.snippet.substring(0, 20) : "");
        if (!acc[key]) {
            acc[key] = { ...issue, count: 1, locations: [issue.where?.chapterTitle].filter(Boolean) };
        } else {
            acc[key].count++;
            if (issue.where?.chapterTitle && !acc[key].locations.includes(issue.where?.chapterTitle)) {
                acc[key].locations.push(issue.where?.chapterTitle);
            }
        }
        return acc;
    }, {} as Record<string, AuditIssue & { count: number, locations: (string | undefined)[] }>);

    const displayIssues = Object.values(groupedIssues).sort((a, b) => {
        if (a.severity === "error" && b.severity !== "error") return -1;
        if (a.severity !== "error" && b.severity === "error") return 1;
        return 0;
    });

    const containerStyle = isWarningOnly
        ? "bg-amber-50/50 border-amber-100"
        : "bg-red-50 border-red-100";

    const iconColor = isWarningOnly ? "text-amber-600 bg-amber-100" : "text-red-600 bg-red-100";
    const textColor = isWarningOnly ? "text-amber-900" : "text-red-900";
    const subTextColor = isWarningOnly ? "text-amber-700" : "text-red-700";

    return (
        <div className={`border rounded-xl p-6 mb-6 text-left shadow-sm ${containerStyle}`}>
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full shrink-0 ${iconColor}`}>
                    {isWarningOnly ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    )}
                </div>
                <div className="flex-1">
                    <h3 className={`text-lg font-bold ${textColor}`}>
                        {isWarningOnly
                            ? "Revisiones recomendadas antes de generar el documento"
                            : "Necesitamos ajustar algunos datos antes de generar el documento"}
                    </h3>
                    <p className={`text-sm mt-1 ${subTextColor}`}>
                        {isWarningOnly
                            ? "Puedes continuar, pero te sugerimos revisar estos puntos para mayor flexibilidad normativa."
                            : "Esto garantiza que tu reglamento se genere correctamente y cumpla con la normativa."}
                    </p>

                    <div className="mt-5 space-y-3">
                        {displayIssues.map((issue, idx) => {
                            const step = ERROR_STEP_MAP[issue.code];
                            const title = HUMAN_TITLES[issue.code] || issue.code.replace(/_/g, " ");
                            const isErr = issue.severity === "error";

                            return (
                                <div key={idx} className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            {isErr ? (
                                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                            ) : (
                                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                                            )}
                                            <span className="text-sm font-bold text-neutral-800">
                                                {title}
                                            </span>
                                            {issue.count > 1 && (
                                                <span className="text-[10px] bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full font-medium">
                                                    {issue.count} referencias
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-neutral-500 font-medium ml-4">
                                            {issue.message}
                                        </p>

                                        {issue.locations.length > 0 && (
                                            <p className="text-[10px] text-neutral-400 ml-4">
                                                Detectado en: {issue.locations.slice(0, 2).join(", ")} {issue.locations.length > 2 ? "..." : ""}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 pl-4 sm:border-l sm:border-neutral-100">
                                        {step && (
                                            <Link
                                                href={`/generar?step=${step}`}
                                                className="shrink-0 px-4 py-2 bg-neutral-50 text-neutral-600 text-xs font-semibold rounded-lg hover:bg-neutral-100 transition-colors border border-neutral-200"
                                            >
                                                Revisar
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                        {isWarningOnly ? (
                            <>
                                <button
                                    onClick={onContinue}
                                    disabled={isDownloading}
                                    className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                                >
                                    {isDownloading ? "Generando..." : "Generar documento"}
                                </button>
                                <Link
                                    href="/generar"
                                    className="inline-flex items-center justify-center px-6 py-2.5 bg-white text-neutral-600 text-sm font-medium rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
                                >
                                    Revisar todo
                                </Link>
                            </>
                        ) : (
                            <Link
                                href="/generar"
                                className="inline-flex items-center justify-center px-6 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                            >
                                Volver y corregir
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
