const { Schema, model } = require("mongoose");

const MensajeGrupoSchema = Schema({
  mensaje: {
    type: String,
    required: [true, "El mensaje es obligatorio"],
  },
  emisor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario', // Referencia al usuario que envía el mensaje
    required: true,
  },
  grupo: {
    type: Schema.Types.ObjectId,
    ref: 'Grupo', // Referencia al grupo donde se envía el mensaje
    required: true,
  },
  fechaEnvio: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("MensajeGrupo", MensajeGrupoSchema);
