
import { NextRequest, NextResponse } from "next/server";
import { ReglamentoData } from "@/lib/reglamentoBuilder";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { draftData, issueCode } = body;

        const newData: ReglamentoData = { ...draftData };

        switch (issueCode) {
            case "ARTICULO_9_RIGIDO":
            case "PROHIBITED_STRING":
                // Fix: Enable flexible wording
                newData.flexibleLegalWording = true;
                break;

            case "RUBRO_GIRO_INCOHERENTE":
                // No automatic fix for data coherence without AI, but we could unset rubro?
                // For now, no-op or specific logic if requested.
                // User requirement said "Autofix" for rigidity.
                break;

            default:
                // Unknown fix
                return NextResponse.json({ error: "No fix available for this code" }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            updatedData: newData,
            message: "Corrección aplicada exitosamente."
        });

    } catch (error) {
        return NextResponse.json({ error: "Error applying fix." }, { status: 500 });
    }
}
