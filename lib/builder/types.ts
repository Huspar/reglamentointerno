export type ContentItem =
    | { type: "article"; text: string }
    | { type: "plain"; text: string };

export interface ReglamentoSection {
    title: string;
    content: ContentItem[];
}

export interface ReglamentoData {
    razonSocial: string;
    rutEmpresa: string;
    giro: string;
    domicilio: string;
    comuna: string;
    region: string;
    nombreCompleto: string;
    rutRepresentante: string;
    cargo: string;
    email: string;
    numTrabajadores: string;
    categoriaRiesgo: string;
    rubro: string; // Deprecado, mantener por compatibilidad
    jornadaGeneral: string;
    trabajoRemoto: string;
    controlAsistencia: string;
    usoEPP: string;
    comiteParitario: string;
    mutualidad: string;
    prohibiciones: string[];
    tipoProcedimiento: string;
    procedimientoDisciplinario: string;
    flexibleLegalWording?: boolean;
}
