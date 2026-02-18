"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import type { WizardData } from "@/lib/schemas";
import { formatearRUT } from "@/utils/rut";

interface Props {
    register: UseFormRegister<WizardData>;
    errors: FieldErrors<WizardData>;
    setValue: (name: keyof WizardData, value: string) => void;
    watch: (name: keyof WizardData) => string;
}

export default function StepRepresentante({ register, errors, setValue, watch }: Props) {
    const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatearRUT(e.target.value);
        setValue("rutRepresentante", formatted);
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-bold text-primary mb-1">Representante Legal</h2>
                <p className="text-sm text-neutral-500">Datos de quien firma y representa a la empresa.</p>
            </div>

            {/* Nombre completo */}
            <div>
                <label htmlFor="nombreCompleto" className="block text-sm font-medium text-neutral-700 mb-1">
                    Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                    id="nombreCompleto"
                    type="text"
                    {...register("nombreCompleto")}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-colors"
                    placeholder="Ej: Juan Pérez González"
                />
                <p className="mt-1 text-xs text-neutral-400">Nombre tal como aparece en la escritura.</p>
                {errors.nombreCompleto && (
                    <p className="mt-1 text-xs text-red-500">{errors.nombreCompleto.message}</p>
                )}
            </div>

            {/* RUT representante */}
            <div>
                <label htmlFor="rutRepresentante" className="block text-sm font-medium text-neutral-700 mb-1">
                    RUT representante <span className="text-red-500">*</span>
                </label>
                <input
                    id="rutRepresentante"
                    type="text"
                    value={watch("rutRepresentante") || ""}
                    onChange={handleRutChange}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-colors"
                    placeholder="Ej: 12.345.678-9"
                />
                <p className="mt-1 text-xs text-neutral-400">Formato: XX.XXX.XXX-X</p>
                {errors.rutRepresentante && (
                    <p className="mt-1 text-xs text-red-500">{errors.rutRepresentante.message}</p>
                )}
            </div>

            {/* Cargo */}
            <div>
                <label htmlFor="cargo" className="block text-sm font-medium text-neutral-700 mb-1">
                    Cargo <span className="text-red-500">*</span>
                </label>
                <input
                    id="cargo"
                    type="text"
                    {...register("cargo")}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-colors"
                    placeholder="Ej: Gerente General"
                />
                {errors.cargo && (
                    <p className="mt-1 text-xs text-red-500">{errors.cargo.message}</p>
                )}
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-colors"
                    placeholder="Ej: juan@empresa.cl"
                />
                <p className="mt-1 text-xs text-neutral-400">Correo de contacto del representante.</p>
                {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
            </div>
        </div>
    );
}
