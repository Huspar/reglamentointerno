import { ReglamentoData, ReglamentoSection, ContentItem } from "../types";
import { art, plain } from "../helpers";

/* ─── Textos formales por prohibición ─── */
const prohibicionTextos: Record<string, string> = {
    consumo_alcohol:
        "Se prohíbe estrictamente el consumo, posesión o distribución de bebidas alcohólicas dentro de las dependencias de la empresa, así como presentarse al lugar de trabajo bajo la influencia del alcohol. La infracción a esta norma será considerada falta grave y dará lugar a la aplicación inmediata de las sanciones disciplinarias contempladas en este Reglamento.",
    consumo_drogas:
        "Queda terminantemente prohibido el consumo, tenencia o tráfico de sustancias estupefacientes o psicotrópicas en horario laboral o dentro de las instalaciones de la empresa. Asimismo, se prohíbe presentarse a trabajar bajo los efectos de dichas sustancias. La organización se reserva el derecho de solicitar exámenes médicos cuando existan indicios fundados de transgresión.",
    violencia:
        "Queda prohibido ejercer cualquier forma de violencia física o verbal contra compañeros de trabajo, superiores jerárquicos, subordinados, clientes, proveedores o cualquier persona que se encuentre en las instalaciones de la empresa. Toda conducta agresiva, amenazante o intimidatoria será sancionada con la máxima rigurosidad conforme al procedimiento disciplinario establecido.",
    acoso:
        "Quedan prohibidas todas las conductas constitutivas de acoso laboral, acoso sexual y violencia en el trabajo, en cualquiera de sus manifestaciones, conforme a la legislación vigente sobre prevención, investigación y sanción del acoso laboral, sexual y la violencia en el trabajo. La organización mantiene un protocolo de prevención y un procedimiento de investigación interno para atender las denuncias, garantizando la confidencialidad, la protección del denunciante y la adopción oportuna de medidas correctivas.",
    discriminacion:
        "Se prohíbe toda forma de discriminación arbitraria fundada en raza, color, sexo, edad, estado civil, religión, opinión política, nacionalidad, ascendencia nacional, situación socioeconómica, orientación sexual, identidad de género, discapacidad u origen social, conforme a la normativa antidiscriminación vigente. La organización promueve un ambiente laboral basado en el respeto a la diversidad y la igualdad de trato.",
    llegadas_reiteradas:
        "Se prohíben las llegadas tardías reiteradas e injustificadas al lugar de trabajo. El incumplimiento sistemático de los horarios establecidos constituye una falta que afecta la organización productiva y podrá dar lugar a las sanciones disciplinarias correspondientes, incluyendo descuentos de remuneración conforme a la ley.",
    no_uso_epp:
        "Queda prohibido el desempeño de funciones sin la utilización de los Equipos de Protección Personal asignados cuando las condiciones de trabajo así lo requieran. La negativa a utilizar los EPP proporcionados será considerada falta grave que pone en riesgo la integridad del trabajador y de terceros, y facultará al empleador para impedir el ingreso del trabajador a la zona de riesgo.",
    manipulacion_maquinaria:
        "Queda prohibida la manipulación, operación o intervención de maquinaria, equipos o herramientas para los cuales el trabajador no haya sido debidamente capacitado o autorizado. Asimismo, se prohíbe alterar, desactivar o retirar los dispositivos de seguridad de cualquier equipo o instalación, conducta que será considerada falta gravísima.",
    incumplimiento_protocolos:
        "Se prohíbe el incumplimiento de los protocolos internos de seguridad, incluyendo procedimientos de evacuación, protocolos de emergencia, normas de manipulación de sustancias peligrosas y cualquier otra instrucción impartida en materia de prevención de riesgos. La inobservancia de estos protocolos compromete la seguridad colectiva.",
    ingreso_no_autorizado:
        "Queda prohibido permitir o facilitar el ingreso de personas ajenas a la organización a las dependencias de trabajo sin la debida autorización del personal encargado. Todo visitante deberá ser debidamente identificado y registrado conforme a los procedimientos internos, y deberá permanecer acompañado durante su estadía en las instalaciones.",
    uso_indebido_equipos:
        "Queda prohibido el uso de equipos computacionales, dispositivos electrónicos y recursos tecnológicos para fines ajenos al desempeño de las funciones laborales asignadas. Esto incluye el acceso a sitios web no relacionados con el trabajo, la descarga de contenido personal y el uso recreativo durante la jornada laboral.",
    software_no_autorizado:
        "Se prohíbe la instalación de software, aplicaciones o programas no autorizados en los equipos de la organización. Toda necesidad de software adicional deberá ser canalizada a través del área de tecnología o quien haga sus veces, para su evaluación, aprobación e instalación controlada.",
    correo_fines_personales:
        "Queda prohibido el uso del correo electrónico corporativo y las cuentas institucionales para fines personales, incluyendo el envío de cadenas, contenido no laboral, suscripciones a servicios personales o cualquier comunicación ajena a las funciones del cargo.",
    filtracion_info:
        "Se prohíbe estrictamente la divulgación, reproducción, distribución o uso indebido de información confidencial, secretos comerciales, datos de clientes, estrategias corporativas o cualquier antecedente reservado al que el trabajador tenga acceso en razón de su cargo. Esta obligación se mantiene vigente incluso después de terminada la relación laboral y su infracción dará lugar a las acciones civiles y penales que correspondan.",
};

export function moduloNormasInternas(d: ReglamentoData): ReglamentoSection {
    const content: ContentItem[] = [
        plain("Complementando las obligaciones establecidas en los capítulos precedentes, se establecen las siguientes normas de conducta y prohibiciones específicas."),
        art("Todo trabajador deberá observar una conducta de respeto, honestidad y colaboración en sus relaciones laborales, contribuyendo activamente a mantener un ambiente de trabajo armónico, seguro y productivo. La convivencia laboral es responsabilidad compartida de todos los integrantes de la organización."),
    ];

    if (d.prohibiciones && d.prohibiciones.length > 0) {
        content.push(plain("Se prohíbe expresamente a todo trabajador incurrir en las siguientes conductas:"));
        d.prohibiciones.forEach((p) => {
            const texto = prohibicionTextos[p];
            if (texto) content.push(art(texto));
        });
    }

    // Complemento si pocas prohibiciones
    if (!d.prohibiciones || d.prohibiciones.length < 4) {
        content.push(
            art("Con independencia de las prohibiciones anteriormente enumeradas, queda prohibida toda conducta que atente contra la moral, las buenas costumbres, la seguridad de las personas o el patrimonio de la organización. Los trabajadores deberán abstenerse de realizar cualquier acción u omisión que pueda causar daño.")
        );
        content.push(
            art("Queda prohibido realizar actividades comerciales o de otra naturaleza por cuenta propia o de terceros dentro de la jornada laboral o utilizando recursos de la organización, salvo autorización expresa y por escrito de la administración.")
        );
        content.push(
            art("Se prohíbe fumar o utilizar cigarrillos electrónicos dentro de las dependencias, salvo en las áreas expresamente habilitadas para ello, si las hubiere, conforme a la normativa sobre ambientes libres de humo de tabaco.")
        );
    }

    content.push(
        art("La enumeración de prohibiciones contenida en este capítulo no es taxativa. La administración se reserva la facultad de complementar estas disposiciones mediante instrucciones internas, circulares o comunicaciones formales que se pongan en conocimiento de los trabajadores oportunamente.")
    );

    return { title: "NORMAS GENERALES DE CONDUCTA Y PROHIBICIONES", content };
}
