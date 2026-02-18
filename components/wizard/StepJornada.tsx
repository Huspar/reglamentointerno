"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import type { WizardData } from "@/lib/schemas";

interface Props {
    register: UseFormRegister<WizardData>;
    errors: FieldErrors<WizardData>;
}

export default function StepJornada({ register, errors }: Props) {
    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-bold text-primary mb-1">Jornada y Asistencia</h2>
                <p className="text-sm text-neutral-500">Define la jornada laboral y las políticas de asistencia.</p>
            </div>

            {/* Jornada general */}
            <div>
                <label htmlFor="jornadaGeneral" className="block text-sm font-medium text-neutral-700 mb-1">
                    Jornada general <span className="text-red-500">*</span>
                </label>
                <input
                    id="jornadaGeneral"
                    type="text"
                    {...register("jornadaGeneral")}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-colors"
                    placeholder="Ej: Lunes a viernes, 09:00 a 18:00 hrs"
                />
                <p className="mt-1 text-xs text-neutral-400">Describe el horario habitual de trabajo.</p>
                {errors.jornadaGeneral && (
                    <p className="mt-1 text-xs text-red-500">{errors.jornadaGeneral.message}</p>
                )}
            </div>

            {/* Trabajo remoto */}
            <fieldset>
                <legend className="block text-sm font-medium text-neutral-700 mb-2">
                    ¿Existe modalidad de trabajo remoto? <span className="text-red-500">*</span>
                </legend>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            value="si"
                            {...register("trabajoRemoto")}
                            className="w-4 h-4 text-accent border-neutral-300 focus:ring-accent"
                        />
                        <span className="text-sm text-neutral-700">Sí</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            value="no"
                            {...register("trabajoRemoto")}
                            className="w-4 h-4 text-accent border-neutral-300 focus:ring-accent"
                        />
                        <span className="text-sm text-neutral-700">No</span>
                    </label>
                </div>
                <p className="mt-1 text-xs text-neutral-400">Si la empresa permite teletrabajo parcial o total.</p>
                {errors.trabajoRemoto && (
                    <p className="mt-1 text-xs text-red-500">{errors.trabajoRemoto.message}</p>
                )}
            </fieldset>

            {/* Control de asistencia */}
            <fieldset>
                <legend className="block text-sm font-medium text-neutral-700 mb-2">
                    ¿Se utiliza control de asistencia? <span className="text-red-500">*</span>
                </legend>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            value="si"
                            {...register("controlAsistencia")}
                            className="w-4 h-4 text-accent border-neutral-300 focus:ring-accent"
                        />
                        <span className="text-sm text-neutral-700">Sí</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            value="no"
                            {...register("controlAsistencia")}
                            className="w-4 h-4 text-accent border-neutral-300 focus:ring-accent"
                        />
                        <span className="text-sm text-neutral-700">No</span>
                    </label>
                </div>
                <p className="mt-1 text-xs text-neutral-400">Reloj control, libro de asistencia, huella digital, etc.</p>
                {errors.controlAsistencia && (
                    <p className="mt-1 text-xs text-red-500">{errors.controlAsistencia.message}</p>
                )}
            </fieldset>
        </div>
    );
}
