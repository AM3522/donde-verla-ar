// Reglas de negocio puras (RN1-RN6). No leen archivos ni red: reciben los datos por parámetro.

// RN2: precio final con IVA y percepción de Ganancias, redondeado al peso.
export const precioFinal = (base, imp) => Math.round(base * (1 + imp.iva + imp.percepcionGanancias));

// RN1: disponible si no tiene fecha "hasta" o la fecha es hoy o posterior.
export const vigente = (disp, hoy = new Date()) => !disp.hasta || new Date(`${disp.hasta}T23:59:59`) >= hoy;

// RN4: el idioma pasa si está en el audio o en los subtítulos.
export const cumpleIdioma = (disp, idioma) => !idioma || disp.audio.includes(idioma) || disp.subtitulos.includes(idioma);

// RN3: plan más barato de una plataforma que cumple los filtros (null si ninguno).
export function planMasBarato(plataforma, imp, { sinAnuncios = false } = {}) {
  const planes = plataforma.planes.filter((p) => !(sinAnuncios && p.anuncios));
  if (!planes.length) return null;
  const plan = planes.reduce((a, b) => (a.base <= b.base ? a : b));
  return { ...plan, precioFinal: precioFinal(plan.base, imp) };
}

// Opciones para ver un título: una por plataforma vigente, de la más barata a la más cara.
export function opciones(titulo, plataformas, imp, filtros = {}, hoy = new Date()) {
  return titulo.disponible
    .filter((d) => vigente(d, hoy) && cumpleIdioma(d, filtros.idioma))
    .map((d) => {
      const plat = plataformas.find((p) => p.id === d.plataforma);
      const plan = plat && planMasBarato(plat, imp, filtros);
      return plan && { plataforma: plat.id, nombre: plat.nombre, audio: d.audio, subtitulos: d.subtitulos, plan };
    })
    .filter(Boolean)
    .sort((a, b) => a.plan.precioFinal - b.plan.precioFinal);
}
