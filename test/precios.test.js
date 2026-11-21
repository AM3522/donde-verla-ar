import test from 'node:test';
import assert from 'node:assert/strict';
import { precioFinal } from '../src/reglas.js';

const imp = { iva: 0.21, percepcionGanancias: 0.3 };
test('RN2: suma IVA y percepción sobre el precio base', () => assert.equal(precioFinal(10000, imp), 15100));
test('RN2: redondea al peso', () => assert.equal(precioFinal(8263.64, imp), 12478));
test('RN2: sin impuestos el precio no cambia', () => assert.equal(precioFinal(500, { iva: 0, percepcionGanancias: 0 }), 500));
