import http from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { combinacionMasBarata, opciones, precioFinal } from './reglas.js';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const leer = (f) => JSON.parse(readFileSync(join(raiz, 'data', f), 'utf8'));
const { plataformas } = leer('plataformas.json');
const { titulos } = leer('titulos.json');
const impuestos = leer('impuestos.json');
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
const sinTildes = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const filtrosDe = (q) => ({ idioma: q.get('idioma') || undefined, sinAnuncios: q.get('sinAnuncios') === '1' });
const ficha = (t, f) => ({ ...t, disponible: undefined, opciones: opciones(t, plataformas, impuestos, f) });

function listar(q) {
  const f = filtrosDe(q);
  const texto = sinTildes(q.get('q') || '');
  return titulos
    .filter((t) => sinTildes(t.titulo).includes(texto) && (!q.get('tipo') || t.tipo === q.get('tipo')))
    .map((t) => ficha(t, f))
    .filter((t) => !q.get('plataforma') || t.opciones.some((o) => o.plataforma === q.get('plataforma')))
    .filter((t) => !(f.idioma || f.sinAnuncios) || t.opciones.length > 0);
}

async function leerCuerpo(req) {
  let texto = '';
  for await (const parte of req) texto += parte;
  try { return JSON.parse(texto || '{}'); } catch { return null; }
}

export const servidor = http.createServer(async (req, res) => {
  const json = (codigo, cuerpo) => { res.writeHead(codigo, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(cuerpo)); };
  // CORS: solo se acepta el origen del frontend si está configurado.
  if (process.env.FRONTEND_URL) {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  try {
    const url = new URL(req.url, 'http://localhost');
    const { pathname } = url;
    if (pathname === '/api/salud') return json(200, { ok: true });
    if (pathname === '/api/plataformas') {
      return json(200, plataformas.map((p) => ({ ...p, planes: p.planes.map((pl) => ({ ...pl, precioFinal: precioFinal(pl.base, impuestos) })) })));
    }
    if (pathname === '/api/titulos') return json(200, listar(url.searchParams));
    if (pathname.startsWith('/api/titulos/')) {
      const t = titulos.find((x) => x.id === pathname.split('/').pop());
      return t ? json(200, ficha(t, filtrosDe(url.searchParams))) : json(404, { error: 'No existe ese título' });
    }
    if (pathname === '/api/combinacion' && req.method === 'POST') {
      const { ids, idioma, sinAnuncios } = (await leerCuerpo(req)) ?? {};
      if (!Array.isArray(ids) || !ids.length) return json(400, { error: 'Elegí al menos un título para tu lista' }); // RN6
      const elegidos = ids.map((id) => titulos.find((t) => t.id === id));
      if (elegidos.includes(undefined)) return json(400, { error: 'La lista incluye un título que no existe' }); // RN6
      const r = combinacionMasBarata(elegidos, plataformas, impuestos, { idioma, sinAnuncios: Boolean(sinAnuncios) });
      return json(200, { ...r, sinOferta: r.sinOferta.map((id) => titulos.find((t) => t.id === id).titulo) });
    }
    if (pathname.startsWith('/api/')) return json(404, { error: 'Ruta inexistente' });
    const publico = join(raiz, 'public');
    const ruta = join(publico, normalize(pathname === '/' ? '/index.html' : pathname));
    if (!ruta.startsWith(publico) || !statSync(ruta, { throwIfNoEntry: false })?.isFile()) return json(404, { error: 'No encontrado' });
    res.writeHead(200, { 'Content-Type': MIME[extname(ruta)] || 'application/octet-stream' });
    res.end(readFileSync(ruta));
  } catch {
    json(500, { error: 'Error interno' });
  }
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const puerto = process.env.PORT || 3000;
  servidor.listen(puerto, () => console.log(`Escuchando en el puerto ${puerto}`));
}
