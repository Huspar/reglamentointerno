
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
import {
    buildReglamento,
    type ReglamentoData,
    type ReglamentoSection,
    type ContentItem,
} from "../lib/reglamentoBuilder";
import * as fs from "fs";
import * as path from "path";

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
function sectionsToDocx(
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
            spacing: { after: convertMillimetersToTwip(10) },
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

// ──────────────────────────────────────────────
// LOGIC: Generate 3 Test Docs
// ──────────────────────────────────────────────

const testCases: ReglamentoData[] = [
    {
        razonSocial: "Servicios Rápidos Ltda.",
        rutEmpresa: "76.111.111-1",
        domicilio: "Av. Providencia 1234",
        comuna: "Providencia",
        region: "Metropolitana",
        nombreCompleto: "Juan Pérez",
        cargo: "Gerente General",
        email: "contacto@servicios.cl",
        numTrabajadores: "10-25", // Pequeña
        categoriaRiesgo: "servicios_oficina",
        rubro: "", // Deprecado, vacío
        usoEPP: "no",
        trabajoRemoto: "no",
        comiteParitario: "no",
        jornadaGeneral: "44 horas",
        controlAsistencia: "digital",
        mutualidad: "ACHS",
        prohibiciones: [],
        tipoProcedimiento: "general",
        procedimientoDisciplinario: "general",
        giro: "Consultoría TI",
        rutRepresentante: "11.111.111-1"
    },
    {
        razonSocial: "Constructora Andes SpA",
        rutEmpresa: "77.222.222-2",
        domicilio: "Calle Industrial 500",
        comuna: "Maipú",
        region: "Metropolitana",
        nombreCompleto: "María González",
        cargo: "Jefa de RRHH",
        email: "rrhh@andes.cl",
        numTrabajadores: "26-50", // Mediana
        categoriaRiesgo: "construccion",
        rubro: "",
        usoEPP: "si",
        trabajoRemoto: "no",
        comiteParitario: "no",
        jornadaGeneral: "44 horas",
        controlAsistencia: "reloj",
        mutualidad: "Mutual de Seguridad",
        prohibiciones: [],
        tipoProcedimiento: "general",
        procedimientoDisciplinario: "general",
        giro: "Construcción de edificios",
        rutRepresentante: "22.222.222-2"
    },
    {
        razonSocial: "Tecnologías del Futuro S.A.",
        rutEmpresa: "99.333.333-3",
        domicilio: "Av. Apoquindo 4000",
        comuna: "Las Condes",
        region: "Metropolitana",
        nombreCompleto: "Carlos Ruiz",
        cargo: "Gerente de Operaciones",
        email: "cruiz@techfuture.cl",
        numTrabajadores: "51+", // Grande
        categoriaRiesgo: "otro",
        rubro: "",
        usoEPP: "no",
        trabajoRemoto: "si",
        comiteParitario: "si",
        jornadaGeneral: "44 horas",
        controlAsistencia: "digital",
        mutualidad: "IST",
        prohibiciones: [],
        tipoProcedimiento: "general",
        procedimientoDisciplinario: "general",
        giro: "Desarrollo de Software",
        rutRepresentante: "33.333.333-3"
    },
];

const OUTPUT_DIR = path.resolve(process.cwd(), "test-output");

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
    console.log("🚀 Generando documentos LOCALMENTE (bypass server)...");

    for (const data of testCases) {
        let label = "";
        let filename = "";

        if (data.numTrabajadores === "10-25") {
            label = "Servicios · 10-25 trabajadores";
            filename = "test_servicios_10-25.docx";
        } else if (data.numTrabajadores === "26-50") {
            label = "Construcción · 26-50 trabajadores";
            filename = "test_construccion_26-50.docx";
        } else {
            label = "Tecnología · 51+ con teletrabajo y comité";
            filename = "test_51plus_teletrabajo.docx";
        }

        console.log(`\n🔄  Generando: ${label}`);
        const sections = buildReglamento(data);
        const doc = sectionsToDocx(sections, data);
        const buffer = await Packer.toBuffer(doc);

        const filePath = path.join(OUTPUT_DIR, filename);
        fs.writeFileSync(filePath, buffer);

        const sizeKb = (buffer.byteLength / 1024).toFixed(1);
        console.log(`   ✅  Guardado: ${filePath}  (${sizeKb} KB)`);
    }

    console.log("\n✨  Pruebas completadas.");
}

run().catch((err) => {
    console.error("Error:", err);
    process.exit(1);
});
