/**
 * Utilidad para validar y formatear RUT chileno.
 * Usa el algoritmo módulo 11.
 */

/**
 * Limpia un RUT de puntos y guiones.
 */
export function limpiarRUT(rut: string): string {
    return rut.replace(/[.\-\s]/g, "").toUpperCase();
}

/**
 * Formatea un RUT en formato XX.XXX.XXX-X
 */
export function formatearRUT(rut: string): string {
    const limpio = limpiarRUT(rut);
    if (limpio.length < 2) return limpio;

    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);

    let formatted = "";
    let count = 0;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        formatted = cuerpo[i] + formatted;
        count++;
        if (count === 3 && i > 0) {
            formatted = "." + formatted;
            count = 0;
        }
    }

    return `${formatted}-${dv}`;
}

/**
 * Calcula el dígito verificador de un RUT usando módulo 11.
 */
function calcularDV(cuerpo: number): string {
    let suma = 0;
    let multiplicador = 2;

    const cuerpoStr = cuerpo.toString();
    for (let i = cuerpoStr.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpoStr[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = 11 - (suma % 11);
    if (resto === 11) return "0";
    if (resto === 10) return "K";
    return resto.toString();
}

/**
 * Valida un RUT chileno (formato libre).
 * Retorna true si el RUT es válido.
 */
export function validarRUT(rut: string): boolean {
    const limpio = limpiarRUT(rut);

    if (limpio.length < 2) return false;

    const cuerpo = limpio.slice(0, -1);
    const dvIngresado = limpio.slice(-1);

    // Verificar que el cuerpo sea numérico
    if (!/^\d+$/.test(cuerpo)) return false;

    const cuerpoNum = parseInt(cuerpo, 10);
    if (cuerpoNum < 1000000) return false; // RUTs válidos tienen al menos 7 dígitos

    const dvCalculado = calcularDV(cuerpoNum);
    return dvIngresado === dvCalculado;
}
