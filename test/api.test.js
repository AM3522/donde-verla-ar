import test from 'node:test';
import assert from 'node:assert/strict';
import { servidor } from '../src/servidor.js';

let base;
test.before(() => new Promise((ok) => servidor.listen(0, () => { base = `http://localhost:${servidor.address().port}`; ok(); })));
test.after(() => servidor.close());
const get = async (ruta) => (await fetch(base + ruta)).json();
const post = (cuerpo) => fetch(`${base}/api/combinacion`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) });

test('GET /api/salud responde ok', async () => assert.deepEqual(await get('/api/salud'), { ok: true }));
test('HU1: buscar "eterna" encuentra El Eternauta', async () => assert.equal((await get('/api/titulos?q=eterna'))[0].id, 'el-eternauta'));
test('HU3: filtrar por Disney+ devuelve solo sus títulos', async () => {
  const datos = await get('/api/titulos?plataforma=disney');
  assert.ok(datos.length >= 2);
  assert.ok(datos.every((t) => t.opciones.some((o) => o.plataforma === 'disney')));
});
test('HU4: las plataformas traen precio final por plan', async () => {
  const [primera] = await get('/api/plataformas');
  assert.ok(primera.planes.every((p) => p.precioFinal > p.base));
});
test('RN6: lista vacía responde 400', async () => assert.equal((await post({ ids: [] })).status, 400));
test('RN6: título inexistente responde 400', async () => assert.equal((await post({ ids: ['no-existe'] })).status, 400));
test('HU5: la combinación devuelve plataformas y costo', async () => {
  const r = await post({ ids: ['stranger-things', 'the-last-of-us'] });
  const d = await r.json();
  assert.equal(r.status, 200);
  assert.deepEqual([...d.plataformas].sort(), ['hbomax', 'netflix']);
  assert.ok(d.costoMensual > 0);
});
test('una ruta de API inexistente responde 404', async () => assert.equal((await fetch(`${base}/api/nada`)).status, 404));
