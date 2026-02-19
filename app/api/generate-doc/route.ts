import { NextRequest, NextResponse } from "next/server";
import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    PageBreak,
    Footer,
    PageNumber,
    NumberFormat,
    BorderStyle,
    convertMillimetersToTwip,
    LineRuleType,
} from "docx";
import { buildReglamento, type ReglamentoData, type ReglamentoSection, type ContentItem } from "@/lib/builder";
import { auditReglamento } from "@/lib/reglamentoAuditor";

import { db } from "@/lib/db";
import { auditEvents } from "@/lib/db/schema";
import { v4 as uuidv4 } from 'uuid';

/* ───── Roman numerals ───── */
const roman = [
    "I", "II", "III", "IV", "V", "VI", "VII",
    "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV",
    "XVI", "XVII", "XVIII", "XIX", "XX",
];

/* ═══════════════════════════════════════════
   DOCX PARAGRAPH HELPERS
   ═══════════════════════════════════════════ */

const LINE_SPACING_150 = {
    line: 360, // 360 twips = 1.5 líneas
    lineRule: LineRuleType.AUTO,
};

function emptyLine(count = 1): Paragraph[] {
    return Array.from({ length: count }, () =>
        new Paragraph({
            children: [],
            spacing: { after: convertMillimetersToTwip(4) },
        })
    );
}

/* ── Portada (null-safe) ── */
function buildPortada(data: ReglamentoData): Paragraph[] {
    const today = new Date().toLocaleDateString("es-CL", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const domicilio = [data.domicilio, data.comuna, data.region]
        .filter((v) => v && v.trim())
        .join(", ");

    const paras: Paragraph[] = [];

    // Espaciado superior generoso
    paras.push(...emptyLine(6));

    // Título principal - línea 1
    paras.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: "REGLAMENTO INTERNO",
                    bold: true,
                    font: "Arial",
                    size: 40,
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: convertMillimetersToTwip(2) },
        })
    );

    // Título principal - línea 2
    paras.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: "DE ORDEN, HIGIENE Y SEGURIDAD",
                    bold: true,
                    font: "Arial",
                    size: 40,
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: convertMillimetersToTwip(15) },
        })
    );

    // Datos empresa — solo campos con valor
    const fields: { label: string; value: string }[] = [];
    if (data.razonSocial?.trim()) fields.push({ label: "Empresa", value: data.razonSocial.trim() });
    if (data.rutEmpresa?.trim()) fields.push({ label: "RUT", value: data.rutEmpresa.trim() });
    if (domicilio) fields.push({ label: "Domicilio", value: domicilio });
    if (data.nombreCompleto?.trim()) {
        const repr = data.cargo?.trim()
            ? `${data.nombreCompleto.trim()} — ${data.cargo.trim()}`
            : data.nombreCompleto.trim();
        fields.push({ label: "Representante Legal", value: repr });
    }
    fields.push({ label: "Fecha de emisión", value: today });

    fields.forEach((f) => {
        paras.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `${f.label}: `,
                        bold: true,
                        font: "Arial",
                        size: 22,
                    }),
                    new TextRun({
                        text: f.value,
                        font: "Arial",
                        size: 22,
                    }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: convertMillimetersToTwip(3) },
            })
        );
    });

    // Page break after cover
    paras.push(
        new Paragraph({
            children: [new PageBreak()],
        })
    );

    return paras;
}

/* ── Índice (mejorado visualmente) ── */
function buildIndice(sections: ReglamentoSection[]): Paragraph[] {
    const paras: Paragraph[] = [];

    paras.push(...emptyLine(2));

    // Título del índice
    paras.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: "ÍNDICE",
                    bold: true,
                    font: "Arial",
                    size: 30,
                    allCaps: true,
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: convertMillimetersToTwip(12) },
        })
    );

    // Línea separadora bajo título
    paras.push(
        new Paragraph({
            border: {
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
            },
            spacing: { after: convertMillimetersToTwip(6) },
        })
    );

    // Entradas del índice
    sections.forEach((section, idx) => {
        paras.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `CAPÍTULO ${roman[idx] || idx + 1}`,
                        bold: true,
                        font: "Arial",
                        size: 22,
                    }),
                    new TextRun({
                        text: `   –   `,
                        font: "Arial",
                        size: 22,
                        color: "888888",
                    }),
                    new TextRun({
                        text: section.title,
                        font: "Arial",
                        size: 22,
                    }),
                ],
                spacing: {
                    after: convertMillimetersToTwip(3),
                    ...LINE_SPACING_150,
                },
            })
        );
    });

    // Línea separadora final
    paras.push(
        new Paragraph({
            border: {
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
            },
            spacing: {
                before: convertMillimetersToTwip(4),
                after: convertMillimetersToTwip(4),
            },
        })
    );

    // Page break after index
    paras.push(
        new Paragraph({
            children: [new PageBreak()],
        })
    );

    return paras;
}

