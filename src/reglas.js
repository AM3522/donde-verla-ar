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

// RN5 y RN6: combinación de plataformas con mayor cobertura; ante empate, menor costo; luego, menos plataformas.
// Prueba todos los subconjuntos (con 5 plataformas son solo 31).
export function combinacionMasBarata(titulos, plataformas, imp, filtros = {}, hoy = new Date()) {
  if (!titulos.length) throw new RangeError('La lista está vacía'); // RN6
  const ofertas = titulos.map((t) => new Set(opciones(t, plataformas, imp, filtros, hoy).map((o) => o.plataforma)));
  const precios = Object.fromEntries(plataformas.map((p) => [p.id, planMasBarato(p, imp, filtros)?.precioFinal]));
  const ids = plataformas.map((p) => p.id).filter((id) => precios[id] !== undefined);
  let mejor = { plataformas: [], costo: 0, cubiertos: titulos.map(() => false) };
  const cobertura = (c) => c.cubiertos.filter(Boolean).length;
  for (let mascara = 1; mascara < 1 << ids.length; mascara++) {
    const elegidas = ids.filter((_, i) => mascara & (1 << i));
    const cand = {
      plataformas: elegidas,
      costo: elegidas.reduce((suma, id) => suma + precios[id], 0),
      cubiertos: ofertas.map((o) => elegidas.some((id) => o.has(id))),
    };
    const gana = cobertura(cand) !== cobertura(mejor) ? cobertura(cand) > cobertura(mejor)
      : cand.costo !== mejor.costo ? cand.costo < mejor.costo
      : cand.plataformas.length < mejor.plataformas.length;
    if (gana) mejor = cand;
  }
  return {
    plataformas: mejor.plataformas,
    costoMensual: mejor.costo,
    cubiertos: titulos.filter((_, i) => mejor.cubiertos[i]).map((t) => t.id),
    sinOferta: titulos.filter((_, i) => !mejor.cubiertos[i]).map((t) => t.id),
  };
}
