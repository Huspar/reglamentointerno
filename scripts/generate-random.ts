
import { Packer, Document, Paragraph, TextRun, AlignmentType } from "docx";
import * as fs from "fs";
import * as path from "path";
import { buildReglamento, ReglamentoData, ReglamentoSection, ContentItem } from "../lib/builder";
import { auditReglamento } from "../lib/reglamentoAuditor";
import { logAuditEvent, AuditTelemetryEvent } from "../lib/telemetry";
import { v4 as uuidv4 } from 'uuid';

// ─────────────────────────────────────────────────────────────
// 1. HELPERS & DATA POOLS
// ─────────────────────────────────────────────────────────────

const RAN = {
    pick: <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)],
    bool: (): boolean => Math.random() > 0.5,
    rut: (): string => `${Math.floor(Math.random() * 50) + 10}.${Math.floor(Math.random() * 900) + 100}.${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9)}`,
};

const DATA_POOLS = {
    razonesSociales: [
        "Inversiones Alfa Ltda.", "Constructora Beta SpA", "Importadora Gamma S.A.",
        "Servicios Delta E-I-R-L", "Tecnologías Epsilon Spa", "Comercial Zeta Ltda."
    ],
    giros: [
        "Venta de artículos de librería", "Desarrollo de software y consultoría",
        "Construcción de obras civiles", "Elaboración de alimentos procesados",
        "Transporte de carga por carretera", "Servicios de limpieza industrial"
    ],
    comunas: ["Santiago", "Providencia", "Las Condes", "Maipú", "La Florida", "Ñuñoa", "Antofagasta", "Concepción"],
    regiones: ["Metropolitana", "Antofagasta", "Biobío", "Valparaíso"],
    categorias: ["servicios_oficina", "construccion", "industrial", "comercio", "otro"],
    tams: ["1-9", "10-25", "26-50", "51+", "100+"],
    cargos: ["Gerente General", "Representante Legal", "Administrador", "Socio Director"],
    nombres: ["Juan Pérez", "María González", "Carlos Ruiz", "Ana López", "Pedro Tapia"],
    mutualidades: ["ACHS", "Mutual de Seguridad", "IST", "ISL"],
    sistemasAsistencia: ["reloj", "digital", "libro", "huella"],
};

function generateRandomData(): ReglamentoData {
    const cat = RAN.pick(DATA_POOLS.categorias);
    // Logic link: if construction, likely needs EPP. If office, maybe no EPP.
    const needsEPP = ["construccion", "industrial"].includes(cat) ? "si" : RAN.bool() ? "si" : "no";

    return {
        razonSocial: RAN.pick(DATA_POOLS.razonesSociales),
        rutEmpresa: RAN.rut(),
        giro: RAN.pick(DATA_POOLS.giros),
        domicilio: `Calle ${RAN.pick(["Principal", "Secundaria", "Los Alerces", "El Roble"])} #${Math.floor(Math.random() * 1000)}`,
        comuna: RAN.pick(DATA_POOLS.comunas),
        region: RAN.pick(DATA_POOLS.regiones),
        nombreCompleto: RAN.pick(DATA_POOLS.nombres),
        rutRepresentante: RAN.rut(),
        cargo: RAN.pick(DATA_POOLS.cargos),
        email: "contacto@empresa-demo.cl",
        numTrabajadores: RAN.pick(DATA_POOLS.tams),
        categoriaRiesgo: cat,
        rubro: "", // Deprecado
        jornadaGeneral: RAN.bool() ? "44 horas" : "40 horas",
        trabajoRemoto: RAN.bool() ? "si" : "no",
        controlAsistencia: RAN.pick(DATA_POOLS.sistemasAsistencia),
        usoEPP: needsEPP,
        comiteParitario: RAN.bool() ? "si" : "no",
        mutualidad: RAN.pick(DATA_POOLS.mutualidades),
        prohibiciones: ["consumo_alcohol", "acoso", "violencia"].filter(() => Math.random() > 0.3), // Random subset
        tipoProcedimiento: "general",
        procedimientoDisciplinario: "general"
    };
}

