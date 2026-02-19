import { ReglamentoSection } from "../types";
import { art, plain } from "../helpers";

export function moduloPrincipios(): ReglamentoSection {
    return {
        title: "PRINCIPIOS GENERALES",
        content: [
            plain("Los principios que se enuncian a continuación constituyen el fundamento ético y normativo sobre el cual se construyen las relaciones laborales al interior de la organización."),
            art("Las relaciones laborales se fundan en los principios de buena fe, respeto mutuo, colaboración y cumplimiento de las obligaciones recíprocas que emanan de la ley y del contrato de trabajo. Se espera de cada trabajador una conducta acorde con estos valores."),
            art("Se reconoce y garantiza a todos los trabajadores el ejercicio pleno de sus derechos fundamentales, en particular el derecho a la integridad física y psíquica, la no discriminación, la libertad de conciencia, la protección de la vida privada y la honra personal, conforme a lo dispuesto en la Constitución y las leyes."),
            art("Todo trabajador tiene derecho a desempeñar sus funciones en un ambiente laboral libre de violencia, acoso y discriminación. La administración adoptará las medidas preventivas y correctivas necesarias para resguardar la dignidad de las personas y promover relaciones laborales armónicas."),
            art("Se velará por la igualdad de oportunidades en el acceso al empleo, la capacitación, la promoción y las condiciones de trabajo, prohibiendo toda forma de discriminación que no se base en la capacidad profesional o idoneidad personal del trabajador."),
            art("Estos principios informan la interpretación y aplicación de todas las normas contenidas en el presente Reglamento y deberán ser observados por empleadores y trabajadores en el ejercicio de sus respectivos derechos y obligaciones."),
        ],
    };
}
