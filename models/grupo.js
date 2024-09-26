const { Schema, model } = require("mongoose");

const GrupoSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre del grupo es obligatorio"],
  },
  administrador: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario', // Referencia al modelo de usuario
    required: true,
  },
  miembros: [{
    type: Schema.Types.ObjectId,
    ref: 'Usuario', // Referencia a los usuarios que son miembros del grupo
  }],
  mensajes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Mensaje',
    },
  ],
});

module.exports = model("Grupo", GrupoSchema);
