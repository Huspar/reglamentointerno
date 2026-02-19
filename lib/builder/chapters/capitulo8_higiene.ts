import { ReglamentoData, ReglamentoSection, ContentItem } from "../types";
import { art, plain, safe } from "../helpers";

/* ─── Adaptación por Rubro ─── */
interface RubroContext {
    riesgosEjemplo: string;
    medidasPreventivas: string;
    eppContexto: string;
    ambienteLaboral: string;
}

export function adaptarSegunRubro(categoriaRiesgo: string): RubroContext {
    switch (categoriaRiesgo) {
        case "construccion":
            return {
                riesgosEjemplo:
                    "caídas de altura, atrapamientos, contacto con sustancias peligrosas, exposición a ruido y vibraciones, riesgos eléctricos y proyección de partículas propios de la actividad constructiva",
                medidasPreventivas:
                    "la señalización de zonas de riesgo, la instalación de barandas y redes de protección, la delimitación de áreas de tránsito seguro y la supervisión permanente de las condiciones de trabajo en obra",
                eppContexto:
                    "cascos de seguridad, arneses para trabajos en altura, guantes industriales, calzado de seguridad con puntera reforzada, protección auditiva y respiratoria, según la naturaleza de las tareas asignadas",
                ambienteLaboral:
                    "las faenas constructivas y los frentes de trabajo",
            };
        case "industrial":
            return {
                riesgosEjemplo:
                    "atrapamiento por maquinaria, exposición a agentes químicos, ruido industrial, riesgos ergonómicos derivados de la manipulación de cargas y riesgos eléctricos asociados a procesos productivos",
                medidasPreventivas:
                    "el mantenimiento preventivo de equipos y maquinaria, la ventilación adecuada de los espacios de trabajo, la señalización de zonas peligrosas y la capacitación continua en procedimientos seguros de operación",
                eppContexto:
                    "protección auditiva, respiratoria y visual, guantes especializados, calzado de seguridad y vestimenta adecuada al tipo de proceso industrial en que se desempeñen",
                ambienteLaboral:
                    "las instalaciones productivas y áreas de operación industrial",
            };
        case "comercio":
            return {
                riesgosEjemplo:
                    "caídas al mismo nivel, sobreesfuerzos por manipulación manual de mercadería, riesgos ergonómicos derivados de posturas prolongadas y exposición a riesgos de seguridad en la atención al público",
                medidasPreventivas:
                    "la mantención de pisos limpios y sin obstáculos, la correcta organización de bodegas y estanterías, el uso de escaleras y elementos auxiliares apropiados, y la capacitación en técnicas de levantamiento seguro",
                eppContexto:
                    "calzado antideslizante, guantes para manipulación de carga y los elementos que correspondan según la evaluación de riesgos del puesto de trabajo",
                ambienteLaboral:
                    "los locales comerciales, bodegas y dependencias de atención al público",
            };
        case "servicios_oficina":
        default:
            return {
                riesgosEjemplo:
                    "riesgos ergonómicos derivados del uso prolongado de equipos de escritorio, fatiga visual, estrés laboral y riesgos psicosociales asociados a la carga de trabajo",
                medidasPreventivas:
                    "la adecuación ergonómica de los puestos de trabajo, pausas activas, iluminación apropiada, ventilación adecuada y la promoción de hábitos saludables en el entorno laboral",
                eppContexto:
                    "los elementos ergonómicos y de protección que resulten pertinentes conforme a la evaluación de riesgos de cada puesto de trabajo",
                ambienteLaboral:
                    "las oficinas, dependencias administrativas y lugares donde se presten los servicios",
            };
    }
}

export function moduloHigiene(d: ReglamentoData): ReglamentoSection {
    const ctx = adaptarSegunRubro(d.categoriaRiesgo);

    const content: ContentItem[] = [
        plain("En cumplimiento del deber general de protección que la legislación sobre accidentes del trabajo y enfermedades profesionales impone al empleador, se establecen las siguientes disposiciones en materia de higiene y seguridad."),
        art(`La organización adoptará todas las medidas necesarias para proteger eficazmente la vida y la salud de los trabajadores, manteniendo las condiciones adecuadas de higiene y seguridad en ${ctx.ambienteLaboral}, en conformidad con la legislación sobre seguro social contra riesgos de accidentes del trabajo y enfermedades profesionales, y con las normas reglamentarias sobre prevención de riesgos.`),
        art(`Se identifican como riesgos principales asociados a la actividad: ${ctx.riesgosEjemplo}. La organización elaborará y mantendrá actualizado el reglamento de seguridad contemplado por la normativa reglamentaria, implementando las medidas de control y mitigación que resulten pertinentes para cada uno de los riesgos identificados.`),
        art(`Entre las medidas preventivas que se adoptarán se incluyen: ${ctx.medidasPreventivas}. Los trabajadores deberán colaborar activamente en la mantención de estas condiciones y cumplir con las disposiciones del Departamento de Prevención de Riesgos o del encargado de seguridad, según corresponda.`),
        art("Cada trabajador está obligado a cumplir con las normas e instrucciones de higiene y seguridad, utilizar los elementos de protección que se le proporcionen, participar en las actividades de capacitación en prevención de riesgos, y cooperar en la mantención de condiciones seguras de trabajo. El trabajador que detecte condiciones de riesgo tiene el derecho y la obligación de informarlo de inmediato."),
        art("Queda prohibido realizar acciones que comprometan la seguridad propia o de terceros, desactivar o alterar dispositivos de seguridad, retirar protecciones de maquinarias, bloquear salidas de emergencia, o negarse a utilizar los elementos de protección personal cuando sean requeridos."),
        art("La organización mantendrá en sus dependencias los elementos necesarios para prestar primeros auxilios, señalización de seguridad adecuada, vías de evacuación despejadas, equipos contra incendios operativos, y un plan de emergencia actualizado que será dado a conocer a todos los trabajadores."),
    ];

    if (safe(d.mutualidad)) {
        content.push(
            art(`La organización se encuentra adherida a ${d.mutualidad} como organismo administrador del seguro social contra riesgos de accidentes del trabajo y enfermedades profesionales. Todo accidente laboral, por leve que sea, debe ser informado de inmediato al jefe directo para gestionar la denuncia correspondiente dentro de los plazos legales.`)
        );
    }

    content.push(
        art("Todo trabajador que sufra un accidente del trabajo o presente síntomas de enfermedad profesional deberá dar aviso inmediato a su jefe directo. Se realizará la denuncia ante el organismo administrador correspondiente, se facilitará la atención médica oportuna y se adoptarán las medidas preventivas necesarias para evitar la repetición del siniestro."),
        art("Se realizarán periódicamente evaluaciones de los riesgos presentes en los distintos puestos de trabajo, implementando las medidas correctivas que resulten de dichas evaluaciones. Los trabajadores deberán colaborar activamente en la identificación de riesgos y en la implementación de las medidas de control.")
    );

    return { title: "HIGIENE Y SEGURIDAD EN EL TRABAJO", content };
}
