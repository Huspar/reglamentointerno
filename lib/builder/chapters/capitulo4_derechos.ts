import { ReglamentoSection } from "../types";
import { art, plain } from "../helpers";

export function moduloDerechosEmpleador(): ReglamentoSection {
    return {
        title: "DERECHOS Y FACULTADES DEL EMPLEADOR",
        content: [
            plain("Sin perjuicio de los derechos que asisten a los trabajadores, el empleador conserva las prerrogativas de dirección y administración que la ley le confiere."),
            art("En ejercicio de su potestad de dirección, el empleador tiene la facultad de organizar, planificar y dirigir las actividades productivas, distribuyendo las funciones y tareas entre sus trabajadores conforme a las necesidades del negocio y respetando en todo momento la dignidad de las personas."),
            art("Corresponderá a la administración determinar la forma, condiciones y oportunidad del trabajo, establecer turnos y horarios de funcionamiento, efectuar las adecuaciones organizacionales que sean necesarias, y designar a los trabajadores en los puestos que estime convenientes."),
            art("Será facultad del empleador modificar las condiciones de trabajo en la medida que se ajusten al ius variandi reconocido por la ley, sin que ello implique menoscabo de los derechos del trabajador ni alteración sustancial de las condiciones pactadas."),
            art("Es derecho del empleador exigir de sus trabajadores el cumplimiento íntegro de las obligaciones pactadas, el respeto a las normas de este Reglamento, y la observancia de las instrucciones que se impartan para el correcto desempeño de las labores y la buena marcha de la organización."),
            art("La administración podrá establecer sistemas de control y evaluación del desempeño, implementar tecnologías para la gestión de asistencia y productividad, y adoptar las medidas internas que considere adecuadas, siempre dentro del marco legal vigente y con pleno respeto a los derechos fundamentales de los trabajadores."),
        ],
    };
}
