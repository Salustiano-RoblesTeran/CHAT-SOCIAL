const { Schema, model } = require('mongoose');

const ChatSchema = Schema({
  mensaje: {
    type: String,
    required: [true, "El mensaje es obligatorio!"]
  },
  emisor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',  // Hace referencia al modelo Usuario
    required: true
  },
  receptor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',  // Hace referencia al modelo Usuario
    required: true
  },
  mensajes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Mensaje',
    },
  ],
  fecha: {
    type: Date,
    default: Date.now
  }
});

// Exportar el modelo
module.exports = model('Chat', ChatSchema);
