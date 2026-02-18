
import { auditReglamento } from "../lib/reglamentoAuditor";

console.log("🔥 INICIANDO SMOKE TEST DEL AUDITOR 🔥\n");

// 1. Crear data mock con problemas intencionales
const mockSections = [
    {
        title: "CAPÍTULO 1",
        content: [
            { type: "article", text: "Este es un artículo normal." },
            { type: "article", text: "La empresa podrá hacer A. La empresa podrá hacer B. La empresa podrá hacer C." }, // Repetición interna? No, start repetition
        ]
    },
    {
        title: "CAPÍTULO 2 (CON PLACEHOLDERS)",
        content: [
            { type: "article", text: "El rubro de la empresa es no especificado y su giro es Otro." }, // Errors
            { type: "article", text: "Ministerio de Salud exige esto." }, // Warn/Error
        ]
    },
    {
        title: "CAPÍTULO 3 (REPETITIVO)",
        content: Array(8).fill({ type: "article", text: "La empresa podrá establecer normas adicionales." })
    },
    {
        title: "CAPÍTULO 4 (JORNADA CONTRADICTORIA)",
        content: [
            { type: "article", text: "La jornada ordinaria de trabajo será de 45 horas semanales." },
            { type: "article", text: "La jornada no podrá exceder de 40 horas semanales." }
        ]
    },
    {
        title: "CAPÍTULO VACÍO",
        content: [] // Error
    }
];

// Mock data basic
const mockData: any = {
    categoriaRiesgo: "construccion",
    giro: "Venta de helados", // Incoherente!
    email: "test@random.com" // Placeholder!
};

// 2. Ejecutar auditor
console.log("--> Ejecutando auditReglamento()...");
const { result, fixedSections } = auditReglamento(mockSections, mockData, {
    mode: "strict",
    enableAutofix: true
});

// 3. Imprimir Resultados
console.log("\n📊 ESTADÍSTICAS:");
console.log(JSON.stringify(result.stats, null, 2));

console.log("\n🚨 ISSUES ENCONTRADOS:");
result.issues.forEach((issue) => {
    const icon = issue.severity === "error" ? "❌" : "⚠️";
    console.log(`${icon} [${issue.severity.toUpperCase()}] ${issue.message}`);
    if (issue.snippet) console.log(`   Snippet: "${issue.snippet}"`);
});

// 4. Verificar Autofix
console.log("\n🛠️ VERIFICANDO AUTOFIX (Variación de 'La empresa podrá'):");
const cap3 = fixedSections.find(s => s.title === "CAPÍTULO 3 (REPETITIVO)");
if (cap3) {
    cap3.content.forEach((item: any, idx: number) => {
        console.log(`[${idx}] ${item.text}`);
    });
} else {
    console.log("No se encontró el capítulo 3 en fixedSections.");
}

console.log("\n✅ SMOKE TEST FINALIZADO.");
