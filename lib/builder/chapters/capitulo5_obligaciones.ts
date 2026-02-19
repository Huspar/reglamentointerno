import { ReglamentoSection } from "../types";
import { art, plain } from "../helpers";

export function moduloObligacionesTrabajador(): ReglamentoSection {
    return {
        title: "OBLIGACIONES DEL TRABAJADOR",
        content: [
            plain("En el marco de la relación laboral, los trabajadores asumen las siguientes obligaciones esenciales, cuyo cumplimiento resulta indispensable para la buena marcha de la organización."),
            art("Son obligaciones esenciales de todo trabajador: cumplir fielmente con las estipulaciones de su contrato de trabajo, desempeñar las funciones asignadas con diligencia, responsabilidad y dedicación, respetar las instrucciones legítimas de sus superiores jerárquicos, y mantener una conducta compatible con la buena convivencia laboral."),
            art("Cada trabajador deberá presentarse a sus labores en condiciones físicas y mentales adecuadas para el desempeño seguro de sus funciones, manteniendo su lugar de trabajo limpio y ordenado, y utilizando correctamente los equipos, herramientas y materiales que le sean proporcionados."),
            art("Todos los trabajadores están obligados a guardar confidencialidad respecto de toda información comercial, técnica, financiera, estratégica y de clientes a la que tengan acceso en razón de su cargo, tanto durante la vigencia de la relación laboral como con posterioridad a su término."),
            art("Es deber de todo trabajador informar oportunamente a su jefe directo de cualquier anomalía, desperfecto, situación de riesgo, accidente o cuasi accidente que detecte en el desempeño de sus funciones, así como de cualquier impedimento para asistir a su trabajo o cumplir con sus obligaciones."),
            art("Los trabajadores deberán participar en las actividades de capacitación, inducción y entrenamiento que la organización disponga, especialmente aquellas relacionadas con la prevención de riesgos laborales, el cumplimiento normativo y el desarrollo de competencias para el ejercicio de sus funciones."),
            art("Todo trabajador deberá conducirse con respeto, cortesía y profesionalismo hacia sus compañeros de trabajo, superiores, subordinados, clientes, proveedores y cualquier persona con la que interactúe en el contexto de sus funciones laborales."),
        ],
    };
}
