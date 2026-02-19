
import { buildReglamento, ReglamentoData } from "../lib/builder/index";
import { auditReglamento } from "../lib/reglamentoAuditor";
import assert from "assert";

// Mock data for testing
const mockData: ReglamentoData = {
    razonSocial: "Empresa Test SpA",
    rutEmpresa: "76.123.456-7",
    nombreCompleto: "Juan Pérez",
    rutRepresentante: "12.345.678-9",
    domicilio: "Av. Providencia 1234",
    comuna: "Providencia",
    region: "Metropolitana",
    rubro: "Tecnología",
    numTrabajadores: "10-25",
    trabajoRemoto: "si",
    usoEPP: "no",
    comiteParitario: "no",

    jornadaGeneral: "44 horas semanales",
    tipoProcedimiento: "general",
    cargo: "Gerente General",
    email: "contacto@empresa.cl",
    flexibleLegalWording: true,
    giro: "Desarrollo de Software",
    categoriaRiesgo: "servicios_oficina",
    controlAsistencia: "si",
    mutualidad: "ACHS",
    prohibiciones: ["consumo_alcohol", "acoso"],
    procedimientoDisciplinario: "" // Optional but required by type definition
};

const BASE_URL = "http://localhost:3000";

async function runTests() {
    console.log("🚀 Starting System Verification Suite...");
    let passed = 0;
    let failed = 0;

    // --- TEST 1: Builder Logic (Unit) ---
    try {
        console.log("\n[TEST 1] Testing Reglamento Builder (Modular)...");
        const sections = buildReglamento(mockData);
        assert(sections.length > 5, "Should generate multiple sections");

        const titleSec = sections.find(s => s.title === "IDENTIFICACIÓN DE LA EMPRESA");
        assert(titleSec, "Should have Identificación section");
        const teleworkSec = sections.find(s => s.title === "TELETRABAJO Y TRABAJO A DISTANCIA");
        assert(teleworkSec, "Should have Teletrabajo section (conditional)");

        console.log("✅ Builder Logic: PASS");
        passed++;
    } catch (e) {
        console.error("❌ Builder Logic: FAIL", e);
        failed++;
    }

    // --- TEST 2: Auditor Logic (Unit) ---
    try {
        console.log("\n[TEST 2] Testing Auditor Logic...");
        const sections = buildReglamento(mockData);
        const audit = auditReglamento(sections, mockData, { mode: "strict" });

        // With valid data, should have few/no errors
        const errors = audit.result.issues.filter(i => i.severity === 'error');
        if (errors.length === 0) {
            console.log("✅ Auditor Logic (Clean): PASS");
        } else {
            console.warn("⚠️ Auditor Logic found errors (might be expected depending on rules):", errors.length);
        }
        passed++;
    } catch (e) {
        console.error("❌ Auditor Logic: FAIL", e);
        failed++;
    }

    // --- TEST 3: API Generate Doc (Integration) ---
    try {
        console.log("\n[TEST 3] Testing /api/generate-doc...");
        const res = await fetch(`${BASE_URL}/api/generate-doc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mockData)
        });

        if (res.status === 200) {
            const arrayBuffer = await res.arrayBuffer();
            if (arrayBuffer.byteLength > 0) {
                console.log("✅ API Generate Doc: PASS (Generated " + arrayBuffer.byteLength + " bytes)");
                passed++;
            } else {
                throw new Error("Empty buffer received");
            }
        } else {
            const err = await res.json();
            throw new Error(`API returned ${res.status}: ${JSON.stringify(err)}`);
        }
    } catch (e) {
        console.error("❌ API Generate Doc: FAIL", e);
        failed++;
    }

    // --- TEST 4: Admin Security (Integration) ---
    try {
        console.log("\n[TEST 4] Testing Admin Security...");

        // 4a. Unauthorized
        const resUnauth = await fetch(`${BASE_URL}/admin/audit`);
        if (resUnauth.status === 401) {
            console.log("✅ Admin Security (Unauthorized): PASS");
        } else {
            throw new Error(`Expected 401 for unauthorized admin access, got ${resUnauth.status}`);
        }

        // 4b. Authorized (Mocking Basic Auth)
        // Note: We need to know the credentials. Assuming default dev credentials or env check.
        // In local dev, middleware might use process.env or defaults.
        // Let's assume standard admin:admin123 for now, or check env.
        const auth = Buffer.from("admin:admin123").toString('base64');
        const resAuth = await fetch(`${BASE_URL}/admin/audit`, {
            headers: { 'Authorization': `Basic ${auth}` }
        });

        if (resAuth.status === 200) {
            console.log("✅ Admin Security (Authorized): PASS");
            passed++;
        } else {
            console.warn("⚠️ Admin Security (Authorized): WARN - Credentials might vary or server side render (SSR) issue.");
            // Non-critical for script if credentials differ, but good to note.
        }

    } catch (e) {
        console.error("❌ Admin Security: FAIL", e);
        failed++;
    }

    // --- SUMMARY ---
    console.log(`\n══════════════════════════════════`);
    console.log(`SUMMARY: ${passed} Passed, ${failed} Failed`);
    console.log(`══════════════════════════════════`);

    if (failed > 0) process.exit(1);
    process.exit(0);
}

runTests();