/* ── Título de capítulo (dos líneas) ── */
function chapterTitleParagraphs(index: number, title: string): Paragraph[] {
    return [
        // Línea 1: CAPÍTULO X
        new Paragraph({
            children: [
                new TextRun({
                    text: `CAPÍTULO ${roman[index] || index + 1}`,
                    bold: true,
                    font: "Arial",
                    size: 26, // 13pt
                    allCaps: true,
                }),
            ],
            spacing: {
                before: convertMillimetersToTwip(10),
                after: convertMillimetersToTwip(1),
            },
            alignment: AlignmentType.CENTER,
        }),
        // Línea 2: TÍTULO
        new Paragraph({
            children: [
                new TextRun({
                    text: title,
                    bold: true,
                    font: "Arial",
                    size: 24, // 12pt
                    allCaps: true,
                }),
            ],
            spacing: {
                after: convertMillimetersToTwip(6),
            },
            alignment: AlignmentType.CENTER,
        }),
    ];
}

/* ── Artículo numerado (ARTÍCULO X° en su propia línea) ── */
function articleParagraphs(num: number, text: string): Paragraph[] {
    return [
        // Línea: ARTÍCULO X°
        new Paragraph({
            children: [
                new TextRun({
                    text: `ARTÍCULO ${num}°`,
                    bold: true,
                    font: "Arial",
                    size: 22,
                }),
            ],
            spacing: {
                before: convertMillimetersToTwip(4),
                after: convertMillimetersToTwip(1),
                ...LINE_SPACING_150,
            },
            alignment: AlignmentType.JUSTIFIED,
        }),
        // Cuerpo del artículo
        new Paragraph({
            children: [
                new TextRun({
                    text,
                    font: "Arial",
                    size: 22,
                }),
            ],
            spacing: {
                after: convertMillimetersToTwip(3),
                ...LINE_SPACING_150,
            },
            alignment: AlignmentType.JUSTIFIED,
        }),
    ];
}

/* ── Párrafo sin numeración (introducciones) ── */
function plainParagraph(text: string): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text,
                font: "Arial",
                size: 22,
                italics: true,
            }),
        ],
        spacing: {
            before: convertMillimetersToTwip(2),
            after: convertMillimetersToTwip(2),
            ...LINE_SPACING_150,
        },
        alignment: AlignmentType.JUSTIFIED,
    });
}

/* ═══════════════════════════════════════════
   ASSEMBLER: Secciones → DOCX
   ═══════════════════════════════════════════ */
