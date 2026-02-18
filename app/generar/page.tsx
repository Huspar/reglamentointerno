import type { Metadata } from "next";
import WizardContainer from "@/components/wizard/WizardContainer";

export const metadata: Metadata = {
    title: "Generar Reglamento Interno",
    description:
        "Genera tu Reglamento Interno de Orden, Higiene y Seguridad para tu empresa en Chile. Proceso rápido, claro y profesional.",
};

export default function GenerarPage() {
    return <WizardContainer />;
}
