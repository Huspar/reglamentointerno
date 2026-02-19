import { ContentItem, ReglamentoData } from "./types";

export function art(text: string): ContentItem {
    return { type: "article", text };
}

export function plain(text: string): ContentItem {
    return { type: "plain", text };
}

export function safe(val: string | undefined | null): string {
    return val && val.trim() ? val.trim() : "";
}

export function domicilioCompleto(d: ReglamentoData): string {
    return [d.domicilio, d.comuna, d.region].filter((v) => safe(v)).join(", ");
}

export function normalizarRubro(d: ReglamentoData): string {
    const cat = d.categoriaRiesgo;
    if (cat === "servicios_oficina") return "servicios profesionales u oficina";
    if (cat === "construccion") return "construcción";
    if (cat === "industrial") return "actividades industriales";
    if (cat === "comercio") return "comercio";
    if (cat === "otro") return safe(d.giro) || "actividades comerciales";
    return "servicios generales"; // Fallback seguro
}
