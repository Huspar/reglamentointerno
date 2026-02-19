import { ReglamentoData, ReglamentoSection } from "../types";
import { art, plain } from "../helpers";
import { adaptarSegunRubro } from "./capitulo8_higiene";

export function moduloTeletrabajo(): ReglamentoSection {
    return {
        title: "TELETRABAJO Y TRABAJO A DISTANCIA",
        content: [
            plain("En conformidad con la legislación que regula el trabajo a distancia y teletrabajo, se establecen las siguientes normas para quienes presten servicios bajo esta modalidad."),
            art("La organización contempla la modalidad de trabajo a distancia o teletrabajo para aquellos cargos o funciones cuya naturaleza lo permita. La prestación de servicios bajo esta modalidad deberá constar por escrito en el contrato de trabajo o en un anexo, el cual especificará el lugar de prestación de servicios, la jornada aplicable, los mecanismos de supervisión y los equipos proporcionados."),
            art("Las partes podrán acordar, al inicio o durante la vigencia de la relación laboral, la modalidad de teletrabajo. Del mismo modo, de conformidad con la legislación vigente, cualquiera de las partes podrá solicitar la reversibilidad de la modalidad de trabajo a distancia, volviendo a la prestación presencial de los servicios, en las condiciones y plazos que se hayan pactado en el contrato o anexo correspondiente. Lo anterior se entenderá sin perjuicio de los acuerdos específicos contenidos en el contrato o anexo respectivo, conforme a la legislación vigente."),
            art("Los trabajadores que se desempeñen bajo esta modalidad deberán cumplir con la jornada pactada, mantenerse disponibles y conectados durante el horario convenido, y reportar sus avances conforme a los mecanismos establecidos por la administración. En caso de teletrabajo sin jornada pactada, el trabajador podrá distribuir libremente su tiempo."),
            art("Corresponderá al empleador proporcionar los equipos y herramientas necesarios para el desempeño del trabajo remoto, o compensar al trabajador por el uso de equipos propios, conforme a lo pactado en el respectivo anexo. Los costos de operación, mantención y reparación de los equipos serán de cargo del empleador, así como los costos de servicios de enlace y conectividad, salvo pacto en contrario."),
            art("Será responsabilidad de la administración comunicar al trabajador remoto las condiciones de seguridad y salud a que debe sujetarse, efectuar la identificación y evaluación de los riesgos del puesto de teletrabajo, e informar las medidas preventivas correspondientes. El trabajador no podrá ser obligado a trabajar en condiciones que no cumplan con los requisitos de seguridad informados."),
            art("El trabajador remoto mantendrá las mismas obligaciones de confidencialidad, seguridad de la información y cumplimiento normativo que rigen en las dependencias de la organización. Deberá garantizar condiciones ergonómicas adecuadas en su lugar de trabajo conforme a las instrucciones que se le impartan y permitir las inspecciones que la ley autoriza."),
            art("Se garantiza el derecho a la desconexión digital, de conformidad con la legislación vigente, conforme al cual el trabajador no estará obligado a responder comunicaciones, órdenes u otros requerimientos del empleador durante un período mínimo de doce horas continuas en un período de veinticuatro horas. El empleador deberá respetar este derecho y no podrá establecer consecuencias adversas por su ejercicio."),
        ],
    };
}

export function moduloEPP(d: ReglamentoData): ReglamentoSection {
    const ctx = adaptarSegunRubro(d.rubro);

    return {
        title: "EQUIPOS DE PROTECCIÓN PERSONAL",
        content: [
            art(`La organización proporcionará gratuitamente a sus trabajadores los Equipos de Protección Personal necesarios para el desempeño seguro de sus funciones, incluyendo: ${ctx.eppContexto}.`),
            art("Es obligación de todo trabajador utilizar correctamente los EPP asignados durante toda la jornada laboral o cuando las condiciones de trabajo así lo requieran. La negativa a utilizarlos será considerada falta grave y facultará al empleador para impedir el acceso del trabajador a la zona de riesgo."),
            art("Los trabajadores deberán velar por el buen estado de conservación de los EPP entregados, informando oportunamente sobre cualquier deterioro, defecto o necesidad de reemplazo. Se procederá a la reposición inmediata de los elementos defectuosos o vencidos."),
            art("Se realizarán capacitaciones periódicas sobre el uso correcto de los EPP, las situaciones en que deben emplearse, la forma de almacenamiento y los riesgos asociados a su no utilización. La asistencia a estas capacitaciones es obligatoria para todo el personal expuesto a riesgos."),
        ],
    };
}

