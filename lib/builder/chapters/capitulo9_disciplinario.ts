import { ReglamentoData, ReglamentoSection, ContentItem } from "../types";
import { art, plain, safe } from "../helpers";

export function moduloProcedimientoDisciplinario(d: ReglamentoData): ReglamentoSection {
    const content: ContentItem[] = [
        plain("El régimen disciplinario que se establece a continuación tiene por objeto regular las consecuencias del incumplimiento de las normas contenidas en este Reglamento."),
        art("Las infracciones a las obligaciones y prohibiciones contenidas en este Reglamento, en el contrato de trabajo o en las instrucciones legítimas del empleador, serán sancionadas conforme al procedimiento disciplinario establecido en el presente capítulo, sin perjuicio de las acciones civiles, penales o administrativas que pudieren corresponder."),
        art("La aplicación de toda sanción disciplinaria se realizará con estricto respeto al debido proceso, otorgando al trabajador la posibilidad de ser escuchado y presentar sus descargos antes de la adopción de la medida. Las sanciones serán proporcionales a la gravedad de la falta cometida."),
    ];

    switch (d.tipoProcedimiento) {
        case "escalonado":
            content.push(
                plain("Se aplicará un sistema disciplinario de carácter progresivo y escalonado, que contempla las siguientes etapas sucesivas:")
            );
            content.push(
                art("Primera etapa — Amonestación verbal: ante la primera manifestación de una falta leve, el superior jerárquico realizará una amonestación verbal al trabajador, instándolo a corregir su conducta. Se dejará constancia interna del hecho en el registro del trabajador.")
            );
            content.push(
                art(`Segunda etapa — Amonestación por escrito: en caso de reincidencia o ante una falta de mayor entidad, se aplicará una amonestación formal por escrito, que se incorporará a la carpeta personal del trabajador. Se entregará copia al trabajador y, cuando la ley lo exija, se remitirá a ${d.flexibleLegalWording ? "la autoridad administrativa competente" : "la Inspección del Trabajo respectiva"}.`)
            );
            content.push(
                art("Tercera etapa — Multa: ante la reiteración de faltas previamente amonestadas, el empleador podrá aplicar una multa de hasta el veinticinco por ciento de la remuneración diaria del infractor. El producto de las multas se destinará a los fines que la ley establece. Lo anterior se aplicará dentro de los límites establecidos por la legislación laboral vigente.")
            );
            content.push(
                art("Cuarta etapa — Desvinculación: cuando la gravedad o reiteración de las faltas lo justifique, se procederá a la terminación del contrato de trabajo conforme a las causales legales aplicables, respetando el debido proceso y los derechos del trabajador, incluidas las indemnizaciones que procedan.")
            );
            break;

        case "segun_gravedad":
            content.push(
                art("Se aplicarán las medidas disciplinarias atendiendo a la naturaleza, gravedad, circunstancias y consecuencias de cada infracción, evaluando caso a caso la proporcionalidad de la sanción. No será necesario agotar etapas previas cuando la gravedad de la falta así lo amerite.")
            );
            content.push(
                art("Faltas leves: aquellas infracciones menores que no causan perjuicio significativo, tales como atrasos aislados, descuidos menores o incumplimientos de baja intensidad. Podrán ser sancionadas con amonestación verbal o escrita.")
            );
            content.push(
                art("Faltas moderadas: aquellas que implican un incumplimiento relevante de las obligaciones laborales o de las normas de este Reglamento, o que causan un perjuicio apreciable a la organización o a la convivencia laboral. Podrán ser sancionadas con amonestación escrita o multa de hasta el veinticinco por ciento de la remuneración diaria, dentro de los límites establecidos por la legislación laboral vigente.")
            );
            content.push(
                art("Faltas graves: aquellas que comprometen seriamente la seguridad de las personas, el patrimonio o la reputación de la organización, o que configuran alguna de las causales legales de terminación. Podrán dar lugar a la terminación inmediata del contrato de trabajo conforme a la ley.")
            );
            break;

        case "personalizado":
            if (safe(d.procedimientoDisciplinario)) {
                content.push(
                    plain("Se ha establecido el siguiente procedimiento disciplinario particular para la gestión de las infracciones al presente Reglamento:")
                );
                content.push(art(d.procedimientoDisciplinario));
            } else {
                content.push(
                    art(`El procedimiento disciplinario será determinado conforme a las circunstancias de cada caso, respetando siempre los principios de proporcionalidad, debido proceso y los derechos fundamentales del trabajador. En todo caso, cualquier sanción podrá ser reclamada ante ${d.flexibleLegalWording ? "la autoridad administrativa competente" : "la Inspección del Trabajo"} de conformidad a la ley.`)
                );
            }
            break;

        default:
            content.push(
                art("Las sanciones aplicables incluyen, según la gravedad de la infracción: amonestación verbal, amonestación por escrito, multa de hasta el veinticinco por ciento de la remuneración diaria, y terminación del contrato de trabajo en los casos legalmente procedentes. Lo anterior se aplicará dentro de los límites establecidos por la legislación laboral vigente.")
            );
    }

    content.push(
        art(`De toda sanción aplicada se dejará constancia por escrito, notificándose al trabajador afectado, quien deberá firmar la respectiva constancia. En caso de negativa a firmar, se dejará testimonio de ello ante un testigo. El trabajador tendrá derecho a reclamar ante ${d.flexibleLegalWording ? "la autoridad administrativa competente" : "la Inspección del Trabajo competente"} si considerare que la medida es injusta o desproporcionada.`),
        art("Se llevará un registro interno de las sanciones aplicadas, el cual será de carácter reservado y se utilizará exclusivamente para efectos de evaluar la reincidencia y la proporcionalidad de las medidas disciplinarias futuras.")
    );

    return { title: "PROCEDIMIENTO DISCIPLINARIO", content };
}
