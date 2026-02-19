import { ReglamentoData, ReglamentoSection, ContentItem } from "../types";
import { art, plain, safe } from "../helpers";

export function moduloJornada(d: ReglamentoData): ReglamentoSection {
    const jornada = safe(d.jornadaGeneral) || "la jornada establecida en el contrato individual de trabajo";

    const content: ContentItem[] = [
        plain("En concordancia con las facultades de organización del empleador, la jornada laboral se regirá por las disposiciones que se establecen a continuación."),
        art(`La jornada ordinaria de trabajo será de ${jornada}. La distribución de la jornada, los turnos y los descansos dentro de ella se establecerán conforme a las necesidades operativas, respetando en todo caso los límites máximos legales.`),
        art("La jornada ordinaria no podrá exceder de cuarenta y cuatro horas semanales, distribuidas en no más de seis ni menos de cinco días, conforme a la reducción progresiva establecida por la ley. Esta jornada máxima continuará disminuyendo gradualmente según el calendario legal, hasta alcanzar las cuarenta horas semanales. La jornada diaria no superará las diez horas, salvo los casos de distribución excepcional que la ley autoriza. Se garantizará un descanso semanal de al menos un día, preferentemente el domingo."),
        art("Las horas extraordinarias solo podrán pactarse para atender necesidades o situaciones temporales. Deberán constar por escrito, no excederán de dos horas por día, y se remunerarán con un recargo del cincuenta por ciento sobre el sueldo convenido para la jornada ordinaria."),
    ];

    if (d.controlAsistencia === "si") {
        content.push(
            art("La organización mantendrá un sistema de control de asistencia mediante el cual todo trabajador deberá registrar personalmente su hora de ingreso y salida de forma diaria. Queda estrictamente prohibido registrar la asistencia en nombre de otro. El registro fraudulento será considerado falta grave que podrá dar lugar a la terminación del contrato.")
        );
    } else {
        content.push(
            art("El control de la asistencia y la puntualidad se realizará mediante los mecanismos que la administración disponga, los cuales deberán ajustarse a la normativa laboral vigente. Cada trabajador es responsable de cumplir estrictamente con los horarios establecidos en su contrato y en las instrucciones internas.")
        );
    }

    content.push(
        art("Los atrasos e inasistencias injustificadas facultarán al empleador para aplicar los descuentos de remuneraciones que procedan conforme a la ley, sin perjuicio de las medidas disciplinarias que correspondan según la gravedad y reiteración de la falta. El trabajador deberá justificar documentalmente toda ausencia dentro de las veinticuatro horas siguientes."),
        art("Los trabajadores tendrán derecho a un descanso para colación de al menos treinta minutos dentro de la jornada, el cual no se considerará como tiempo trabajado. La administración podrá establecer turnos escalonados de colación cuando la naturaleza de las operaciones así lo requiera.")
    );

    return { title: "JORNADA DE TRABAJO Y DESCANSOS", content };
}