function generateDocxFromSections(
    sections: ReglamentoSection[],
    data: ReglamentoData
): Document {
    const children: Paragraph[] = [];

    // ═══ 1. PORTADA (página propia) ═══
    children.push(...buildPortada(data));

    // ═══ 2. ÍNDICE (página propia) ═══
    children.push(...buildIndice(sections));

    // ═══ 3. CAPÍTULOS CON ARTÍCULOS NUMERADOS ═══
    let articleCounter = 1;

    sections.forEach((section, idx) => {
        // Título del capítulo (dos líneas centradas)
        children.push(...chapterTitleParagraphs(idx, section.title));

        // Contenido
        section.content.forEach((item: ContentItem) => {
            if (item.type === "article") {
                children.push(...articleParagraphs(articleCounter, item.text));
                articleCounter++;
            } else {
                children.push(plainParagraph(item.text));
            }
        });
    });

    // ═══ 4. FIRMA ═══
    children.push(...emptyLine(3));

    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: "________________________",
                    font: "Arial",
                    size: 22,
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: convertMillimetersToTwip(10) },
        })
    );
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: data.nombreCompleto,
                    bold: true,
                    font: "Arial",
                    size: 22,
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: convertMillimetersToTwip(1) },
        })
    );
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: data.cargo,
                    font: "Arial",
                    size: 22,
                    color: "555555",
                }),
            ],
            alignment: AlignmentType.CENTER,
        })
    );
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: data.razonSocial,
                    font: "Arial",
                    size: 22,
                    color: "555555",
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: convertMillimetersToTwip(10) },
        })
    );

    // ═══ DOCUMENTO FINAL ═══
    return new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: convertMillimetersToTwip(25),
                            right: convertMillimetersToTwip(25),
                            bottom: convertMillimetersToTwip(25),
                            left: convertMillimetersToTwip(30),
                        },
                        pageNumbers: {
                            start: 1,
                            formatType: NumberFormat.DECIMAL,
                        },
                    },
                },
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Página ",
                                        font: "Arial",
                                        size: 18,
                                        color: "888888",
                                    }),
                                    new TextRun({
                                        children: [PageNumber.CURRENT],
                                        font: "Arial",
                                        size: 18,
                                        color: "888888",
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                            }),
                        ],
                    }),
                },
                children,
            },
        ],
    });
}

