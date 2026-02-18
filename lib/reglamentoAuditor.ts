export type AuditSeverity = "info" | "warn" | "error";

export type AuditIssue = {
    severity: AuditSeverity;
    code: string;
    message: string;
    where?: { chapterTitle?: string; articleNumber?: number };
    snippet?: string;
};

export type AuditResult = {
    issues: AuditIssue[];
    stats: {
        chapterCount: number;
        articleCount: number;
        avgArticleLength: number;
        shortArticles: number;
        longArticles: number;
        repeatedStartsTop: Array<{ start: string; count: number }>;
        hasNormativeContradiction: boolean;
        placeholderCount: number;
        semanticWarningsCount: number;
    };
};

import { ReglamentoData } from "./reglamentoBuilder";

export function auditReglamento(
    sections: Array<{ title: string; content: any[] }>,
    data: ReglamentoData, // New argument
    opts?: {
        mode?: "strict" | "normal";
        enableAutofix?: boolean;
    }
): { result: AuditResult; fixedSections: Array<{ title: string; content: any[] }> } {
    const mode = opts?.mode || "normal";
    const enableAutofix = opts?.enableAutofix || false;

    const issues: AuditIssue[] = [];
    let articleCount = 0;
    let totalLength = 0;
    let shortArticles = 0;
    let longArticles = 0;
    let placeholderCount = 0;
    let semanticWarningsCount = 0;
    let hasNormativeContradiction = false;
    const startPhrases: Record<string, number> = {};

    // Pattern trackers
    let hoursFound_Ordinary: number | null = null;
    let hoursFound_Limit: number | null = null;

    // Deep copy for autofix to avoid mutating original if not needed
    const fixedSections = JSON.parse(JSON.stringify(sections));

    // A) Placeholders Detect
    const placeholders = ["no especificado", "N/A", "undefined", "null", "Otro"];
    // Email regex for placeholder detection
    const emailPlaceholderRegex = /(@random\.com$|demo@|no-reply@|test@)/i;
    // General Email regex
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;

    // B) Prohibited Strings
    const prohibited = ["Ministerio de Salud", "Inspección del Trabajo"];

    // ─── VALIDACIÓN SEMÁNTICA RUBRO VS GIRO (WARN) ───
    if (data.categoriaRiesgo === "construccion") {
        const keywords = ["construcción", "obra", "faena", "civil", "edificación"];
        const lowerGiro = (data.giro || "").toLowerCase();
        if (!keywords.some(k => lowerGiro.includes(k))) {
            issues.push({
                severity: "warn",
                code: "RUBRO_GIRO_INCOHERENTE",
                message: `Categoría 'construcción' pero giro '${data.giro}' no parece relacionado (faltan keywords: obra, faena, civil...).`
            });
            semanticWarningsCount++;
        }
    }

    // Checking email in data directly too
    if (data.email && emailPlaceholderRegex.test(data.email)) {
        issues.push({
            severity: "error",
            code: "EMAIL_PLACEHOLDER",
            message: `Email de contacto parece fake: "${data.email}"`
        });
        placeholderCount++;
    }

    // Helper to process text
    const checkText = (text: string, chapterTitle: string, articleNum?: number) => {
        // Placeholders
        placeholders.forEach((ph) => {
            if (text.includes(ph)) {
                // Special check for "Otro" - only if it appears as a standalone option or specific context
                const regex = new RegExp(`\\b${ph}\\b`, "i");
                if (regex.test(text)) {
                    issues.push({
                        severity: "error",
                        code: "PLACEHOLDER_FOUND",
                        message: `Se encontró placeholder o dato inválido: "${ph}"`,
                        where: { chapterTitle, articleNumber: articleNum },
                        snippet: text.substring(Math.max(0, text.indexOf(ph) - 10), text.indexOf(ph) + 20) + "..."
                    });
                    placeholderCount++;
                }
            }
        });

        // Prohibited / Rigid Strings
        prohibited.forEach((bad) => {
            if (text.includes(bad)) {
                // Special check for Article 9 rigidity
                const isRigidContext = text.includes("Ministerio de Salud y a la Inspección del Trabajo");
                const code = isRigidContext ? "ARTICULO_9_RIGIDO" : "PROHIBITED_STRING";

                issues.push({
                    severity: mode === "strict" ? "error" : "warn",
                    code: code,
                    message: `Uso de término restringido o configurable: "${bad}"`,
                    where: { chapterTitle, articleNumber: articleNum },
                    snippet: text.substring(Math.max(0, text.indexOf(bad) - 10), text.indexOf(bad) + 20) + "..."
                });
                if (code === "ARTICULO_9_RIGIDO") semanticWarningsCount++;
            }
        });

        // Email check in text
        const emails = text.match(emailRegex);
        if (emails) {
            emails.forEach((email) => {
                if (emailPlaceholderRegex.test(email)) {
                    issues.push({
                        severity: "error",
                        code: "EMAIL_PLACEHOLDER",
                        message: `Email sospechoso en texto: "${email}"`,
                        where: { chapterTitle, articleNumber: articleNum }
                    });
                    placeholderCount++;
                }
            });
        }

        // Jornada Logic
        const matchOrd = text.match(/jornada ordinaria de trabajo será de (\d+) horas/i);
        if (matchOrd) hoursFound_Ordinary = parseInt(matchOrd[1], 10);

        const matchLim = text.match(/no podrá exceder de (\d+) horas/i);
        if (matchLim) hoursFound_Limit = parseInt(matchLim[1], 10);
    };

    fixedSections.forEach((section: any, secIdx: number) => {
        if (!section.content || section.content.length === 0) {
            issues.push({
                severity: "error",
                code: "EMPTY_CHAPTER",
                message: `El capítulo "${section.title}" no tiene contenido.`,
                where: { chapterTitle: section.title }
            });
            return;
        }

        section.content.forEach((item: any, itemIdx: number) => {
            let text = item.text || "";

            // Autofix: trim double spaces
            if (enableAutofix) {
                text = text.replace(/\s+/g, " ").trim();
                // Normalize quotes
                text = text.replace(/[""]/g, '"').replace(/['']/g, "'");
                item.text = text;
            }

            // Repetition & Stats Logic
            if (item.type === "article") {
                articleCount++;
                totalLength += text.length;

                if (text.length < 180) shortArticles++;
                if (text.length > 1800) longArticles++;

                checkText(text, section.title, articleCount);

                // Start phrase analysis (first 6 words)
                const words = text.split(" ").slice(0, 6).join(" ");
                if (words.length > 10) {
                    startPhrases[words] = (startPhrases[words] || 0) + 1;
                }

                // Autofix Variation Logic
                if (enableAutofix && text.startsWith("La empresa podrá")) {
                    // We can't know global count yet, but we can apply probabilistic variation
                    // or round-robin if we did a two-pass. For simplicity/speed/instruction:
                    // "Aplicar máximo a 30% de ocurrencias"
                    // We'll use a deterministic hash based on length + index to decide
                    if ((articleCount + text.length) % 3 === 0) {
                        const variations = [
                            "Será facultad del empleador",
                            "Corresponderá a la administración",
                            "La organización tendrá la facultad de"
                        ];
                        const replacement = variations[articleCount % variations.length];
                        // Replace only the start
                        item.text = text.replace("La empresa podrá", replacement);
                    }
                }

            } else {
                checkText(text, section.title);
            }
        });
    });

    // ─── VALIDACIÓN JORNADA CONTRADICTORIA (ERROR) ───
    if (hoursFound_Ordinary !== null && hoursFound_Limit !== null) {
        if (hoursFound_Ordinary !== hoursFound_Limit) {
            hasNormativeContradiction = true;
            issues.push({
                severity: "error",
                code: "JORNADA_INCONSISTENTE",
                message: `Contradicción normativa: Jornada ordinaria es ${hoursFound_Ordinary} hrs pero límite dice ${hoursFound_Limit} hrs.`
            });
        }
    }

    // Post-processing Stats
    const repeatedStartsTop = Object.entries(startPhrases)
        .filter(([_, count]) => count >= 6)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([start, count]) => ({ start, count }));

    repeatedStartsTop.forEach((item) => {
        issues.push({
            severity: "warn",
            code: "REPETITIVE_START",
            message: `El inicio de artículo "${item.start}..." se repite ${item.count} veces.`,
        });
    });

    // Structural Checks
    if (fixedSections.length < 8) {
        issues.push({
            severity: "warn",
            code: "FEW_CHAPTERS",
            message: `El documento tiene pocos capítulos (${fixedSections.length}).`,
        });
    }
    if (articleCount < 25) {
        issues.push({
            severity: mode === "strict" ? "error" : "warn",
            code: "FEW_ARTICLES",
            message: `El documento tiene pocos artículos (${articleCount}).`,
        });
    }

    const result: AuditResult = {
        issues,
        stats: {
            chapterCount: fixedSections.length,
            articleCount,
            avgArticleLength: articleCount > 0 ? Math.round(totalLength / articleCount) : 0,
            shortArticles,
            longArticles,
            repeatedStartsTop,
            hasNormativeContradiction,
            placeholderCount,
            semanticWarningsCount
        }
    };

    return { result, fixedSections };
}