// Reuse logic from API to convert sections to DOCX structure
// (Simplified version of sectionsToDocx logic needed here or imported? 
// The imported one might be tied to 'docx' internal types. 
// Standard pattern: import `sectionsToDocx` from route or lib? 
// `sectionsToDocx` is in `generate-local.ts` manually implemented, or exported from a lib? 
// Checking `reglamentoBuilder.ts` exports... it only exports `buildReglamento`.
// `route.ts` has `sectionsToDocx` but it's not exported.
// `generate-local.ts` COPIED `sectionsToDocx`. I should probably duplicate it here to avoid refactoring heavily right now.)

// ... Wait, `generate-local.ts` had a local implementation of `sectionsToDocx`. 
// I will copy that helper here for autonomy.

function sectionsToDocx(sections: ReglamentoSection[], data: ReglamentoData): Document {
    return new Document({
        sections: [{
            properties: {},
            children: sections.flatMap(sec => [
                new Paragraph({
                    text: sec.title.toUpperCase(),
                    heading: "Heading1",
                    spacing: { before: 400, after: 200 }
                }),
                ...sec.content.map(item => {
                    if (item.type === "article") {
                        return new Paragraph({
                            text: item.text,
                            alignment: AlignmentType.JUSTIFIED,
                            spacing: { after: 200 }
                        });
                    }
                    return new Paragraph({
                        text: item.text,
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 } // Plain text
                    });
                })
            ])
        }]
    });
}

// ─────────────────────────────────────────────────────────────
// 2. MAIN EXECUTION
// ─────────────────────────────────────────────────────────────

async function main() {
    console.log("🎲 GENERANDO 3 REGLAMENTOS ALEATORIOS...\n");
    const outDir = path.join(process.cwd(), "test-output");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    for (let i = 1; i <= 3; i++) {
        const data = generateRandomData();
        console.log(`\n📋 [${i}/3] Generando para: ${data.razonSocial} (${data.categoriaRiesgo})`);

        /* ─── API SIMULATION (AUTOFIX LOOP) ─── */
        console.log(`\n🔹 Simulating API Process for: ${data.razonSocial}`);

        // PASS 1
        let sections = buildReglamento(data);
        let audit = auditReglamento(sections, data, { mode: "strict", enableAutofix: true });

        const rigidIssues = audit.result.issues.filter(i =>
            i.code === "ARTICULO_9_RIGIDO" ||
            i.code === "PROHIBITED_STRING" ||
            i.code === "REFERENCIA_AUTORIDAD_RIGIDA"
        );

        if (rigidIssues.length > 0) {
            console.log(`   🔸 Detected ${rigidIssues.length} rigid issues. APPLYING AUTOFIX...`);
            // @ts-ignore - flexibleLegalWording is added dynamically for this simulation
            data.flexibleLegalWording = true;

            // PASS 2
            sections = buildReglamento(data);
            audit = auditReglamento(sections, data, { mode: "strict", enableAutofix: true });
        }

        const blockingErrors = audit.result.issues.filter(i => i.severity === "error");
        const warnings = audit.result.issues.filter(i => i.severity === "warn");

        if (blockingErrors.length > 0) {
            console.log(`   ❌ BLOCKED (422): ${blockingErrors.length} Errors remain.`);
            console.log(`      Codes: ${blockingErrors.map(e => e.code).join(", ")}`);
        } else if (warnings.length > 0) {
            console.log(`   ⚠️ WARNINGS (422): ${warnings.length} Warnings remain (Panel shown).`);
            console.log(`      Codes: ${warnings.map(w => w.code).join(", ")}`);
        } else {
            console.log(`   ✅ SUCCESS (200): Document generated automatically! (Panel skipped)`);
        }

        const { fixedSections } = audit;

        // Log Telemetry (Simulation)
        logAuditEvent({
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            modelVariant: "unknown", // Simplified for script
            issues: audit.result.issues.map(i => ({ severity: i.severity, code: i.code })),
            autofixApplied: data.flexibleLegalWording === true,
            fixes: rigidIssues.map(i => ({ code: i.code, count: 1 }))
        });

        const doc = sectionsToDocx(fixedSections, data);

        // 3. Generate DOCX (always generate for this test unless empty)
        const buffer = await Packer.toBuffer(doc);

        const timestamp = new Date().getTime();
        const filename = `random_${i}_${data.categoriaRiesgo}.docx`;
        const filePath = path.join(outDir, filename);

        fs.writeFileSync(filePath, buffer);
        console.log(`   ✅ Guardado: ${filePath}`);
    }

    console.log("\n✨ Proceso finalizado.");
}

main().catch(console.error);
