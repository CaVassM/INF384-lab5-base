const { crearMonedero } = require('./wallet');
const { generarComprobante } = require('./comprobantes');
const { registrarComercio } = require('./notificaciones');
const paquete = require('../package.json');

const monedero = crearMonedero();

function responder(codigo, cuerpo) {
  return {
    statusCode: codigo,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(cuerpo),
  };
}

function leerCuerpo(evento) {
  try {
    return JSON.parse(evento.body || '{}');
  } catch (e) {
    return null;
  }
}

async function handler(evento) {
  const metodo = evento.requestContext?.http?.method || 'GET';
  const ruta = evento.rawPath || '/';

  if (metodo === 'GET' && ruta === '/salud') {
    return responder(200, { ok: true, version: paquete.version, commit: process.env.COMMIT || 'local' });
  }

  const saldo = ruta.match(/^\/saldo\/([a-z]+)$/);
  if (metodo === 'GET' && saldo) {
    const valor = monedero.saldo(saldo[1]);
    if (valor === null) return responder(404, { error: 'usuario inexistente' });
    return responder(200, { usuario: saldo[1], saldo: valor });
  }

  const historial = ruta.match(/^\/historial\/([a-z]+)$/);
  if (metodo === 'GET' && historial) {
    return responder(200, monedero.historial(historial[1]));
  }

  if (metodo === 'POST' && ruta === '/transferir') {
    const cuerpo = leerCuerpo(evento);
    if (!cuerpo) return responder(400, { error: 'cuerpo invalido' });
    const resultado = monedero.transferir(cuerpo.origen, cuerpo.destino, cuerpo.monto);
    if (!resultado.ok) return responder(resultado.codigo, { error: resultado.error });
    const comprobante = generarComprobante(resultado.movimiento);
    return responder(200, { movimiento: resultado.movimiento, comprobante: comprobante.clave });
  }

  if (metodo === 'POST' && ruta === '/comercios/notificacion') {
    const cuerpo = leerCuerpo(evento);
    if (!cuerpo) return responder(400, { error: 'cuerpo invalido' });
    const resultado = registrarComercio(cuerpo.comercio, cuerpo.url);
    if (!resultado.ok) return responder(400, { error: resultado.error });
    return responder(201, resultado);
  }

  return responder(404, { error: 'ruta inexistente' });
}

module.exports = { handler };
