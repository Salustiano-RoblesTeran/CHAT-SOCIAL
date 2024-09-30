const { response, request } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");

const SolicitudAmistad = require("../models/solicitud")


const obtenerNombre = async (req = request, res = response) => {
  const { _id } = req.usuario; // Obtener el ID del usuario utilizando el token

  try {
    // Buscar al usuario en la base de datos usando el _id
    const usuario = await Usuario.findOne({ _id });

    // Verificar si el usuario existe
    if (!usuario) {
      return res.status(404).json({
        msg: "Usuario no encontrado",
      });
    }

    // Devolver el nombre del usuario
    return res.json({
      nombre: usuario.nombre,
    });
  } catch (error) {
    console.error("Error al buscar usuario:", error);
    res.status(500).json({
      msg: "Error al buscar el usuario",
    });
  }
};



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
  const { id } = req.usuario; // Obtener el ID del usuario utilizando el token!
  
  try {
    // Buscar usuarios que coincidan con el nombre y excluir al usuario actual
    const usuarios = await Usuario.find({
      nombre: { $regex: nombre, $options: "i" },
      _id: { $ne: id }, // Excluir al usuario por ID
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
  const { id } = req.usuario; // ID del usuario que envía la solicitud
  const { contactoId } = req.body; // ID del usuario que recibe la solicitud

  try {
    const usuarioEnvia = await Usuario.findById(id);
    const usuarioRecibe = await Usuario.findById(contactoId);

    if (id === contactoId) {
      return res.status(400).json({ mensaje: "No puedes enviarte una solicitud a ti mismo" });
    }
    

    if (!usuarioEnvia || !usuarioRecibe) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Verificar si ya existe una solicitud pendiente o ya son amigos
    const solicitudExistente = await SolicitudAmistad.findOne({
      usuarioEnvia: id,
      usuarioRecibe: contactoId,
      estado: 'Pendiente'
    });

    if (solicitudExistente) {
      return res.status(400).json({ mensaje: `Solicitud ya enviada` });
    }

    if (usuarioEnvia.amigos.includes(contactoId)) {
      return res.status(400).json({ mensaje: "Ya son amigos" });
    }

    // Crear la solicitud de amistad
    const nuevaSolicitud = new SolicitudAmistad({
      usuarioEnvia: id,
      usuarioRecibe: contactoId,
    });

    await nuevaSolicitud.save();

    // Agregar la solicitud a las listas de ambos usuarios
    usuarioEnvia.solicitudesEnviadas.push(nuevaSolicitud._id);
    usuarioRecibe.solicitudesPendientes.push(nuevaSolicitud._id);

    await usuarioEnvia.save();
    await usuarioRecibe.save();

    res.json({ mensaje: "Solicitud de amistad enviada" });
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
    res.status(500).json({ mensaje: "Error al enviar la solicitud" });
  }
};




// Controlador para aceptar solicitud de amistad
const aceptarSolicitud = async (req = request, res = response) => {
  const { solicitudId } = req.body;

  try {
    const solicitud = await SolicitudAmistad.findById(solicitudId).populate('usuarioEnvia usuarioRecibe');

    if (!solicitud || solicitud.estado !== 'Pendiente') {
      return res.status(404).json({ mensaje: 'Solicitud no encontrada o ya procesada' });
    }

    // Marcar la solicitud como aceptada
    solicitud.estado = 'Aceptado';
    await solicitud.save();

    // Agregar a ambos usuarios como amigos
    const { usuarioEnvia, usuarioRecibe } = solicitud;

    usuarioEnvia.amigos.push(usuarioRecibe._id);
    usuarioRecibe.amigos.push(usuarioEnvia._id);

    await usuarioEnvia.save();
    await usuarioRecibe.save();

    res.json({ mensaje: 'Solicitud de amistad aceptada' });
  } catch (error) {
    console.error("Error al aceptar la solicitud:", error);
    res.status(500).json({ mensaje: "Error al aceptar la solicitud" });
  }
};





// Controlador para rechazar solicitud de amistad
const rechazarSolicitud = async (req = request, res = response) => {
  const { solicitudId } = req.body;

  try {
    const solicitud = await SolicitudAmistad.findById(solicitudId);

    if (!solicitud || solicitud.estado !== 'Pendiente') {
      return res.status(404).json({ mensaje: 'Solicitud no encontrada o ya procesada' });
    }

    // Marcar la solicitud como rechazada
    solicitud.estado = 'Rechazado';
    await solicitud.save();
    

    res.json({ mensaje: 'Solicitud de amistad rechazada' });
  } catch (error) {
    console.error("Error al rechazar la solicitud:", error);
    res.status(500).json({ mensaje: "Error al rechazar la solicitud" });
  }
};


const obtenerContactos = async (req, res) => {
  const usuarioId = req.usuario._id; // Obtener ID del usuario autenticado

  try {
    const usuario = await Usuario.findById(usuarioId).populate("amigos");
    res.json({ amigos: usuario.amigos });
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
  obtenerNombre,
  editarUsuario,
  usuariosDelete,
  buscarUsuario,
  enviarSolicitud,
  aceptarSolicitud,
  rechazarSolicitud,
  obtenerContactos,
  obtenerSolicitudes
};
