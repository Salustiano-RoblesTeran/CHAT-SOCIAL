const { Schema, model } = require("mongoose");

const SolicitudSchema = new Schema({
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  estado: { type: String, enum: ['Pendiente', 'Aceptado', 'Rechazado'], default: 'Pendiente' }
});

const UsuarioSchema = new Schema({
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
  contactos: [{
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
  }],
  solicitudesPendientes: [SolicitudSchema], // Usamos el nuevo subesquema para manejar el estado
  estado: {
    type: Boolean,
    default: true,
  },
});

UsuarioSchema.methods.toJSON = function () {
  const { password, __v, ...usuario } = this.toObject();
  return usuario;
};

module.exports = model("Usuario", UsuarioSchema);
