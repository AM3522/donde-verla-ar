import test from 'node:test';
import assert from 'node:assert/strict';
import { combinacionMasBarata } from '../src/reglas.js';

const imp = { iva: 0, percepcionGanancias: 0 };
const plat = (id, base) => ({ id, nombre: id, planes: [{ nombre: 'Único', base, anuncios: false }] });
const tit = (id, ...plataformas) => ({ id, titulo: id, disponible: plataformas.map((p) => ({ plataforma: p, audio: ['es'], subtitulos: [] })) });
const P = [plat('a', 100), plat('b', 150), plat('c', 120)];

test('RN5: cubre todos los títulos con el menor costo', () => {
  const r = combinacionMasBarata([tit('t1', 'a'), tit('t2', 'b'), tit('t3', 'a', 'c')], P, imp);
  assert.deepEqual(r.plataformas, ['a', 'b']);
  assert.equal(r.costoMensual, 250);
  assert.deepEqual(r.sinOferta, []);
});
test('RN5: ante igual cobertura gana la más barata', () => {
  const r = combinacionMasBarata([tit('t1', 'b', 'c')], P, imp);
  assert.deepEqual(r.plataformas, ['c']);
  assert.equal(r.costoMensual, 120);
});
test('RN5: los títulos sin oferta quedan afuera y no suman costo', () => {
  const r = combinacionMasBarata([tit('t1', 'a'), tit('t2', 'z')], P, imp);
  assert.deepEqual(r.plataformas, ['a']);
  assert.deepEqual(r.sinOferta, ['t2']);
});
test('RN5: si nada está disponible no se contrata ninguna plataforma', () => {
  const r = combinacionMasBarata([tit('t1', 'z')], P, imp);
  assert.deepEqual(r.plataformas, []);
  assert.equal(r.costoMensual, 0);
});
test('RN6: una lista vacía lanza error', () => assert.throws(() => combinacionMasBarata([], P, imp), RangeError));
