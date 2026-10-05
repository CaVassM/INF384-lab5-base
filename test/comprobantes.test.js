const test = require('node:test');
const assert = require('node:assert');
const { claveComprobante, generarComprobante } = require('../src/comprobantes');

const movimiento = { id: 7, origen: 'ana', destino: 'beto', monto: 40, fecha: '2026-11-06T22:40:00.000Z' };

test('la clave agrupa por dia', () => {
  assert.strictEqual(claveComprobante(movimiento), 'comprobantes/2026-11-06/00000007.txt');
});

test('el comprobante incluye origen, destino y monto', () => {
  const c = generarComprobante(movimiento);
  assert.match(c.contenido, /De: ana/);
  assert.match(c.contenido, /Para: beto/);
  assert.match(c.contenido, /Monto: S\/ 40/);
});
