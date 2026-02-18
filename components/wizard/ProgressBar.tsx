"use client";

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    stepLabels: string[];
}

export default function ProgressBar({
    currentStep,
    totalSteps,
    stepLabels,
}: ProgressBarProps) {
    const progress = ((currentStep + 1) / totalSteps) * 100;

    return (
        <div className="mb-8">
            {/* Bar */}
            <div className="w-full bg-neutral-200 rounded-full h-2 mb-4 overflow-hidden">
                <div
                    className="bg-accent h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Step indicator */}
            <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-500 font-medium">
                    Paso {currentStep + 1} de {totalSteps}
                </p>
                <p className="text-xs text-primary font-semibold">
                    {stepLabels[currentStep]}
                </p>
            </div>
        </div>
    );
}
