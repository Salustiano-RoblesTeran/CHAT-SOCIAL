const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, "Este dato es obligatorio!"],
    unique: true,
  },
  correo: {
    type: String,
    required: [true, "Este dato es obligatorio!"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Este dato es obligatorio!"],
  },
  chats: [{
    type: Schema.Types.ObjectId,
    ref: 'Chat'
  }],
  grupo: [{
    type: Schema.Types.ObjectId,
    ref: 'Grupo'
  }],
  contactos: [{
    type: Schema.Types.ObjectId,
    ref: 'Usuario' // Hacemos referencia al modelo de usuario para añadir contactos como referencias a otros usuarios
  }],
  solicitudesPendientes: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Usuario' 
  }],
  estado: {
    type: Boolean,
    default: true,
  },
});

//Quitar datos de la respuesta
UsuarioSchema.methods.toJSON = function () {
  const { password, __v, ...usuario } = this.toObject();

  return usuario;
};

module.exports = model("Usuario", UsuarioSchema);