export function moduloComite(): ReglamentoSection {
    return {
        title: "COMITÉ PARITARIO DE HIGIENE Y SEGURIDAD",
        content: [
            plain("Cuando la empresa cuente con veinticinco o más trabajadores, deberá constituirse un Comité Paritario de Higiene y Seguridad, de conformidad con la legislación vigente sobre constitución y funcionamiento de estos organismos."),
            art("La organización constituirá y mantendrá un Comité Paritario de Higiene y Seguridad cuando corresponda conforme a la normativa vigente, integrado por tres representantes del empleador y tres representantes elegidos por los trabajadores, con sus respectivos suplentes. Los representantes de los trabajadores serán elegidos mediante votación secreta y directa."),
            art("El Comité Paritario tiene entre sus funciones: investigar las causas de los accidentes del trabajo y enfermedades profesionales ocurridos en la empresa, decidir si el accidente o enfermedad se debió a negligencia inexcusable del trabajador, promover la adopción de medidas preventivas, instruir a los trabajadores sobre la correcta utilización de los elementos de protección, y vigilar el cumplimiento de las normas de higiene y seguridad."),
            art("Los representantes de los trabajadores en el Comité Paritario gozarán de fuero en los términos que establece la ley. Los miembros del Comité dispondrán del tiempo necesario para cumplir sus funciones sin reducción de su remuneración. Las reuniones se realizarán en forma ordinaria al menos una vez al mes y en forma extraordinaria cuando las circunstancias lo requieran o cuando ocurra un accidente que cause la muerte de un trabajador."),
            art("Todos los trabajadores están obligados a colaborar con el Comité Paritario, informando sobre condiciones inseguras, participando en las actividades preventivas que se programen, y acatando las instrucciones y recomendaciones que emanen de dicho organismo. Las resoluciones del Comité serán obligatorias tanto para la empresa como para los trabajadores."),
        ],
    };
}

export function moduloEmpresaPequena(): ReglamentoSection {
    return {
        title: "DISPOSICIONES PARA EMPRESAS DE MENOR TAMAÑO",
        content: [
            art("Dada la estructura organizacional, las funciones administrativas, de supervisión y de gestión de personal podrán ser ejercidas directamente por el representante legal o por quien este designe, sin necesidad de establecer niveles jerárquicos intermedios."),
            art("La comunicación interna se realizará preferentemente de forma directa, sin perjuicio de que se puedan establecer canales formales adicionales cuando se estime necesario para el buen funcionamiento de las operaciones."),
            art("Se podrán adoptar procedimientos simplificados para la gestión de permisos, licencias, vacaciones y demás solicitudes del personal, siempre que se respeten los derechos establecidos por la legislación laboral y los contratos individuales."),
            art("En materia de prevención de riesgos, se designará al menos un trabajador encargado de velar por el cumplimiento de las normas de higiene y seguridad, sin perjuicio de la responsabilidad directa del empleador en esta materia."),
        ],
    };
}

export function moduloEmpresaMediana(): ReglamentoSection {
    return {
        title: "ORGANIZACIÓN Y ESTRUCTURA INTERNA",
        content: [
            art("La organización mantendrá una estructura definida, con niveles de supervisión y jefaturas que aseguren la correcta dirección, coordinación y control de las actividades laborales en cada área o departamento."),
            art("Los trabajadores reportarán a su jefe directo, quien será el responsable de asignar tareas, supervisar el cumplimiento de las obligaciones laborales, evaluar el desempeño y aplicar las medidas disciplinarias de primer nivel cuando corresponda."),
            art("Se establecerán procedimientos formales para la gestión de recursos humanos, incluyendo procesos de selección, inducción, capacitación, evaluación del desempeño, solicitud de permisos y licencias, y tramitación de reclamos internos."),
            art("Se implementarán canales institucionalizados de comunicación interna que aseguren que las políticas, instrucciones y decisiones de la administración sean difundidas oportunamente a todos los trabajadores afectados."),
        ],
    };
}

export function moduloEmpresaFormalAmpliada(): ReglamentoSection {
    return {
        title: "ESTRUCTURA CORPORATIVA Y GESTIÓN DEL PERSONAL",
        content: [
            art("La organización mantendrá una estructura formal con departamentos, áreas funcionales y líneas de reporte claramente definidas, asegurando una gestión eficiente y profesional de los recursos humanos."),
            art("Existirá un área o departamento de recursos humanos, o quien haga sus veces, encargado de administrar las relaciones laborales, velar por el cumplimiento de la normativa interna, gestionar los procesos de selección, contratación, capacitación, desarrollo profesional y desvinculación del personal."),
            art("Se implementará un sistema formal de evaluación del desempeño que permita medir objetivamente la contribución de cada trabajador, identificar necesidades de capacitación y fundamentar las decisiones relativas a promociones, incentivos y desarrollo de carrera."),
            art("Se establecerá un procedimiento formal de reclamos y sugerencias que permita a los trabajadores canalizar sus inquietudes de manera estructurada, asegurando el debido proceso y la respuesta oportuna por parte de la administración."),
            art("Se promoverán programas de bienestar laboral orientados a mejorar la calidad de vida de los trabajadores, pudiendo incluir beneficios complementarios, actividades de integración, convenios de salud, y demás iniciativas que fortalezcan el compromiso organizacional."),
        ],
    };
}
