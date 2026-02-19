import { ReglamentoSection } from "../types";
import { art } from "../helpers";

export function moduloVigencia(): ReglamentoSection {
    return {
        title: "VIGENCIA Y COMUNICACIÓN",
        content: [
            art("El presente Reglamento Interno de Orden, Higiene y Seguridad entrará en vigencia una vez transcurrido el plazo legal contado desde la fecha en que se haya puesto en conocimiento de los trabajadores, mediante la entrega del ejemplar correspondiente a cada uno de ellos, conforme al procedimiento establecido por la legislación vigente."),
            art("Las normas del presente Reglamento se entenderán incorporadas a los contratos individuales de trabajo vigentes y a los que se celebren con posterioridad, mientras se mantenga en vigor. Los trabajadores no podrán alegar desconocimiento de sus disposiciones una vez cumplido el procedimiento de difusión."),
            art("Corresponderá a la administración remitir copia del presente Reglamento a las autoridades competentes, de conformidad con la normativa vigente y dentro de los plazos legales aplicables."),
            art("Se deja constancia que este Reglamento ha sido elaborado dando cumplimiento a las exigencias de la legislación laboral en materia de orden, higiene y seguridad, de la normativa sobre prevención de riesgos profesionales, de la legislación sobre prevención del acoso laboral, sexual y la violencia en el trabajo, y de la demás normativa concordante."),
        ],
    };
}
