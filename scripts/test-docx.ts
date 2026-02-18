/**
 * Test script: generates 3 DOCX documents via the API
 * to verify rubro adaptation, null-safety, and varied content.
 *
 * Run: npx tsx scripts/test-docx.ts
 * (while dev server is running on localhost:3000)
 */
import fs from "fs";
import path from "path";

const API = "http://localhost:3000/api/generate-doc";

interface TestCase {
    filename: string;
    label: string;
    payload: Record<string, unknown>;
}

const tests: TestCase[] = [
    {
        filename: "test_servicios_10-25.docx",
        label: "Servicios · 10-25 trabajadores",
        payload: {
            razonSocial: "Consultores del Sur SpA",
            rutEmpresa: "77.123.456-7",
            giro: "Consultoría en gestión empresarial",
            domicilio: "Av. Providencia 1234, Of. 501",
            comuna: "Providencia",
            region: "Región Metropolitana",
            nombreCompleto: "María Fernanda López Guzmán",
            rutRepresentante: "12.345.678-9",
            cargo: "Gerente General",
            email: "contacto@consultoresdelsur.cl",
            numTrabajadores: "10-25",
            rubro: "servicios",
            jornadaGeneral: "lunes a viernes, de 09:00 a 18:00 horas",
            trabajoRemoto: "no",
            controlAsistencia: "si",
            usoEPP: "no",
            comiteParitario: "no",
            mutualidad: "ACHS",
            prohibiciones: [
                "consumo_alcohol",
                "acoso",
                "filtracion_info",
                "correo_fines_personales",
            ],
            tipoProcedimiento: "escalonado",
            procedimientoDisciplinario: "",
        },
    },
    {
        filename: "test_construccion_26-50.docx",
        label: "Construcción · 26-50 trabajadores",
        payload: {
            razonSocial: "Constructora Altos del Valle Ltda.",
            rutEmpresa: "76.987.654-3",
            giro: "Construcción de obras civiles y edificación",
            domicilio: "Camino El Alba 3050",
            comuna: "Las Condes",
            region: "Región Metropolitana",
            nombreCompleto: "Carlos Andrés Muñoz Sepúlveda",
            rutRepresentante: "10.111.222-3",
            cargo: "Representante Legal",
            email: "",
            numTrabajadores: "26-50",
            rubro: "construccion",
            jornadaGeneral: "lunes a viernes, de 08:00 a 17:30 horas",
            trabajoRemoto: "no",
            controlAsistencia: "si",
            usoEPP: "si",
            comiteParitario: "no",
            mutualidad: "Mutual de Seguridad",
            prohibiciones: [
                "consumo_alcohol",
                "consumo_drogas",
                "violencia",
                "no_uso_epp",
                "manipulacion_maquinaria",
                "incumplimiento_protocolos",
                "ingreso_no_autorizado",
            ],
            tipoProcedimiento: "segun_gravedad",
            procedimientoDisciplinario: "",
        },
    },
    {
        filename: "test_51plus_teletrabajo.docx",
        label: "Tecnología · 51+ con teletrabajo y comité",
        payload: {
            razonSocial: "NovaTech Solutions S.A.",
            rutEmpresa: "96.555.000-K",
            giro: "Desarrollo de software y servicios tecnológicos",
            domicilio: "Av. Apoquindo 6410, Piso 12",
            comuna: "Las Condes",
            region: "Región Metropolitana",
            nombreCompleto: "Javiera Paz Herrera Contreras",
            rutRepresentante: "15.678.901-2",
            cargo: "Directora Ejecutiva",
            email: "rrhh@novatech.cl",
            numTrabajadores: "51+",
            rubro: "servicios",
            jornadaGeneral: "lunes a viernes, de 09:00 a 18:00 horas, con flexibilidad horaria",
            trabajoRemoto: "si",
            controlAsistencia: "si",
            usoEPP: "no",
            comiteParitario: "si",
            mutualidad: "IST",
            prohibiciones: [
                "acoso",
                "discriminacion",
                "filtracion_info",
                "uso_indebido_equipos",
                "software_no_autorizado",
                "correo_fines_personales",
            ],
            tipoProcedimiento: "escalonado",
            procedimientoDisciplinario: "",
        },
    },
];

async function runTests() {
    const outDir = path.resolve(__dirname, "../test-output");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    for (const t of tests) {
        console.log(`\n🔄  Generando: ${t.label}`);
        try {
            const res = await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(t.payload),
            });
            if (!res.ok) {
                const err = await res.text();
                console.error(`   ❌  Error ${res.status}: ${err}`);
                continue;
            }
            const buf = Buffer.from(await res.arrayBuffer());
            const filePath = path.join(outDir, t.filename);
            fs.writeFileSync(filePath, buf);
            console.log(`   ✅  Guardado: ${filePath}  (${(buf.length / 1024).toFixed(1)} KB)`);
        } catch (e: unknown) {
            console.error(`   ❌  Fetch error:`, (e as Error).message);
        }
    }
    console.log("\n✨  Pruebas completadas.\n");
}

runTests();
