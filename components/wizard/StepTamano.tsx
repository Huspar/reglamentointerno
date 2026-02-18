"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import type { WizardData } from "@/lib/schemas";

interface Props {
    register: UseFormRegister<WizardData>;
    errors: FieldErrors<WizardData>;
}

const opcionesTrabajadores = [
    { value: "", label: "Selecciona..." },
    { value: "1-9", label: "1 a 9 trabajadores" },
    { value: "10-25", label: "10 a 25 trabajadores" },
    { value: "26-50", label: "26 a 50 trabajadores" },
    { value: "51+", label: "51 o más trabajadores" },
];

const opcionesRubro = [
    { value: "", label: "Selecciona..." },
    { value: "comercio", label: "Comercio" },
    { value: "servicios", label: "Servicios" },
    { value: "construccion", label: "Construcción" },
    { value: "industria", label: "Industria" },
    { value: "otro", label: "Otro" },
];

export default function StepTamano({ register, errors }: Props) {
    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-bold text-primary mb-1">Tamaño de la Empresa</h2>
                <p className="text-sm text-neutral-500">Clasifica tu empresa según cantidad de trabajadores y rubro.</p>
            </div>

            {/* Número de trabajadores */}
            <div>
                <label htmlFor="numTrabajadores" className="block text-sm font-medium text-neutral-700 mb-1">
                    Número de trabajadores <span className="text-red-500">*</span>
                </label>
                <select
                    id="numTrabajadores"
                    {...register("numTrabajadores")}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-colors bg-white"
                >
                    {opcionesTrabajadores.map((op) => (
                        <option key={op.value} value={op.value}>
                            {op.label}
                        </option>
                    ))}
                </select>
                <p className="mt-1 text-xs text-neutral-400">
                    Si tienes 10 o más, el reglamento interno es obligatorio.
                </p>
                {errors.numTrabajadores && (
                    <p className="mt-1 text-xs text-red-500">{errors.numTrabajadores.message}</p>
                )}
            </div>

            {/* Rubro */}
            <div>
                <label htmlFor="rubro" className="block text-sm font-medium text-neutral-700 mb-1">
                    Rubro <span className="text-red-500">*</span>
                </label>
                <select
                    id="rubro"
                    {...register("rubro")}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-colors bg-white"
                >
                    {opcionesRubro.map((op) => (
                        <option key={op.value} value={op.value}>
                            {op.label}
                        </option>
                    ))}
                </select>
                <p className="mt-1 text-xs text-neutral-400">
                    El rubro influye en las normas de seguridad incluidas.
                </p>
                {errors.rubro && (
                    <p className="mt-1 text-xs text-red-500">{errors.rubro.message}</p>
                )}
            </div>
        </div>
    );
}
