import { ReglamentoData, ReglamentoSection, ContentItem } from "./types";
export type { ReglamentoData, ReglamentoSection, ContentItem };
import { moduloIdentificacion } from "./chapters/capitulo1_identificacion";
import { moduloAmbitoAplicacion } from "./chapters/capitulo2_ambito";
import { moduloPrincipios } from "./chapters/capitulo3_principios";
import { moduloDerechosEmpleador } from "./chapters/capitulo4_derechos";
import { moduloObligacionesTrabajador } from "./chapters/capitulo5_obligaciones";
import { moduloJornada } from "./chapters/capitulo6_jornada";
import { moduloTeletrabajo, moduloEPP, moduloComite, moduloEmpresaPequena, moduloEmpresaMediana, moduloEmpresaFormalAmpliada } from "./chapters/capitulos_condicionales";
import { moduloNormasInternas } from "./chapters/capitulo7_normas";
import { moduloLeyKarin } from "./chapters/capitulo_ley_karin";
import { moduloHigiene } from "./chapters/capitulo8_higiene";
import { moduloProcedimientoDisciplinario } from "./chapters/capitulo9_disciplinario";
import { moduloDisposicionesGenerales } from "./chapters/capitulo10_generales";
import { moduloActualizacion, moduloAdecuacionNormativa } from "./chapters/capitulo12_actualizacion";
import { moduloVigencia } from "./chapters/capitulo11_vigencia";

/* ═══════════════════════════════════════════
   ENSAMBLADOR PRINCIPAL (Refactorizado)
   ═══════════════════════════════════════════ */
export function buildReglamento(data: ReglamentoData): ReglamentoSection[] {
    const sections: ReglamentoSection[] = [];

    // ── Capítulos base (siempre presentes) ──
    sections.push(moduloIdentificacion(data));
    sections.push(moduloAmbitoAplicacion(data));
    sections.push(moduloPrincipios());
    sections.push(moduloDerechosEmpleador());
    sections.push(moduloObligacionesTrabajador());
    sections.push(moduloJornada(data));

    // ── Condicional: Teletrabajo ──
    if (data.trabajoRemoto === "si") {
        sections.push(moduloTeletrabajo());
    }

    sections.push(moduloNormasInternas(data));
    sections.push(moduloLeyKarin(data));
    sections.push(moduloHigiene(data));

    // ── Condicionales de seguridad ──
    if (data.usoEPP === "si") {
        sections.push(moduloEPP(data));
    }
    if (data.comiteParitario === "si") {
        sections.push(moduloComite());
    }

    // ── Por tamaño de empresa ──
    switch (data.numTrabajadores) {
        case "10-25":
            sections.push(moduloEmpresaPequena());
            break;
        case "26-50":
            sections.push(moduloEmpresaMediana());
            break;
        case "51+":
            sections.push(moduloEmpresaFormalAmpliada());
            break;
    }

    // ── Capítulos finales (siempre presentes) ──
    sections.push(moduloProcedimientoDisciplinario(data));
    sections.push(moduloDisposicionesGenerales(data));
    sections.push(moduloActualizacion());
    sections.push(moduloAdecuacionNormativa());
    sections.push(moduloVigencia());

    return sections;
}
