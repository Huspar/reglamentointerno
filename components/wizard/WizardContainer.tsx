"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { wizardSchema, stepSchemas, type WizardData } from "@/lib/schemas";
import ProgressBar from "@/components/wizard/ProgressBar";
import StepEmpresa from "@/components/wizard/StepEmpresa";
import StepRepresentante from "@/components/wizard/StepRepresentante";
import StepTamano from "@/components/wizard/StepTamano";
import StepJornada from "@/components/wizard/StepJornada";
import StepHigiene from "@/components/wizard/StepHigiene";
import StepNormas from "@/components/wizard/StepNormas";
import StepConfirmacion from "@/components/wizard/StepConfirmacion";

const STORAGE_KEY = "draftReglamento";
const TOTAL_STEPS = 7;

const stepLabels = [
    "Empresa",
    "Representante Legal",
    "Tamaño",
    "Jornada y Asistencia",
    "Higiene y Seguridad",
    "Normas Internas",
    "Confirmación",
];

const defaultValues: WizardData = {
    razonSocial: "",
    rutEmpresa: "",
    giro: "",
    domicilio: "",
    comuna: "",
    region: "",
    nombreCompleto: "",
    rutRepresentante: "",
    cargo: "",
    email: "",
    numTrabajadores: "",
    rubro: "",
    jornadaGeneral: "",
    trabajoRemoto: "no",
    controlAsistencia: "no",
    usoEPP: "no",
    comiteParitario: "no",
    mutualidad: "",
    prohibiciones: [],
    tipoProcedimiento: "",
    procedimientoDisciplinario: "",
};

function loadDraft(): Partial<WizardData> {
    if (typeof window === "undefined") return {};
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch {
        // ignore
    }
    return {};
}

export default function WizardContainer() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isHydrated, setIsHydrated] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        trigger,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<WizardData>({
        resolver: zodResolver(wizardSchema),
        defaultValues,
        mode: "onTouched",
    });

    // Hydrate from localStorage
    useEffect(() => {
        const draft = loadDraft();
        if (draft && Object.keys(draft).length > 0) {
            (Object.keys(draft) as Array<keyof WizardData>).forEach((key) => {
                const value = draft[key];
                if (value !== undefined) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    setValue(key, value as any);
                }
            });
        }
        setIsHydrated(true);
    }, [setValue]);

    // Auto-save to localStorage on every change
    const watchAll = watch();
    const saveDraft = useCallback(() => {
        if (typeof window !== "undefined" && isHydrated) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(getValues()));
        }
    }, [getValues, isHydrated]);

    useEffect(() => {
        if (isHydrated) saveDraft();
    }, [watchAll, saveDraft, isHydrated]);

    // Get field names for current step to validate
    const getStepFields = (step: number): (keyof WizardData)[] => {
        const schema = stepSchemas[step];
        if (!schema) return [];
        return Object.keys(schema.shape) as (keyof WizardData)[];
    };

    const handleNext = async () => {
        const fields = getStepFields(currentStep);
        const isValid = await trigger(fields);
        if (isValid && currentStep < TOTAL_STEPS - 1) {
            setCurrentStep((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const onSubmit = (data: WizardData) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        router.push("/preview");
    };

    const isLastStep = currentStep === TOTAL_STEPS - 1;

    if (!isHydrated) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <section className="py-10 sm:py-14">
            <div className="max-w-[600px] mx-auto px-4">
                <ProgressBar
                    currentStep={currentStep}
                    totalSteps={TOTAL_STEPS}
                    stepLabels={stepLabels}
                />

                <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Step content with transition */}
                        <div className="min-h-[320px]">
                            <div
                                key={currentStep}
                                className="animate-[fadeIn_0.3s_ease-out]"
                            >
                                {currentStep === 0 && (
                                    <StepEmpresa
                                        register={register}
                                        errors={errors}
                                        setValue={(name, value) => setValue(name, value, { shouldValidate: true })}
                                        watch={(name) => watch(name) as string}
                                    />
                                )}
                                {currentStep === 1 && (
                                    <StepRepresentante
                                        register={register}
                                        errors={errors}
                                        setValue={(name, value) => setValue(name, value, { shouldValidate: true })}
                                        watch={(name) => watch(name) as string}
                                    />
                                )}
                                {currentStep === 2 && (
                                    <StepTamano register={register} errors={errors} />
                                )}
                                {currentStep === 3 && (
                                    <StepJornada register={register} errors={errors} />
                                )}
                                {currentStep === 4 && (
                                    <StepHigiene register={register} errors={errors} />
                                )}
                                {currentStep === 5 && (
                                    <StepNormas
                                        register={register}
                                        errors={errors}
                                        setValue={setValue}
                                        watch={watch}
                                    />
                                )}
                                {currentStep === 6 && (
                                    <StepConfirmacion data={getValues()} />
                                )}
                            </div>
                        </div>

                        {/* Navigation buttons */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-100">
                            {currentStep > 0 ? (
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    className="px-5 py-2.5 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
                                >
                                    ← Anterior
                                </button>
                            ) : (
                                <div />
                            )}

                            {isLastStep ? (
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 text-sm font-semibold text-white bg-accent rounded-lg hover:bg-accent-dark transition-colors shadow-sm"
                                >
                                    Generar vista previa
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-6 py-2.5 text-sm font-semibold text-white bg-accent rounded-lg hover:bg-accent-dark transition-colors shadow-sm"
                                >
                                    Siguiente →
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
