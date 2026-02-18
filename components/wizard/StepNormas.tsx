"use client";

import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { WizardData } from "@/lib/schemas";

interface Props {
    register: UseFormRegister<WizardData>;
    errors: FieldErrors<WizardData>;
    setValue: UseFormSetValue<WizardData>;
    watch: UseFormWatch<WizardData>;
}

/* ───── Categorías de prohibiciones ───── */
const categorias = [
    {
        id: "A",
        titulo: "Conducta y convivencia",
        opciones: [
            { value: "consumo_alcohol", label: "Consumo de alcohol en el lugar de trabajo" },
            { value: "consumo_drogas", label: "Consumo de drogas en horario laboral" },
            { value: "violencia", label: "Violencia física o verbal" },
            { value: "acoso", label: "Acoso laboral o sexual" },
            { value: "discriminacion", label: "Discriminación o trato ofensivo" },
            { value: "llegadas_reiteradas", label: "Llegadas reiteradas injustificadas" },
        ],
    },
    {
        id: "B",
        titulo: "Seguridad y orden",
        opciones: [
            { value: "no_uso_epp", label: "No uso de elementos de protección personal (EPP)" },
            { value: "manipulacion_maquinaria", label: "Manipulación indebida de maquinaria o herramientas" },
            { value: "incumplimiento_protocolos", label: "Incumplimiento de protocolos internos de seguridad" },
            { value: "ingreso_no_autorizado", label: "Ingreso de personas externas sin autorización" },
        ],
    },
    {
        id: "C",
        titulo: "Tecnología y confidencialidad",
        opciones: [
            { value: "uso_indebido_equipos", label: "Uso indebido de equipos computacionales" },
            { value: "software_no_autorizado", label: "Instalación de software no autorizado" },
            { value: "correo_fines_personales", label: "Uso del correo corporativo para fines personales" },
            { value: "filtracion_info", label: "Filtración o uso indebido de información confidencial" },
        ],
    },
];

const procedimientoOpciones = [
    { value: "escalonado", label: "Escalonado (amonestación → suspensión → desvinculación)" },
    { value: "segun_gravedad", label: "Según gravedad de la falta" },
    { value: "personalizado", label: "Personalizado" },
];

export default function StepNormas({ register, errors, setValue, watch }: Props) {
    const prohibiciones = watch("prohibiciones") || [];
    const tipoProcedimiento = watch("tipoProcedimiento") || "";

    const handleCheckbox = (value: string, checked: boolean) => {
        const current = [...prohibiciones];
        if (checked) {
            current.push(value);
        } else {
            const idx = current.indexOf(value);
            if (idx > -1) current.splice(idx, 1);
        }
        setValue("prohibiciones", current, { shouldValidate: true });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-primary mb-1">Normas Internas</h2>
                <p className="text-sm text-neutral-500">
                    Selecciona las prohibiciones aplicables y el tipo de procedimiento disciplinario.
                </p>
            </div>

            {/* ═══ Prohibiciones por categoría ═══ */}
            {categorias.map((cat) => (
                <div key={cat.id}>
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
                        Sección {cat.id} — {cat.titulo}
                    </h3>
                    <div className="space-y-2 bg-neutral-50 rounded-xl border border-neutral-100 p-4">
                        {cat.opciones.map((op) => (
                            <label
                                key={op.value}
                                className="flex items-start gap-3 cursor-pointer group"
                            >
                                <input
                                    type="checkbox"
                                    checked={prohibiciones.includes(op.value)}
                                    onChange={(e) => handleCheckbox(op.value, e.target.checked)}
                                    className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-accent focus:ring-accent/30 shrink-0"
                                />
                                <span className="text-sm text-neutral-700 group-hover:text-neutral-900 transition-colors">
                                    {op.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            {errors.prohibiciones && (
                <p className="text-xs text-red-500">{errors.prohibiciones.message}</p>
            )}

            {/* ═══ Procedimiento disciplinario ═══ */}
            <div className="pt-2">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
                    Procedimiento disciplinario
                </h3>

                <div>
                    <label
                        htmlFor="tipoProcedimiento"
                        className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                        Tipo de procedimiento <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="tipoProcedimiento"
                        {...register("tipoProcedimiento")}
                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-colors bg-white"
                    >
                        <option value="">Seleccionar…</option>
                        {procedimientoOpciones.map((op) => (
                            <option key={op.value} value={op.value}>
                                {op.label}
                            </option>
                        ))}
                    </select>
                    {errors.tipoProcedimiento && (
                        <p className="mt-1 text-xs text-red-500">{errors.tipoProcedimiento.message}</p>
                    )}
                </div>

                {/* Textarea para personalizado */}
                {tipoProcedimiento === "personalizado" && (
                    <div className="mt-4 animate-[fadeIn_0.3s_ease-out]">
                        <label
                            htmlFor="procedimientoDisciplinario"
                            className="block text-sm font-medium text-neutral-700 mb-1"
                        >
                            Describe tu procedimiento
                        </label>
                        <textarea
                            id="procedimientoDisciplinario"
                            {...register("procedimientoDisciplinario")}
                            rows={4}
                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-colors resize-none"
                            placeholder="Describe las etapas y sanciones del procedimiento disciplinario de tu empresa…"
                        />
                    </div>
                )}
            </div>

            {/* Resumen visual */}
            <div className="bg-accent/5 border border-accent/10 rounded-lg p-3">
                <p className="text-xs text-accent font-medium">
                    {prohibiciones.length} prohibición{prohibiciones.length !== 1 ? "es" : ""} seleccionada{prohibiciones.length !== 1 ? "s" : ""}
                    {tipoProcedimiento && ` · Procedimiento: ${procedimientoOpciones.find(o => o.value === tipoProcedimiento)?.label || tipoProcedimiento}`}
                </p>
            </div>
        </div>
    );
}
