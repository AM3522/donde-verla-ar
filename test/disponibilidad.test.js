import test from 'node:test';
import assert from 'node:assert/strict';
import { vigente, cumpleIdioma, planMasBarato, opciones } from '../src/reglas.js';

const imp = { iva: 0, percepcionGanancias: 0 };
const hoy = new Date('2026-11-20T12:00:00');
const A = { id: 'a', nombre: 'A', planes: [{ nombre: 'Con anuncios', base: 100, anuncios: true }, { nombre: 'Sin anuncios', base: 150, anuncios: false }] };
const B = { id: 'b', nombre: 'B', planes: [{ nombre: 'Único', base: 120, anuncios: false }] };

test('RN1: sin fecha "hasta" está vigente', () => assert.equal(vigente({}, hoy), true));
test('RN1: "hasta" de hoy sigue vigente', () => assert.equal(vigente({ hasta: '2026-11-20' }, hoy), true));
test('RN1: "hasta" de ayer ya no está vigente', () => assert.equal(vigente({ hasta: '2026-11-19' }, hoy), false));
test('RN4: el idioma puede estar en audio o subtítulos', () => {
  const d = { audio: ['es'], subtitulos: ['en'] };
  assert.ok(cumpleIdioma(d, 'es'));
  assert.ok(cumpleIdioma(d, 'en'));
  assert.ok(!cumpleIdioma(d, 'pt'));
  assert.ok(cumpleIdioma(d));
});
test('RN3: elige el plan más barato', () => assert.equal(planMasBarato(A, imp).nombre, 'Con anuncios'));
test('RN3: con "sin anuncios" elige el más barato sin anuncios', () => assert.equal(planMasBarato(A, imp, { sinAnuncios: true }).nombre, 'Sin anuncios'));
test('RN3: si ningún plan cumple devuelve null', () => assert.equal(planMasBarato({ planes: [A.planes[0]] }, imp, { sinAnuncios: true }), null));
test('opciones: ordena por precio, descarta vencidas y filtra idioma', () => {
  const t = { disponible: [
    { plataforma: 'a', audio: ['es'], subtitulos: [] },
    { plataforma: 'b', audio: ['es'], subtitulos: ['en'] },
    { plataforma: 'c', hasta: '2026-01-01', audio: ['es'], subtitulos: [] } ] };
  assert.deepEqual(opciones(t, [A, B], imp, {}, hoy).map((o) => o.plataforma), ['a', 'b']);
  assert.deepEqual(opciones(t, [A, B], imp, { idioma: 'en' }, hoy).map((o) => o.plataforma), ['b']);
});
