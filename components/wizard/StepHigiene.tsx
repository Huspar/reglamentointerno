"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import type { WizardData } from "@/lib/schemas";

interface Props {
    register: UseFormRegister<WizardData>;
    errors: FieldErrors<WizardData>;
}

export default function StepHigiene({ register, errors }: Props) {
    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-bold text-primary mb-1">Higiene y Seguridad</h2>
                <p className="text-sm text-neutral-500">Información sobre equipos de protección y seguridad laboral.</p>
            </div>

            {/* Uso de EPP */}
            <fieldset>
                <legend className="block text-sm font-medium text-neutral-700 mb-2">
                    ¿Se requiere uso de Equipos de Protección Personal (EPP)? <span className="text-red-500">*</span>
                </legend>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            value="si"
                            {...register("usoEPP")}
                            className="w-4 h-4 text-accent border-neutral-300 focus:ring-accent"
                        />
                        <span className="text-sm text-neutral-700">Sí</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            value="no"
                            {...register("usoEPP")}
                            className="w-4 h-4 text-accent border-neutral-300 focus:ring-accent"
                        />
                        <span className="text-sm text-neutral-700">No</span>
                    </label>
                </div>
                <p className="mt-1 text-xs text-neutral-400">Cascos, guantes, zapatos de seguridad, etc.</p>
                {errors.usoEPP && (
                    <p className="mt-1 text-xs text-red-500">{errors.usoEPP.message}</p>
                )}
            </fieldset>

            {/* Comité paritario */}
            <fieldset>
                <legend className="block text-sm font-medium text-neutral-700 mb-2">
                    ¿Existe Comité Paritario de Higiene y Seguridad? <span className="text-red-500">*</span>
                </legend>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            value="si"
                            {...register("comiteParitario")}
                            className="w-4 h-4 text-accent border-neutral-300 focus:ring-accent"
                        />
                        <span className="text-sm text-neutral-700">Sí</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            value="no"
                            {...register("comiteParitario")}
                            className="w-4 h-4 text-accent border-neutral-300 focus:ring-accent"
                        />
                        <span className="text-sm text-neutral-700">No</span>
                    </label>
                </div>
                <p className="mt-1 text-xs text-neutral-400">Obligatorio para empresas con 25 o más trabajadores.</p>
                {errors.comiteParitario && (
                    <p className="mt-1 text-xs text-red-500">{errors.comiteParitario.message}</p>
                )}
            </fieldset>

            {/* Mutualidad */}
            <div>
                <label htmlFor="mutualidad" className="block text-sm font-medium text-neutral-700 mb-1">
                    Mutualidad
                </label>
                <input
                    id="mutualidad"
                    type="text"
                    {...register("mutualidad")}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-colors"
                    placeholder="Ej: ACHS, Mutual de Seguridad, IST"
                />
                <p className="mt-1 text-xs text-neutral-400">Organismo administrador del seguro de accidentes.</p>
            </div>
        </div>
    );
}
