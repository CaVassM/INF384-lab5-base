const _ = require('lodash');

const PLANTILLA = _.template(
  'Monedero Andino\n' +
    'Comprobante N.° <%= id %>\n' +
    'De: <%= origen %>\n' +
    'Para: <%= destino %>\n' +
    'Monto: S/ <%= monto %>\n' +
    'Fecha: <%= fecha %>\n'
);

function claveComprobante(movimiento) {
  const dia = movimiento.fecha.slice(0, 10);
  return `comprobantes/${dia}/${_.padStart(String(movimiento.id), 8, '0')}.txt`;
}

function generarComprobante(movimiento) {
  return {
    bucket: process.env.BUCKET_COMPROBANTES || 'monedero-andino-comprobantes-local',
    clave: claveComprobante(movimiento),
    contenido: PLANTILLA(movimiento),
  };
}

module.exports = { claveComprobante, generarComprobante };
