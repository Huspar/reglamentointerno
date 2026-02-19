import { ReglamentoData, ReglamentoSection, ContentItem } from "../types";
import { art, plain, safe } from "../helpers";

export function moduloDisposicionesGenerales(d: ReglamentoData): ReglamentoSection {
    const content: ContentItem[] = [
        plain("Las disposiciones que se establecen a continuación regulan aspectos generales de la relación laboral no abordados específicamente en los capítulos precedentes."),
        art("Las remuneraciones se pagarán en moneda de curso legal, en la forma, período y lugar convenidos en el contrato individual de trabajo, con las deducciones legales y convencionales que correspondan. El trabajador recibirá junto con su remuneración la liquidación de sueldo respectiva, en la que se detallarán los haberes, descuentos y monto líquido a pagar."),
        art("Los trabajadores tendrán derecho al feriado anual y a los permisos que establece la legislación laboral vigente. Las vacaciones se otorgarán preferentemente en forma continua, pudiendo fraccionarse de común acuerdo entre las partes. La administración establecerá un calendario de vacaciones que concilie las necesidades operativas con las preferencias de los trabajadores."),
        art("Las licencias médicas deberán ser presentadas por el trabajador dentro del plazo legal correspondiente. La organización las tramitará ante el organismo previsional respectivo, sin que ello signifique pronunciamiento sobre su procedencia. El trabajador deberá abstenerse de realizar actividades incompatibles con su estado de salud durante el período de licencia."),
        art("Toda terminación del contrato de trabajo se ajustará a las disposiciones legales vigentes, debiendo comunicarse el despido por escrito, indicando la causal invocada y los hechos en que se funda. Se entregarán al trabajador los certificados, finiquito y demás documentos que la ley exige, dentro de los plazos establecidos."),
    ];

    // Comunicaciones — usar email solo si existe
    if (safe(d.email)) {
        content.push(
            art(`Para efectos de comunicaciones oficiales, la organización podrá utilizar medios electrónicos, incluyendo el correo electrónico corporativo y las plataformas digitales que se establezcan. Las comunicaciones enviadas al correo institucional del trabajador se entenderán válidamente notificadas. Para consultas sobre este Reglamento, los trabajadores podrán dirigirse a ${d.email}.`)
        );
    } else {
        content.push(
            art("Para efectos de comunicaciones oficiales, la organización podrá utilizar medios electrónicos, incluyendo el correo electrónico corporativo y las plataformas digitales que se establezcan. Las comunicaciones enviadas al correo institucional del trabajador se entenderán válidamente notificadas.")
        );
    }

    content.push(
        art("Los trabajadores deberán comunicar oportunamente cualquier cambio en sus datos personales, domicilio, estado civil, cargas familiares o situación previsional, a fin de mantener actualizada la información necesaria para la correcta administración de la relación laboral y el cumplimiento de las obligaciones legales.")
    );

    return { title: "DISPOSICIONES GENERALES", content };
}
