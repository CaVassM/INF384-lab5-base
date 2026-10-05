const SEMILLA = {
  ana: 500,
  beto: 300,
  carla: 1200,
  diego: 50,
  elena: 0,
};

function crearMonedero(saldos = SEMILLA) {
  const cuentas = new Map(Object.entries(saldos));
  const movimientos = [];

  function saldo(usuario) {
    if (!cuentas.has(usuario)) return null;
    return cuentas.get(usuario);
  }

  function historial(usuario) {
    return movimientos.filter((m) => m.origen === usuario || m.destino === usuario);
  }

  function transferir(origen, destino, monto) {
    if (typeof monto !== 'number' || !Number.isFinite(monto) || monto <= 0) {
      return { ok: false, codigo: 400, error: 'monto invalido' };
    }
    if (!cuentas.has(origen) || !cuentas.has(destino)) {
      return { ok: false, codigo: 400, error: 'usuario inexistente' };
    }
    if (origen === destino) {
      return { ok: false, codigo: 422, error: 'origen y destino iguales' };
    }
    if (cuentas.get(origen) < monto) {
      return { ok: false, codigo: 400, error: 'saldo insuficiente' };
    }
    cuentas.set(origen, cuentas.get(origen) - monto);
    cuentas.set(destino, cuentas.get(destino) + monto);
    const movimiento = {
      id: movimientos.length + 1,
      origen,
      destino,
      monto,
      fecha: new Date().toISOString(),
    };
    movimientos.push(movimiento);
    return { ok: true, codigo: 200, movimiento };
  }

  return { saldo, historial, transferir };
}

module.exports = { crearMonedero };
