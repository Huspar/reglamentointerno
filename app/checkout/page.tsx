"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuditErrorPanel, { AuditIssue } from "@/components/AuditErrorPanel";

const STORAGE_KEY = "draftReglamento";

export default function CheckoutPage() {
    const [hasData, setHasData] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [auditIssues, setAuditIssues] = useState<AuditIssue[]>([]);
    const topRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            router.replace("/generar");
        } else {
            setHasData(true);
        }
    }, [router]);

    const handleDownload = async () => {
        setDownloading(true);
        setError(null);
        setAuditIssues([]);

        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                setError("No se encontraron datos del formulario.");
                return;
            }

            const res = await fetch("/api/generate-doc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: raw,
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => null);

                // Manejo especial para errores de auditoría (422)
                if (res.status === 422 && errData?.issues) {
                    setAuditIssues(errData.issues);
                    // Scroll to top to see error panel
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    return;
                }

                throw new Error(errData?.error || "Error al generar el documento.");
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "reglamento-interno.docx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido.");
        } finally {
            setDownloading(false);
        }
    };

    if (!hasData) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <section ref={topRef} className="min-h-[60vh] flex items-center justify-center py-16">
            <div className="max-w-2xl mx-auto px-4 text-center">

                {auditIssues.length > 0 && (
                    <AuditErrorPanel
                        issues={auditIssues}
                        onContinue={() => handleDownload(true)}
                        isDownloading={downloading}
                    />
                )}

                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-primary">
                    Checkout
                </h1>
                <p className="mt-4 text-neutral-600 leading-relaxed text-sm">
                    La pasarela de pago estará disponible próximamente.
                    Mientras tanto, puedes descargar el documento en modo prueba.
                </p>

                <div className="mt-6 bg-neutral-50 rounded-xl border border-neutral-100 p-5 inline-block">
                    <p className="text-2xl font-extrabold text-primary">
                        $39.990 <span className="text-sm font-medium text-neutral-400">CLP</span>
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">Pago único</p>
                </div>

                {/* Download button */}
                <div className="mt-8">
                    <button
                        onClick={() => handleDownload(false)}
                        disabled={downloading}
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors shadow-lg shadow-accent/20 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {downloading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Generando...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Descargar documento (modo prueba)
                            </>
                        )}
                    </button>

                    {auditIssues.length > 0 && (
                        <p className="mt-3 text-red-600 text-xs font-medium">
                            ⚠️ Por favor corrige los errores arriba antes de descargar.
                        </p>
                    )}
                </div>

                {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <p className="mt-3 text-[11px] text-neutral-400">
                    El pago será requerido una vez habilitada la pasarela.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/preview"
                        className="px-5 py-2.5 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
                    >
                        ← Volver a la vista previa
                    </Link>
                    <Link
                        href="/"
                        className="px-5 py-2.5 text-sm font-medium text-accent hover:underline"
                    >
                        Ir al inicio
                    </Link>
                </div>
            </div>
        </section>
    );
}
