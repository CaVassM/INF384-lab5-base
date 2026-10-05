const test = require('node:test');
const assert = require('node:assert');
const { crearMonedero } = require('../src/wallet');

test('saldo de un usuario existente', () => {
  const m = crearMonedero({ ana: 100 });
  assert.strictEqual(m.saldo('ana'), 100);
});

test('saldo de un usuario inexistente', () => {
  const m = crearMonedero({ ana: 100 });
  assert.strictEqual(m.saldo('zoe'), null);
});

test('transferencia valida mueve el dinero', () => {
  const m = crearMonedero({ ana: 100, beto: 0 });
  const r = m.transferir('ana', 'beto', 40);
  assert.strictEqual(r.ok, true);
  assert.strictEqual(m.saldo('ana'), 60);
  assert.strictEqual(m.saldo('beto'), 40);
});

test('monto menor o igual a cero', () => {
  const m = crearMonedero({ ana: 100, beto: 0 });
  assert.strictEqual(m.transferir('ana', 'beto', 0).codigo, 400);
  assert.strictEqual(m.transferir('ana', 'beto', -5).codigo, 400);
});

test('saldo insuficiente', () => {
  const m = crearMonedero({ ana: 10, beto: 0 });
  assert.strictEqual(m.transferir('ana', 'beto', 40).codigo, 400);
  assert.strictEqual(m.saldo('ana'), 10);
});

test('origen y destino iguales', () => {
  const m = crearMonedero({ ana: 100 });
  assert.strictEqual(m.transferir('ana', 'ana', 10).codigo, 422);
});

test('el historial registra la transferencia', () => {
  const m = crearMonedero({ ana: 100, beto: 0 });
  m.transferir('ana', 'beto', 40);
  assert.strictEqual(m.historial('beto').length, 1);
});
