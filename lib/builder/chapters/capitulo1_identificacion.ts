import { ReglamentoData, ReglamentoSection, ContentItem } from "../types";
import { art, safe, domicilioCompleto, normalizarRubro } from "../helpers";

export function moduloIdentificacion(d: ReglamentoData): ReglamentoSection {
    const dom = domicilioCompleto(d);

    // Normalización de rubro y giro para redacción natural
    const rubroNormalizado = normalizarRubro(d);
    const giro = safe(d.giro);
    let fraseActividad = `en el rubro de ${rubroNormalizado}`;

    if (giro) {
        fraseActividad += `, dedicándose específicamente a ${giro}`;
    }

    const content: ContentItem[] = [];

    content.push(
        art(`El presente Reglamento Interno de Orden, Higiene y Seguridad se dicta en cumplimiento de la normativa laboral chilena y será de aplicación en ${safe(d.razonSocial) || "la empresa"}, RUT ${safe(d.rutEmpresa) || "[pendiente]"}, cuyo giro comercial corresponde a ${giro || "actividades propias de su objeto social"}.${dom ? ` La organización tiene su domicilio en ${dom}.` : ""}`)
    );

    // Representante legal — solo si tenemos datos
    if (safe(d.nombreCompleto)) {
        const rutRepr = safe(d.rutRepresentante) && safe(d.rutRepresentante) !== safe(d.rutEmpresa)
            ? `, RUT ${d.rutRepresentante},`
            : "";
        const cargoRepr = safe(d.cargo) ? ` en calidad de ${d.cargo},` : "";
        content.push(
            art(`La representación legal es ejercida por don(ña) ${d.nombreCompleto}${rutRepr}${cargoRepr} con plenas facultades para obligar a la organización en los términos de este instrumento.`)
        );
    } else {
        content.push(
            art("La representación legal de la empresa será ejercida por quien conste como tal en los registros públicos correspondientes, con plenas facultades para obligar a la organización en los términos de este instrumento.")
        );
    }

    content.push(
        art(`La organización desarrolla sus actividades ${fraseActividad} y cuenta actualmente con un rango de ${safe(d.numTrabajadores) || "trabajadores"} sujetos al presente Reglamento.${safe(d.mutualidad) ? ` Se encuentra adherida a ${d.mutualidad} como organismo administrador del seguro contra riesgos de accidentes del trabajo y enfermedades profesionales.` : ""}`)
    );

    content.push(
        art("Para todos los efectos legales y administrativos derivados de este instrumento, las comunicaciones, notificaciones y requerimientos se realizarán desde el domicilio indicado precedentemente, o a través de los medios electrónicos que la administración habilite para tal fin.")
    );

    return { title: "IDENTIFICACIÓN DE LA EMPRESA", content };
}
