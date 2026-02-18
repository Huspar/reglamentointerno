"use client";

import type { WizardData } from "@/lib/schemas";

interface Props {
    data: WizardData;
}

const rubroLabels: Record<string, string> = {
    comercio: "Comercio",
    servicios: "Servicios",
    construccion: "Construcción",
    industria: "Industria",
    otro: "Otro",
};

const prohibicionLabels: Record<string, string> = {
    consumo_alcohol: "Consumo de alcohol en el lugar de trabajo",
    consumo_drogas: "Consumo de drogas en horario laboral",
    violencia: "Violencia física o verbal",
    acoso: "Acoso laboral o sexual",
    discriminacion: "Discriminación o trato ofensivo",
    llegadas_reiteradas: "Llegadas reiteradas injustificadas",
    no_uso_epp: "No uso de EPP",
    manipulacion_maquinaria: "Manipulación indebida de maquinaria",
    incumplimiento_protocolos: "Incumplimiento de protocolos de seguridad",
    ingreso_no_autorizado: "Ingreso de personas externas sin autorización",
    uso_indebido_equipos: "Uso indebido de equipos computacionales",
    software_no_autorizado: "Instalación de software no autorizado",
    correo_fines_personales: "Uso del correo corporativo para fines personales",
    filtracion_info: "Filtración de información confidencial",
};

const procedimientoLabels: Record<string, string> = {
    escalonado: "Escalonado (amonestación → suspensión → desvinculación)",
    segun_gravedad: "Según gravedad de la falta",
    personalizado: "Personalizado",
};

function SectionCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-neutral-50 rounded-xl border border-neutral-100 p-5">
            <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-wide">
                {title}
            </h3>
            {children}
        </div>
    );
}

function DataRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-start py-1.5 border-b border-neutral-100 last:border-0">
            <span className="text-xs text-neutral-500 w-2/5">{label}</span>
            <span className="text-sm text-neutral-800 font-medium w-3/5 text-right">
                {value || "—"}
            </span>
        </div>
    );
}

export default function StepConfirmacion({ data }: Props) {
    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-bold text-primary mb-1">Confirmación</h2>
                <p className="text-sm text-neutral-500">
                    Revisa los datos antes de generar la vista previa. Puedes volver a
                    cualquier paso para corregir.
                </p>
            </div>

            <SectionCard title="Empresa">
                <DataRow label="Razón social" value={data.razonSocial} />
                <DataRow label="RUT" value={data.rutEmpresa} />
                <DataRow label="Giro" value={data.giro} />
                <DataRow label="Domicilio" value={data.domicilio || ""} />
                <DataRow label="Comuna" value={data.comuna || ""} />
                <DataRow label="Región" value={data.region || ""} />
            </SectionCard>

            <SectionCard title="Representante Legal">
                <DataRow label="Nombre" value={data.nombreCompleto} />
                <DataRow label="RUT" value={data.rutRepresentante} />
                <DataRow label="Cargo" value={data.cargo} />
                <DataRow label="Email" value={data.email} />
            </SectionCard>

            <SectionCard title="Tamaño">
                <DataRow label="Trabajadores" value={data.numTrabajadores} />
                <DataRow label="Rubro" value={rubroLabels[data.rubro] || data.rubro} />
            </SectionCard>

            <SectionCard title="Jornada y Asistencia">
                <DataRow label="Jornada" value={data.jornadaGeneral} />
                <DataRow
                    label="Trabajo remoto"
                    value={data.trabajoRemoto === "si" ? "Sí" : "No"}
                />
                <DataRow
                    label="Control asistencia"
                    value={data.controlAsistencia === "si" ? "Sí" : "No"}
                />
            </SectionCard>

            <SectionCard title="Higiene y Seguridad">
                <DataRow
                    label="Uso de EPP"
                    value={data.usoEPP === "si" ? "Sí" : "No"}
                />
                <DataRow
                    label="Comité paritario"
                    value={data.comiteParitario === "si" ? "Sí" : "No"}
                />
                <DataRow label="Mutualidad" value={data.mutualidad || ""} />
            </SectionCard>

            <SectionCard title="Normas Internas">
                <div className="mb-3">
                    <span className="text-xs text-neutral-500">
                        Prohibiciones ({data.prohibiciones?.length || 0}):
                    </span>
                    {data.prohibiciones && data.prohibiciones.length > 0 ? (
                        <ul className="mt-1 space-y-1">
                            {data.prohibiciones.map((p) => (
                                <li key={p} className="text-sm text-neutral-700 flex items-start gap-2">
                                    <span className="text-accent mt-0.5">•</span>
                                    {prohibicionLabels[p] || p}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-neutral-400 mt-1">Ninguna seleccionada</p>
                    )}
                </div>
                <DataRow
                    label="Procedimiento"
                    value={procedimientoLabels[data.tipoProcedimiento] || data.tipoProcedimiento || "—"}
                />
                {data.tipoProcedimiento === "personalizado" && data.procedimientoDisciplinario && (
                    <div className="mt-2 p-3 bg-white rounded-lg border border-neutral-100">
                        <span className="text-xs text-neutral-500 block mb-1">Texto personalizado:</span>
                        <p className="text-sm text-neutral-700 whitespace-pre-wrap">
                            {data.procedimientoDisciplinario}
                        </p>
                    </div>
                )}
            </SectionCard>
        </div>
    );
}
