const { Schema, model } = require("mongoose");

const SolicitudAmistadSchema = Schema({
    usuarioEnvia: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    usuarioRecibe: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    estado: {
      type: String,
      enum: ['Pendiente', 'Aceptado', 'Rechazado'],
      default: 'Pendiente'
    }
  }, {
    timestamps: true
  });
  
  module.exports = model('SolicitudAmistad', SolicitudAmistadSchema);
  
