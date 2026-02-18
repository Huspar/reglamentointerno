import { z } from "zod";
import { validarRUT } from "@/utils/rut";

/* ───── Paso 1: Empresa ───── */
export const empresaSchema = z.object({
    razonSocial: z.string().min(1, "La razón social es obligatoria"),
    rutEmpresa: z
        .string()
        .min(1, "El RUT es obligatorio")
        .refine(validarRUT, "El RUT ingresado no es válido"),
    giro: z.string().min(1, "El giro es obligatorio"),
    domicilio: z.string(),
    comuna: z.string(),
    region: z.string(),
});

/* ───── Paso 2: Representante Legal ───── */
export const representanteSchema = z.object({
    nombreCompleto: z.string().min(1, "El nombre es obligatorio"),
    rutRepresentante: z
        .string()
        .min(1, "El RUT es obligatorio")
        .refine(validarRUT, "El RUT ingresado no es válido"),
    cargo: z.string().min(1, "El cargo es obligatorio"),
    email: z
        .string()
        .min(1, "El email es obligatorio")
        .email("Ingresa un email válido"),
});

/* ───── Paso 3: Tamaño ───── */
export const tamanoSchema = z.object({
    numTrabajadores: z.string().min(1, "Selecciona una opción"),
    rubro: z.string().min(1, "Selecciona un rubro"),
});

/* ───── Paso 4: Jornada ───── */
export const jornadaSchema = z.object({
    jornadaGeneral: z.string().min(1, "Describe la jornada general"),
    trabajoRemoto: z.enum(["si", "no"], "Selecciona una opción"),
    controlAsistencia: z.enum(["si", "no"], "Selecciona una opción"),
});

/* ───── Paso 5: Higiene y Seguridad ───── */
export const higieneSchema = z.object({
    usoEPP: z.enum(["si", "no"], "Selecciona una opción"),
    comiteParitario: z.enum(["si", "no"], "Selecciona una opción"),
    mutualidad: z.string(),
});

/* ───── Paso 6: Normas Internas ───── */
export const normasSchema = z.object({
    prohibiciones: z
        .array(z.string())
        .min(1, "Selecciona al menos una prohibición"),
    tipoProcedimiento: z.string().min(1, "Selecciona un tipo de procedimiento"),
    procedimientoDisciplinario: z.string(),
});

/* ───── Schema combinado ───── */
export const wizardSchema = z.object({
    ...empresaSchema.shape,
    ...representanteSchema.shape,
    ...tamanoSchema.shape,
    ...jornadaSchema.shape,
    ...higieneSchema.shape,
    ...normasSchema.shape,
});

export type WizardData = z.infer<typeof wizardSchema>;

/* ───── Schemas por paso (para validación parcial) ───── */
export const stepSchemas = [
    empresaSchema,
    representanteSchema,
    tamanoSchema,
    jornadaSchema,
    higieneSchema,
    normasSchema,
    z.object({}), // Paso 7 (confirmación, sin validación extra)
] as const;
