const { response, request } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");



// Controlador para modificar usuario
const editarUsuario = async (req = request, res = response) => {
  const { id } = req.params;
  const { password, ...updUsuario } = req.body;

  // Si hay contraseña, cifrarla
  if (password) {
    const salt = bcrypt.genSaltSync(10);
    updUsuario.password = bcrypt.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, updUsuario, { new: true });

  res.json({
    mensaje: "Datos de usuario modificados",
    usuario,
  });
};

// Controlador para eliminar usuario (cambiar estado)
const usuariosDelete = async (req = request, res = response) => {
  const { id } = req.params;
  const usuario = await Usuario.findById(id);

  if (!usuario.estado) {
    return res.json({
      mensaje: "El usuario ya está inactivo",
    });
  }

  const usuarioInactivo = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });

  res.json({
    mensaje: "Usuario eliminado",
    usuarioInactivo,
  });
};

// Controlador para buscar usuarios por nombre
const buscarUsuario = async (req = request, res = response) => {
  const { nombre = "" } = req.query;
  const usuarioId = req.usuario._id; // Obtener el ID del usuario autenticado desde el middleware

  try {
    // Buscar usuarios que coincidan con el nombre y excluir al usuario actual
    const usuarios = await Usuario.find({
      nombre: { $regex: nombre, $options: "i" },
      _id: { $ne: usuarioId }, // Excluir al usuario actual
    });

    res.json({
      total: usuarios.length,
      usuarios,
    });
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    res.status(500).json({
      msg: "Error al buscar usuarios",
    });
  }
};

// Controlador para enviar solicitud de amistad
const enviarSolicitud = async (req = request, res = response) => {
  const { id } = req.params;
  const { contactoId } = req.body;

  try {
    const usuario = await Usuario.findById(id);
    const contacto = await Usuario.findById(contactoId);

    if (!usuario || !contacto) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const solicitudExistente = usuario.solicitudesPendientes.find(
      (solicitud) => solicitud.usuario.toString() === contactoId
    );

    if (solicitudExistente) {
      return res.status(400).json({ mensaje: `Solicitud ${solicitudExistente.estado.toLowerCase()}` });
    }

    usuario.solicitudesPendientes.push({ usuario: contactoId, estado: 'Pendiente' });
    await usuario.save();

    res.json({ mensaje: "Solicitud de contacto enviada" });
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
    res.status(500).json({ mensaje: "Error al enviar la solicitud" });
  }
};



// Controlador para aceptar solicitud de amistad
// Controlador para aceptar solicitud de amistad
const aceptarSolicitud = async (req = request, res = response) => {
  const { contactoId } = req.body; // ID del contacto que se acepta
  const usuarioId = req.usuario._id; // Obtén el ID del usuario actual desde el token

  try {
    // Encuentra el usuario que está aceptando la solicitud
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Encuentra la solicitud en solicitudesPendientes
    const solicitudIndex = usuario.solicitudesPendientes.findIndex(s => s.usuario.toString() === contactoId);
    if (solicitudIndex === -1) {
      return res.status(400).json({ mensaje: 'Solicitud no encontrada' });
    }

    // Cambia el estado de la solicitud a "Aceptado"
    usuario.solicitudesPendientes[solicitudIndex].estado = 'Aceptado';

    // Agregar el contacto a la lista de contactos del usuario que acepta la solicitud
    if (!usuario.contactos.includes(contactoId)) {
      usuario.contactos.push(contactoId);
    }

    // Eliminar la solicitud de solicitudesPendientes
    usuario.solicitudesPendientes.splice(solicitudIndex, 1);

    // Guardar cambios en el usuario que acepta
    await usuario.save();

    // También agrega el usuario aceptado a su lista de contactos
    const contacto = await Usuario.findById(contactoId);
    if (contacto) {
      // Agregar el usuario que aceptó la solicitud a la lista de contactos del contacto
      if (!contacto.contactos.includes(usuarioId)) {
        contacto.contactos.push(usuarioId);
      }
      
      // Guardar cambios en el contacto
      await contacto.save();
    }

    res.json({ mensaje: 'Solicitud aceptada y contacto agregado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al aceptar la solicitud' });
  }
};



// Controlador para rechazar solicitud de amistad
const rechazarSolicitud = async (req = request, res = response) => {
  const { id } = req.params;
  const { contactoId } = req.body;

  try {
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    if (!usuario.solicitudesPendientes.includes(contactoId)) {
      return res.status(400).json({ mensaje: "No hay solicitud pendiente" });
    }

    usuario.solicitudesPendientes = usuario.solicitudesPendientes.filter(solicitud => solicitud.toString() !== contactoId);
    await usuario.save();

    res.json({ mensaje: "Solicitud de contacto rechazada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al rechazar la solicitud" });
  }
};

const obtenerContactos = async (req, res) => {
  const usuarioId = req.usuario._id; // Obtener ID del usuario autenticado

  try {
    const usuario = await Usuario.findById(usuarioId).populate("contactos");
    res.json({ contactos: usuario.contactos });
  } catch (error) {
    console.error("Error al obtener contactos:", error);
    res.status(500).json({ msg: "Error al obtener contactos" });
  }
};

// Controlador para obtener solicitudes de amistad
const obtenerSolicitudes = async (req, res) => {
  const usuarioId = req.usuario._id; // ID del usuario autenticado

  try {
    // Encuentra el usuario
    const usuario = await Usuario.findById(usuarioId).populate('solicitudesPendientes.usuario', 'nombre correo');
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Retorna las solicitudes pendientes
    res.json(usuario.solicitudesPendientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las solicitudes' });
  }
};



module.exports = {
  editarUsuario,
  usuariosDelete,
  buscarUsuario,
  enviarSolicitud,
  aceptarSolicitud,
  rechazarSolicitud,
  obtenerContactos,
  obtenerSolicitudes
};
