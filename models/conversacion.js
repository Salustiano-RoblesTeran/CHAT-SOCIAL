const { Schema, model } = require('mongoose');

const ConversacionSchema = Schema({
  participantes: [{
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }],
  mensajes: [{
    type: Schema.Types.ObjectId,
    ref: 'Mensaje' // Importante: referencia al modelo Mensaje
  }]
}, {
  timestamps: true
});

module.exports = model('Conversacion', ConversacionSchema);
