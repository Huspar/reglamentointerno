import { ReglamentoSection } from "../types";
import { art, plain } from "../helpers";

export function moduloActualizacion(): ReglamentoSection {
    return {
        title: "ACTUALIZACIÓN Y MODIFICACIONES",
        content: [
            plain("Las disposiciones de este capítulo regulan la facultad del empleador para modificar el presente Reglamento y el procedimiento para dar validez a dichas modificaciones."),
            art("La organización tendrá la facultad de modificar, complementar o actualizar el presente Reglamento cuando sea necesario para adecuarlo a cambios en la legislación laboral, en la estructura organizacional, en las condiciones de operación o en cualquier otro aspecto que incida en su contenido, de conformidad con la legislación vigente. Toda modificación seguirá el procedimiento legal correspondiente."),
            art("Las modificaciones serán comunicadas formalmente a los trabajadores mediante la entrega personal de un ejemplar actualizado o del anexo que contenga las enmiendas, dejándose constancia escrita de su recepción. Las modificaciones entrarán en vigencia una vez transcurrido el plazo legal contado desde su notificación a los trabajadores."),
            art("Corresponderá a la administración remitir copia de las modificaciones a las autoridades competentes, de conformidad con la normativa vigente y dentro de los plazos legales aplicables."),
            art("Corresponderá a la administración revisar periódicamente el contenido de este Reglamento, al menos una vez cada dos años, o antes cuando se produzcan reformas legales relevantes, con el objeto de asegurar su permanente adecuación a la legislación vigente y a las mejores prácticas en materia de relaciones laborales, higiene y seguridad."),
            art("Se deja expresa constancia de que las disposiciones del presente Reglamento se interpretarán siempre de conformidad con la legislación vigente al momento de su aplicación. En caso de que alguna disposición resultare contraria a una norma legal posterior, prevalecerá esta última sin que ello afecte la validez de las restantes disposiciones del Reglamento."),
        ],
    };
}

export function moduloAdecuacionNormativa(): ReglamentoSection {
    return {
        title: "ADECUACIÓN NORMATIVA",
        content: [
            art("ARTÍCULO N° — Adecuación normativa: El presente Reglamento se dicta conforme a la legislación laboral vigente a la fecha de su emisión. En caso de modificaciones legales posteriores que afecten su contenido, la empresa procederá a su actualización de conformidad con la normativa aplicable."),
        ],
    };
}
