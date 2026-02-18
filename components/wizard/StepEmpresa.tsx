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

export default function StepEmpresa({ register, errors, setValue, watch }: Props) {
    const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatearRUT(e.target.value);
        setValue("rutEmpresa", formatted);
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-bold text-primary mb-1">Datos de la Empresa</h2>
                <p className="text-sm text-neutral-500">Ingresa la información legal de tu empresa.</p>
            </div>

            {/* Razón social */}
            <div>
                <label htmlFor="razonSocial" className="block text-sm font-medium text-neutral-700 mb-1">
                    Razón social <span className="text-red-500">*</span>
                </label>
                <input
                    id="razonSocial"
                    type="text"
                    {...register("razonSocial")}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-colors"
                    placeholder="Ej: Empresa Ejemplo SpA"
                />
                <p className="mt-1 text-xs text-neutral-400">Tal como aparece en el SII.</p>
                {errors.razonSocial && (
                    <p className="mt-1 text-xs text-red-500">{errors.razonSocial.message}</p>
                )}
            </div>

            {/* RUT empresa */}
            <div>
                <label htmlFor="rutEmpresa" className="block text-sm font-medium text-neutral-700 mb-1">
                    RUT empresa <span className="text-red-500">*</span>
                </label>
                <input
                    id="rutEmpresa"
                    type="text"
                    value={watch("rutEmpresa") || ""}
                    onChange={handleRutChange}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-colors"
                    placeholder="Ej: 76.123.456-7"
                />
                <p className="mt-1 text-xs text-neutral-400">Formato: XX.XXX.XXX-X</p>
                {errors.rutEmpresa && (
                    <p className="mt-1 text-xs text-red-500">{errors.rutEmpresa.message}</p>
                )}
            </div>

            {/* Giro */}
            <div>
                <label htmlFor="giro" className="block text-sm font-medium text-neutral-700 mb-1">
                    Giro <span className="text-red-500">*</span>
                </label>
                <input
                    id="giro"
                    type="text"
                    {...register("giro")}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-colors"
                    placeholder="Ej: Servicios de consultoría"
                />
                <p className="mt-1 text-xs text-neutral-400">Actividad económica principal.</p>
                {errors.giro && (
                    <p className="mt-1 text-xs text-red-500">{errors.giro.message}</p>
                )}
            </div>

            {/* Domicilio */}
            <div>
                <label htmlFor="domicilio" className="block text-sm font-medium text-neutral-700 mb-1">
                    Domicilio
                </label>
                <input
                    id="domicilio"
                    type="text"
                    {...register("domicilio")}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-colors"
                    placeholder="Ej: Av. Providencia 1234, Oficina 501"
                />
            </div>

            {/* Comuna */}
            <div>
                <label htmlFor="comuna" className="block text-sm font-medium text-neutral-700 mb-1">
                    Comuna
                </label>
                <input
                    id="comuna"
                    type="text"
                    {...register("comuna")}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-colors"
                    placeholder="Ej: Providencia"
                />
            </div>

            {/* Región */}
            <div>
                <label htmlFor="region" className="block text-sm font-medium text-neutral-700 mb-1">
                    Región
                </label>
                <input
                    id="region"
                    type="text"
                    {...register("region")}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-colors"
                    placeholder="Ej: Metropolitana"
                />
            </div>
        </div>
    );
}
