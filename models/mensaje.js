const { Schema, model } = require("mongoose");

const mensajeSchema = Schema({
  emisor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contenido: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  chat: {
    type: Schema.Types.ObjectId,
    ref: 'Chat',
  },
  grupo: {
    type: Schema.Types.ObjectId,
    ref: 'Grupo',
  },
});

module.exports = model('Mensaje', mensajeSchema);
