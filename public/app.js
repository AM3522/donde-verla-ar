const API = window.API_URL || '';
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const peso = (n) => n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const idioma = (l) => ({ es: 'Español', en: 'Inglés', pt: 'Portugués' })[l] || l;
const lista = new Set();
const estado = (mensaje = '') => { $('#estado').textContent = mensaje; };

async function api(ruta, opciones) {
  const r = await fetch(API + ruta, opciones);
  const datos = await r.json();
  if (!r.ok) throw new Error(datos.error || 'Error inesperado');
  return datos;
}
const filtros = () => new URLSearchParams(new FormData($('#filtros')));

const filaOpcion = (o) => `<tr><th scope="row">${esc(o.nombre)}</th><td>${o.audio.map(idioma).join(', ')}</td><td>${o.subtitulos.map(idioma).join(', ')}</td><td>${esc(o.plan.nombre)}</td><td class="precio">${peso(o.plan.precioFinal)}<small> /mes</small></td></tr>`;

function ficha(t) {
  const tabla = t.opciones.length
    ? `<div class="tabla"><table><thead><tr><th>Plataforma</th><th>Audio</th><th>Subtítulos</th><th>Plan más barato</th><th>Precio</th></tr></thead><tbody>${t.opciones.map(filaOpcion).join('')}</tbody></table></div>`
    : '<p class="vacio">No está disponible hoy en Argentina con estos filtros.</p>';
  return `<article class="ficha"><h2>${esc(t.titulo)}</h2><p class="meta">${esc(t.tipo)}, ${t.anio}</p><p>${esc(t.resumen)}</p>${tabla}<label><input type="checkbox" data-id="${esc(t.id)}" ${lista.has(t.id) ? 'checked' : ''}> Agregar a mi lista</label></article>`;
}

async function cargarFichas() {
  try {
    const datos = await api(`/api/titulos?${filtros()}`);
    $('#fichas').innerHTML = datos.length ? datos.map(ficha).join('') : '<p class="vacio">No hay títulos con esos filtros. Probá quitar alguno.</p>';
    estado();
  } catch (e) { estado(e.message); }
}

async function cargarPlanes() {
  const ps = await api('/api/plataformas');
  $('#plataforma').insertAdjacentHTML('beforeend', ps.map((p) => `<option value="${esc(p.id)}">${esc(p.nombre)}</option>`).join(''));
  const filas = ps.flatMap((p) => p.planes.map((pl) => `<tr><th scope="row">${esc(p.nombre)}</th><td>${esc(pl.nombre)}${pl.anuncios ? ' (con anuncios)' : ''}</td><td>${peso(pl.base)}</td><td class="precio">${peso(pl.precioFinal)}</td></tr>`));
  $('#tabla-planes').innerHTML = `<div class="tabla"><table><thead><tr><th>Plataforma</th><th>Plan</th><th>Precio base</th><th>Precio final</th></tr></thead><tbody>${filas.join('')}</tbody></table></div>`;
}

$('#filtros').addEventListener('input', cargarFichas);
$('#filtros').addEventListener('submit', (e) => e.preventDefault());
cargarPlanes().then(cargarFichas).catch((e) => estado(e.message));
