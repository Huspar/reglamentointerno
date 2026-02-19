import { ReglamentoData, ReglamentoSection } from "../types";
import { art, plain } from "../helpers";

export function moduloLeyKarin(d: ReglamentoData): ReglamentoSection {
    return {
        title: "PREVENCIÓN DEL ACOSO LABORAL, SEXUAL Y VIOLENCIA EN EL TRABAJO",
        content: [
            plain("En cumplimiento de la legislación vigente sobre prevención, investigación y sanción del acoso laboral, acoso sexual y la violencia en el trabajo, la organización establece las siguientes disposiciones."),
            art("La organización se compromete a mantener un ambiente laboral libre de acoso laboral, acoso sexual y violencia en el trabajo, adoptando las medidas de prevención, protección y reparación que la ley exige. Estas obligaciones alcanzan a las relaciones entre trabajadores, y entre estos y el empleador, sus representantes, clientes, proveedores y cualquier persona que frecuente el lugar de trabajo."),
            art("Se entiende por acoso laboral toda conducta constitutiva de agresión u hostigamiento ejercida por el empleador o por uno o más trabajadores, en contra de otro u otros trabajadores, por cualquier medio, que tenga como resultado el menoscabo, maltrato o humillación, o que amenace o perjudique la situación laboral o las oportunidades de empleo de la persona afectada, sea que se manifieste una sola vez o de manera reiterada."),
            art("Se entiende por acoso sexual el que una persona realice, en forma indebida, por cualquier medio, requerimientos de carácter sexual, no consentidos por quien los recibe y que amenacen o perjudiquen su situación laboral o sus oportunidades de empleo."),
            art("Se entiende por violencia en el trabajo aquellas conductas ejercidas por terceros ajenos a la relación laboral, tales como clientes, proveedores o usuarios, que afecten a los trabajadores durante la prestación de sus servicios, con ocasión de ella o como consecuencia de esta."),
            art("La organización elaborará, implementará y difundirá un protocolo de prevención del acoso laboral, acoso sexual y la violencia en el trabajo, el cual contendrá: la identificación de los peligros y la evaluación de los riesgos psicosociales asociados, las medidas de prevención a adoptar, las medidas de control e información, y las medidas de resguardo de la privacidad y la honra de los involucrados."),
            art(`Toda persona afectada por conductas de acoso o violencia podrá presentar su denuncia por escrito ante la administración o ante ${d.flexibleLegalWording ? "la autoridad administrativa competente" : "la Inspección del Trabajo competente"}. Recibida la denuncia, el empleador adoptará de inmediato las medidas de resguardo necesarias respecto de los involucrados, tales como la separación de los espacios físicos o la redistribución del tiempo de jornada, considerando la gravedad de los hechos y las posibilidades derivadas de las condiciones de trabajo.`),
            art(`La investigación interna se llevará a cabo conforme al procedimiento establecido en el protocolo de prevención, respetando los principios de confidencialidad, bilateralidad, celeridad y debido proceso. La investigación deberá concluirse en los plazos legales y sus conclusiones serán remitidas a ${d.flexibleLegalWording ? "la autoridad competente" : "la Inspección del Trabajo"} para su revisión. Se prohíbe toda forma de represalia contra los denunciantes o testigos.`),
            art("Los trabajadores tienen la obligación de participar en las actividades de capacitación y sensibilización sobre prevención del acoso y la violencia que la organización disponga. La administración realizará al menos una capacitación anual en esta materia, sin perjuicio de las actividades adicionales que se estimen necesarias."),
        ],
    };
}
