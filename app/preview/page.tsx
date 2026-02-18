"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { WizardData } from "@/lib/schemas";

const STORAGE_KEY = "draftReglamento";

const rubroLabels: Record<string, string> = {
    comercio: "Comercio",
    servicios: "Servicios",
    construccion: "Construcción",
    industria: "Industria",
    otro: "Otro",
};

const prohibicionLabels: Record<string, string> = {
    consumo_alcohol: "consumo de bebidas alcohólicas o sustancias ilícitas en el lugar de trabajo",
    violencia: "ejercer violencia física o verbal contra cualquier persona dentro de las dependencias",
    acoso: "realizar conductas de acoso laboral o sexual en cualquiera de sus formas",
    uso_indebido_equipos: "usar indebidamente los equipos, herramientas o recursos proporcionados por la empresa",
};

export default function PreviewPage() {
    const [data, setData] = useState<WizardData | null>(null);
    const router = useRouter();

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                setData(JSON.parse(raw));
            } else {
                router.replace("/generar");
            }
        } catch {
            router.replace("/generar");
        }
    }, [router]);

    if (!data) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const today = new Date();
    const formattedDate = today.toLocaleDateString("es-CL", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <section className="bg-neutral-100 py-8 sm:py-12 min-h-screen">
            <div className="max-w-[1100px] mx-auto px-4">
                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-primary">Vista previa del Reglamento</h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            Revisa el documento antes de finalizar tu compra.
                        </p>
                    </div>
                    <Link
                        href="/generar"
                        className="text-sm text-accent font-medium hover:underline"
                    >
                        ← Editar datos
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* ═══════ DOCUMENTO A4 ═══════ */}
                    <div className="flex-1 min-w-0">
                        <div className="relative">
                            {/* A4 Sheet */}
                            <div className="bg-white rounded-lg shadow-md border border-neutral-200 overflow-hidden">
                                <div className="px-10 sm:px-16 py-12 sm:py-16 font-serif text-neutral-800 text-[15px] leading-[1.8]">

                                    {/* ─── PORTADA ─── */}
                                    <div className="text-center mb-12 pb-10 border-b-2 border-neutral-300">
                                        <p className="text-xs tracking-[0.3em] text-neutral-400 uppercase mb-6">
                                            Documento oficial
                                        </p>
                                        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight tracking-tight font-sans">
                                            REGLAMENTO INTERNO DE<br />
                                            ORDEN, HIGIENE Y SEGURIDAD
                                        </h2>
                                        <div className="mt-8 space-y-1 text-sm text-neutral-600">
                                            <p className="font-semibold text-base text-neutral-800">{data.razonSocial}</p>
                                            <p>RUT: {data.rutEmpresa}</p>
                                            {data.domicilio && <p>{data.domicilio}{data.comuna ? `, ${data.comuna}` : ""}{data.region ? `, ${data.region}` : ""}</p>}
                                        </div>
                                        <p className="mt-6 text-xs text-neutral-400">{formattedDate}</p>
                                    </div>

                                    {/* ─── CAPÍTULO I ─── */}
                                    <div className="mb-10">
                                        <h3 className="text-base font-bold text-neutral-900 uppercase tracking-wide mb-4 font-sans">
                                            Capítulo I — Identificación de la Empresa
                                        </h3>
                                        <p className="mb-3">
                                            <strong>Artículo 1°.</strong> El presente Reglamento Interno de Orden, Higiene y Seguridad
                                            se aplicará en la empresa <strong>{data.razonSocial}</strong>, RUT <strong>{data.rutEmpresa}</strong>,
                                            cuyo giro es <strong>{data.giro}</strong>
                                            {data.domicilio ? <>, con domicilio en <strong>{data.domicilio}</strong></> : ""}.
                                        </p>
                                        <p className="mb-3">
                                            <strong>Artículo 2°.</strong> La representación legal de la empresa es ejercida por
                                            don(ña) <strong>{data.nombreCompleto}</strong>, RUT <strong>{data.rutRepresentante}</strong>,
                                            en su calidad de <strong>{data.cargo}</strong>.
                                        </p>
                                        <p>
                                            <strong>Artículo 3°.</strong> La empresa cuenta actualmente con un rango
                                            de <strong>{data.numTrabajadores}</strong> trabajadores, desempeñándose
                                            en el rubro de <strong>{rubroLabels[data.rubro] || data.rubro}</strong>.
                                            {data.mutualidad ? <> La mutualidad a la que se encuentra adherida es <strong>{data.mutualidad}</strong>.</> : ""}
                                        </p>
                                    </div>

                                    {/* ─── CAPÍTULO II ─── */}
                                    <div className="mb-10">
                                        <h3 className="text-base font-bold text-neutral-900 uppercase tracking-wide mb-4 font-sans">
                                            Capítulo II — Objeto y Alcance
                                        </h3>
                                        <p className="mb-3">
                                            <strong>Artículo 4°.</strong> El presente Reglamento tiene por objeto establecer las
                                            normas de orden, higiene y seguridad que deben observar todos los trabajadores de
                                            la empresa, en conformidad con lo dispuesto en el Título III del Libro I del
                                            Código del Trabajo y demás normas legales concordantes.
                                        </p>
                                        <p className="mb-3">
                                            <strong>Artículo 5°.</strong> Las disposiciones de este Reglamento obligan a todos
                                            los trabajadores de la empresa, sin distinción de cargo o función, quienes
                                            deberán conocer y cumplir las normas aquí contenidas desde la fecha de su
                                            ingreso.
                                        </p>
                                        <p>
                                            <strong>Artículo 6°.</strong> La empresa proporcionará gratuitamente un ejemplar
                                            de este Reglamento a cada trabajador, dejando constancia escrita de su recepción.
                                        </p>
                                    </div>

                                    {/* ─── CAPÍTULO III ─── */}
                                    <div className="mb-10">
                                        <h3 className="text-base font-bold text-neutral-900 uppercase tracking-wide mb-4 font-sans">
                                            Capítulo III — Jornada de Trabajo y Asistencia
                                        </h3>
                                        <p className="mb-3">
                                            <strong>Artículo 7°.</strong> La jornada ordinaria de trabajo será
                                            de <strong>{data.jornadaGeneral}</strong>, sin perjuicio de las modificaciones
                                            que se acuerden conforme a la ley.
                                        </p>
                                        <p className="mb-3">
                                            <strong>Artículo 8°.</strong> {data.controlAsistencia === "si"
                                                ? "La empresa utilizará un sistema de control de asistencia conforme a la normativa vigente. Todo trabajador deberá registrar su hora de ingreso y salida diariamente."
                                                : "El control de asistencia se realizará conforme a los mecanismos que la empresa determine, en cumplimiento de la normativa laboral vigente."
                                            }
                                        </p>
                                        <p>
                                            <strong>Artículo 9°.</strong> {data.trabajoRemoto === "si"
                                                ? "La empresa contempla modalidades de trabajo remoto o teletrabajo, las cuales se regirán por las disposiciones del contrato individual y la legislación aplicable."
                                                : "Los trabajadores deberán prestar sus servicios de forma presencial en las dependencias de la empresa, salvo autorización expresa de la administración."
                                            }
                                        </p>
                                    </div>

                                    {/* ─── CAPÍTULO IV (parcial) ─── */}
                                    <div className="mb-6">
                                        <h3 className="text-base font-bold text-neutral-900 uppercase tracking-wide mb-4 font-sans">
                                            Capítulo IV — Normas de Conducta y Prohibiciones
                                        </h3>
                                        <p className="mb-3">
                                            <strong>Artículo 10°.</strong> Son obligaciones de los trabajadores, entre otras:
                                            cumplir con el horario de trabajo establecido, mantener una conducta respetuosa
                                            hacia sus compañeros y superiores, y cuidar los bienes de la empresa.
                                        </p>
                                        {data.prohibiciones && data.prohibiciones.length > 0 && (
                                            <div>
                                                <p className="mb-2">
                                                    <strong>Artículo 11°.</strong> Queda estrictamente prohibido a todo trabajador:
                                                </p>
                                                <ul className="list-none space-y-1 ml-6">
                                                    {data.prohibiciones.slice(0, 2).map((p, i) => (
                                                        <li key={p} className="before:content-['-'] before:mr-2">
                                                            {String.fromCharCode(97 + i)}) {prohibicionLabels[p] || p};
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {/* ─── CAPÍTULO V (inicio, se corta) ─── */}
                                    <div>
                                        <h3 className="text-base font-bold text-neutral-900 uppercase tracking-wide mb-4 font-sans">
                                            Capítulo V — Higiene y Seguridad
                                        </h3>
                                        <p className="mb-3">
                                            <strong>Artículo 12°.</strong> La empresa adoptará todas las medidas necesarias
                                            para proteger eficazmente la vida y salud de los trabajadores, conforme a lo
                                            establecido en la Ley 16.744 y su reglamentación complementaria.
                                        </p>
                                        <p>
                                            <strong>Artículo 13°.</strong> {data.usoEPP === "si"
                                                ? "Todo trabajador que desempeñe funciones que requieran el uso de Equipos de Protección Personal (EPP) estará obligado a utilizarlos..."
                                                : "La empresa proporcionará las condiciones de seguridad adecuadas según la naturaleza de las labores..."
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ═══════ OVERLAY BLUR ═══════ */}
                            <div
                                className="absolute bottom-0 left-0 right-0 rounded-b-lg overflow-hidden"
                                style={{ height: "45%" }}
                            >
                                <div className="absolute inset-0 backdrop-blur-[6px] bg-gradient-to-t from-white via-white/95 to-white/0" />
                                <div className="relative h-full flex flex-col items-center justify-end pb-10 px-6">
                                    <div className="text-center">
                                        <svg className="w-10 h-10 text-neutral-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                        <p className="text-neutral-700 font-semibold text-base mb-1">
                                            Vista previa parcial
                                        </p>
                                        <p className="text-neutral-500 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
                                            Para descargar el documento completo debes finalizar el pago.
                                        </p>
                                        <Link
                                            href="/checkout"
                                            className="inline-flex items-center px-8 py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors shadow-lg shadow-accent/20 text-sm"
                                        >
                                            Finalizar pago y descargar
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ═══════ QUÉ RECIBIRÁS ═══════ */}
                        <div className="mt-8 bg-white rounded-xl border border-neutral-200 p-6">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wide mb-4">
                                ¿Qué recibirás?
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    { icon: "📄", text: "Documento completo con todos los capítulos" },
                                    { icon: "✏️", text: "Formato editable para ajustar a tu empresa" },
                                    { icon: "✅", text: "Listo para aplicar y entregar a tus trabajadores" },
                                ].map((item) => (
                                    <li key={item.text} className="flex items-start gap-3">
                                        <span className="text-lg" role="img" aria-hidden>{item.icon}</span>
                                        <span className="text-sm text-neutral-700">{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* ═══════ PANEL LATERAL ═══════ */}
                    <div className="lg:w-[300px] shrink-0">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
                                <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold mb-3">
                                    Tu reglamento
                                </p>
                                <p className="text-3xl font-extrabold text-primary tracking-tight">
                                    $39.990
                                    <span className="text-sm font-medium text-neutral-400 ml-1">CLP</span>
                                </p>
                                <p className="text-xs text-neutral-500 mt-1 mb-6">
                                    Pago único · Sin mensualidades
                                </p>

                                <ul className="space-y-3 mb-6 text-sm text-neutral-600">
                                    {[
                                        "Descarga inmediata",
                                        "Documento editable",
                                        "Datos de tu empresa incluidos",
                                        "Estructura legal completa",
                                    ].map((t) => (
                                        <li key={t} className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {t}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/checkout"
                                    className="block w-full text-center px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors shadow-sm text-sm"
                                >
                                    Finalizar pago
                                </Link>

                                <p className="text-center text-[11px] text-neutral-400 mt-3">
                                    Pago seguro · Satisfacción garantizada
                                </p>
                            </div>

                            {/* Empresa info mini */}
                            <div className="mt-4 bg-neutral-50 rounded-xl border border-neutral-100 p-4">
                                <p className="text-xs text-neutral-400 font-medium mb-2">Documento para:</p>
                                <p className="text-sm font-semibold text-primary">{data.razonSocial}</p>
                                <p className="text-xs text-neutral-500">{data.rutEmpresa}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
