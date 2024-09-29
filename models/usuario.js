const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  estado: {
    type: Boolean,
    default: true
  },
  amigos: [{
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }],
  solicitudesPendientes: [{
    type: Schema.Types.ObjectId,
    ref: 'SolicitudAmistad'
  }],
  solicitudesEnviadas: [{
    type: Schema.Types.ObjectId,
    ref: 'SolicitudAmistad'
  }],
});


UsuarioSchema.methods.toJSON = function () {
  const { password, __v, ...usuario } = this.toObject();
  return usuario;
};

module.exports = model("Usuario", UsuarioSchema);