/* ───── POST Handler ───── */
export async function POST(request: NextRequest) {
    try {
        const data: ReglamentoData = await request.json();

        if (!data.razonSocial || !data.rutEmpresa || !data.nombreCompleto) {
            return NextResponse.json(
                { error: "Faltan datos obligatorios para generar el documento." },
                { status: 400 }
            );
        }

        /* ─── RATE LIMIT CHECK ─── */
        // Get client IP using standard headers
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(',')[0] : "127.0.0.1";

        // Only check rate limit in production
        if (process.env.NODE_ENV === "production") {
            const { checkRateLimit } = await import("@/lib/rate-limit");
            const allowed = await checkRateLimit(ip);
            if (!allowed) {
                return NextResponse.json(
                    { error: "Has excedido el límite de generaciones por hora. Intenta más tarde." },
                    { status: 429 }
                );
            }
        }
        /* ─── PROMOTION CHECK (PRE-FLIGHT) ─── */
        // Check if any fixes have been promoted to default behavior
        // In a high-traffic app, we would cache this or use a config service. 
        // For now, a quick DB lookup is fine.
        try {
            // const promoRes = await sql`SELECT fix_code FROM builder_promotions WHERE promoted = true`;
            // Drizzle replacement:
            const { builderPromotions } = await import("@/lib/db/schema");
            const { eq } = await import("drizzle-orm");

            const promotedItems = await db.select({ fixCode: builderPromotions.fix_code })
                .from(builderPromotions)
                .where(eq(builderPromotions.promoted, true));

            const promotedCodes = promotedItems.map(r => r.fixCode);

            if (promotedCodes.includes('ARTICULO_9_RIGIDO') ||
                promotedCodes.includes('PROHIBITED_STRING') ||
                promotedCodes.includes('REFERENCIA_AUTORIDAD_RIGIDA')) {
                // If these are promoted, we enable flexible wording by default
                // This prevents them from being flagged as issues/fixes again
                data.flexibleLegalWording = true;
            }
        } catch (e) {
            console.error("Error checking promotions:", e);
        }

        /* ─── AUDITORÍA AUTOMÁTICA (PASS 1) ─── */
        // Primera pasada: Generamos y auditamos con la data original (o modificada por promociones)
        let sections = buildReglamento(data);
        let audit = auditReglamento(sections, data, { mode: "strict", enableAutofix: true });

        // ─── AUTO-FIX LOGIC ───
        // Detectamos si hay problemas de rigidez normativa que podemos corregir solos
        const rigidIssues = audit.result.issues.filter(i =>
            i.code === "ARTICULO_9_RIGIDO" ||
            i.code === "PROHIBITED_STRING" ||
            i.code === "REFERENCIA_AUTORIDAD_RIGIDA"
        );

        if (rigidIssues.length > 0) {
            // Aplicamos corrección silenciosa
            console.log(`[API] Applying Autofix for ${rigidIssues.length} rigid issues...`);
            data.flexibleLegalWording = true;

            // Segunda pasada: Re-generamos y re-auditamos
            sections = buildReglamento(data);
            audit = auditReglamento(sections, data, { mode: "strict", enableAutofix: true });
        }

        const { result, fixedSections } = audit;
        const ignoreWarnings = request.nextUrl.searchParams.get("ignoreWarnings") === "true";

        const errors = result.issues.filter((i) => i.severity === "error");
        const warnings = result.issues.filter((i) => i.severity === "warn");

        // 1. BLOCKING ERRORS: Siempre detienen la generación (422)
        if (errors.length > 0) {
            // ... existing error logic ...
            if (process.env.NODE_ENV === "development" && process.env.AUDIT_DEBUG) {
                return NextResponse.json({ error: "Errores de auditoría (DEV)", details: result }, { status: 400 });
            }
            return NextResponse.json(
                {
                    error: "No pudimos generar el documento porque faltan datos.",
                    issues: errors
                },
                { status: 422 }
            );
        }

        // 2. WARNINGS: 
        // Si después del Auto-Fix TODAVÍA quedan warnings (de otro tipo), mostramos panel.
        // PERO si los únicos warnings eran los que ya arreglamos, errors será 0 y warnings será 0 (o solo info).
        // Si quedan otros warnings (ej: Rubro incoherente), sí mostramos el panel.
        if (warnings.length > 0 && !ignoreWarnings) {
            return NextResponse.json(
                {
                    error: "Hay recomendaciones pendientes.",
                    issues: warnings,
                    canProceed: true
                },
                { status: 422 }
            );
        }

        /* ─── TELEMETRY LOGGING (POSTGRES) ─── */
        // Non-blocking fire-and-forget (ish) - await to ensure it runs in lambda
        try {
            const variant = determineVariant(data);
            const issuesData = result.issues.map(i => ({ severity: i.severity, code: i.code }));
            const fixesData = rigidIssues.map(i => ({ code: i.code, count: 1 }));
            const errorCount = result.issues.filter(i => i.severity === 'error').length;
            const warnCount = result.issues.filter(i => i.severity === 'warn').length;
            const hasError = errorCount > 0;
            const autofixApplied = rigidIssues.length > 0;

            // Non-blocking fire-and-forget (ish) - await to ensure it runs in lambda
            await db.insert(auditEvents).values({
                model_variant: variant,
                issues: issuesData,
                fixes: fixesData,
                autofix_applied: autofixApplied,
                has_error: hasError,
                error_count: errorCount,
                warn_count: warnCount
            });
        } catch (e) {
            console.error("Telemetry error (DB):", e);
        }

        const doc = generateDocxFromSections(fixedSections, data);
        const buffer = await Packer.toBuffer(doc);

        return new NextResponse(buffer as any, {
            status: 200,
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Content-Disposition": `attachment; filename="reglamento_interno_${data.rutEmpresa}.docx"`,
            },
        });
    } catch (error: any) {
        console.error("Error generating doc:", error);
        return NextResponse.json(
            { error: "Error interno del servidor al generar el documento." },
            { status: 500 }
        );
    }
}

function determineVariant(d: ReglamentoData): string {
    // Robust variant generation: RUBRO_SIZE
    // Sanitize inputs
    const rubro = d.rubro ? d.rubro.toLowerCase().replace(/\s+/g, '_') : 'unknown_rubro';

    // Map workers to segment
    let size = 'unknown_size';
    if (d.numTrabajadores === '1-9') size = 'micro';
    else if (d.numTrabajadores === '10-25') size = 'small';
    else if (d.numTrabajadores === '26-50') size = 'medium';
    else if (d.numTrabajadores === '51+' || d.numTrabajadores === '100+') size = 'large';
    else if (d.numTrabajadores) size = d.numTrabajadores.replace(/\+/g, '_plus').replace(/-/g, '_');

    // Telework suffix
    const suffix = d.trabajoRemoto === 'si' ? '_remote' : '';

    return `${rubro}_${size}${suffix}`;
}
