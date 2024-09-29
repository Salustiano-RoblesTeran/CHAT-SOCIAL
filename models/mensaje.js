const { Schema, model } = require("mongoose");

const MensajeSchema = Schema({
  remitente: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  receptor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  contenido: {
    type: String,
    required: true
  },
  leido: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Guardará la fecha y hora en que se envió el mensaje
});

module.exports = model('Mensaje', MensajeSchema);


