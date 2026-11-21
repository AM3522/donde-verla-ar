// Reglas de negocio puras (RN1-RN6). No leen archivos ni red: reciben los datos por parámetro.

// RN2: precio final con IVA y percepción de Ganancias, redondeado al peso.
export const precioFinal = (base, imp) => Math.round(base * (1 + imp.iva + imp.percepcionGanancias));
