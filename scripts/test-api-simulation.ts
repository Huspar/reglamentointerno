
import { ReglamentoData } from "../lib/reglamentoBuilder";

const mockData: ReglamentoData = {
    razonSocial: "Test Corp AutoFix",
    rutEmpresa: "76.123.456-7",
    giro: "Desarrollo de Software",
    domicilio: "Av. Test 123",
    comuna: "Santiago",
    region: "Metropolitana",
    nombreCompleto: "Juan Pérez",
    rutRepresentante: "12.345.678-9",
    cargo: "Gerente",
    email: "contacto@test.com",
    numTrabajadores: "10-25",
    rubro: "servicios",
    categoriaRiesgo: "servicios",
    jornadaGeneral: "45 horas semanales",
    trabajoRemoto: "no",
    controlAsistencia: "no",
    usoEPP: "no",
    comiteParitario: "no",
    mutualidad: "ACHS",
    prohibiciones: [],
    tipoProcedimiento: "escalonado",
    procedimientoDisciplinario: "",
};

async function testApi() {
    console.log("🔥 TEST: API AUTOFIX LOOP VERIFICATION");

    // We can't easily fetch localhost without running the server, 
    // but the server IS running (based on metadata).
    // Let's try to hit it using fetch if node version supports it, 
    // or we can simulate the handler logic if we export it (we don't).

    // Instead of hitting the network (which might be flaky from here), 
    // let's create a unit test that imports the route handler logic? 
    // No, Next.js route handlers are hard to unit test directly without mocking Request.

    // Let's use the PREVIOUS method: `scripts/test-autofix.ts` but updated to simulate the LOOP.
    // This confirms the LOGIC is correct, even if we don't hit the HTTP layer.

    const { buildReglamento } = await import("../lib/reglamentoBuilder");
    const { auditReglamento } = await import("../lib/reglamentoAuditor");

    console.log("\n👉 SIMULATION: Server-Side Logic");

    // PASS 1
    let data = { ...mockData };
    let sections = buildReglamento(data);
    let audit = auditReglamento(sections, data, { mode: "strict", enableAutofix: true });

    console.log(`   Pass 1 Issues: ${audit.result.issues.length}`);
    const rigidIssues = audit.result.issues.filter(i =>
        i.code === "ARTICULO_9_RIGIDO" ||
        i.code === "PROHIBITED_STRING"
    );

    if (rigidIssues.length > 0) {
        console.log(`   ✅ Detected ${rigidIssues.length} rigid issues. Triggering Autofix...`);
        data.flexibleLegalWording = true;

        // PASS 2
        sections = buildReglamento(data);
        audit = auditReglamento(sections, data, { mode: "strict", enableAutofix: true });
        console.log(`   Pass 2 Issues: ${audit.result.issues.length}`);
    } else {
        console.log("   ❌ Failed to detect rigid issues in Pass 1.");
    }

    const finalErrors = audit.result.issues.filter(i => i.severity === 'error');

    // NOTE: In our previous step recalculation, rigid issues are WARN (or ERROR depending on config).
    // But auditReglamento might return them as WARN now.
    // The API blocks on WARN too unless ignored or fixed.
    // If Pass 2 has 0 warnings, then API returns 200.

    if (audit.result.issues.length === 0) {
        console.log("   ✅ SUCCESS: Pass 2 is clean. API would return 200 OK.");
    } else {
        console.log("   ⚠️ PARTIAL: Pass 2 still has issues:", audit.result.issues.map(i => i.code));
        // If issues are just INFO, it's fine.
    }
}

testApi();
