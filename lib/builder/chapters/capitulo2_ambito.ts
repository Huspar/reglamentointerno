import { ReglamentoData, ReglamentoSection } from "../types";
import { art } from "../helpers";

export function moduloAmbitoAplicacion(d: ReglamentoData): ReglamentoSection {
    return {
        title: "ÁMBITO DE APLICACIÓN",
        content: [
            art("El presente Reglamento es aplicable a todos los trabajadores de la organización, sin distinción de cargo, función, antigüedad, modalidad contractual o lugar de prestación de servicios, desde la fecha de inicio de su relación laboral hasta su término, cualquiera sea la causa de este."),
            art("Las disposiciones contenidas en este instrumento obligan tanto a los trabajadores contratados bajo la modalidad de contrato indefinido como a aquellos con contrato a plazo fijo, por obra o faena, a tiempo parcial, en régimen de subcontratación, o bajo cualquier otra forma de vinculación laboral reconocida por la ley."),
            art("El desconocimiento de las normas aquí establecidas no eximirá de responsabilidad a quien las contravenga. La administración se obliga a difundir adecuadamente el contenido de este Reglamento, proporcionando a cada trabajador un ejemplar al momento de su contratación y dejando constancia escrita de su recepción."),
            art("Las disposiciones de este Reglamento se entenderán complementarias y no sustitutivas de las normas legales, los contratos individuales y colectivos de trabajo, y las demás regulaciones internas que se dicten en uso de las facultades de administración. En caso de conflicto, prevalecerán las normas de mayor jerarquía."),
            art(`Corresponderá a la administración remitir copia de este Reglamento a ${d.flexibleLegalWording ? "la autoridad sanitaria y a la autoridad laboral respectivas" : "al Ministerio de Salud y a la Inspección del Trabajo correspondiente"} dentro del plazo legal, contado desde la fecha de su entrada en vigencia.`),
        ],
    };
}
