
import { buildReglamento, ReglamentoData } from "../lib/reglamentoBuilder";
import { auditReglamento } from "../lib/reglamentoAuditor";

const mockData: ReglamentoData = {
    razonSocial: "Test Corp",
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
    rubro: "servicios", // Deprecated but needed for type? No, allowed empty string if legacy
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

console.log("🔥 TEST: AUTOFIX LOGIC VERIFICATION\n");

// CASE 1: Default (Rigid)
console.log("👉 CASE 1: flexibleLegalWording = undefined (Default)");
const sections1 = buildReglamento(mockData);
const audit1 = auditReglamento(sections1, mockData, { mode: "strict" });

const rigidIssue1 = audit1.result.issues.find(i => i.code === "ARTICULO_9_RIGIDO");
if (rigidIssue1) {
    console.log("   ✅ Detected Rigid Issue as expected.");
} else {
    console.log("   ❌ FAILED: Did not detect rigid issue.");
}

// CASE 2: Autofix Applied (Flexible)
console.log("\n👉 CASE 2: flexibleLegalWording = true (Autofixed)");
const dataFixed = { ...mockData, flexibleLegalWording: true };
const sections2 = buildReglamento(dataFixed);
const audit2 = auditReglamento(sections2, dataFixed, { mode: "strict" });

const rigidIssue2 = audit2.result.issues.find(i => i.code === "ARTICULO_9_RIGIDO");
const prohibited2 = audit2.result.issues.find(i => i.code === "PROHIBITED_STRING");

if (!rigidIssue2 && !prohibited2) {
    console.log("   ✅ SUCCESS: No rigid/prohibited issues found.");
    // Verify text content
    const textCombined = JSON.stringify(sections2);
    if (textCombined.includes("autoridad administrativa competente")) {
        console.log("   ✅ Text replacement verified.");
    } else {
        console.log("   ❌ Text replacement NOT found.");
    }
} else {
    console.log("   ❌ FAILED: Issues still present:", rigidIssue2, prohibited2);
}
