const { response, request } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");

//Controlador GET
const usuariosGet = async (req = request, res = response) => {
  //Pedido de lista completa
  // const usuarios = await Usuario.find();

  const { desde = 0, limite = 0 } = req.query;

  const estadoTrue = { estado: true };

  // const usuarios = await Usuario.find().skip(desde).limit(limite);
  // const total = await Usuario.countDocuments();

  //Optimizar respuestas
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(estadoTrue),
    Usuario.find(estadoTrue).skip(desde).limit(limite),
  ]);

  res.json({
    mensaje: "lista de usuarios",
    total,
    usuarios,
  });
};

//Controlador POST
const usuariosPost = async (req = request, res = response) => {
  const datos = req.body;
  const { nombre, correo, password} = datos;

  const usuario = new Usuario({ nombre, correo, password});

  const salt = bcrypt.genSaltSync(10);
  // const hash = bcrypt.hashSync(password, salt);
  // usuario.password = hash;
  usuario.password = bcrypt.hashSync(password, salt);

  //Guardar en DB
  await usuario.save();

  res.json({
    usuario,
    mensaje: "usuario registrado!",
  });
};

//Controlador PUT
const usuariosPut = async (req = request, res = response) => {
  const { id } = req.params;

  const { password, ...updUsuario } = req.body;

  if (password) {
    const salt = bcrypt.genSaltSync(10);
    updUsuario.password = bcrypt.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, updUsuario, {
    new: true,
  });

  res.json({
    mensaje: "Datos de usuario modificado!",
    usuario,
  });
};

//Controlador DELETE
const usuariosDelete = async (req = request, res = response) => {
  const { id } = req.params;

  const usuarioAdmin = req.usuario;

  // //!Eliminar datos de la DB
  // const usuarioEliminado = await Usuario.findByIdAndDelete(id);

  //Cambiar ESTADO del objeto
  const usuario = await Usuario.findById(id);

  //Verificar estado
  if (!usuario.estado) {
    return res.json({
      msg: "El USUARIO ya esta inactivo!",
    });
  }

  //Cambiar el valor del estado
  const usuarioInactivo = await Usuario.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json({
    mensaje: "Datos eliminados!",
    usuarioInactivo,
    // usuarioEliminado,
    usuarioAdmin,
  });


};


const buscarUsuario = async (req = request, res = response) => {
  const { nombre = '' } = req.query;

  const usuarios = await Usuario.find({ 
    nombre: { $regex: nombre, $options: 'i' } // 'i' para ignorar mayúsculas y minúsculas
  });

  res.json({
    total: usuarios.length,
    usuarios
  });
};

// Controlador para enviar solicitud de contacto
const enviarSolicitud = async (req = request, res = response) => {
  const { id } = req.params; // ID del usuario que envía la solicitud
  const { contactoId } = req.body; // ID del usuario que recibe la solicitud

  try {
    const usuario = await Usuario.findById(id);
    const contacto = await Usuario.findById(contactoId);

    if (!usuario || !contacto) {
      return res.status(404).json({ mensaje: "Uno de los usuarios no fue encontrado" });
    }

    // Verificar si ya es contacto
    if (usuario.contactos.includes(contactoId)) {
      return res.status(400).json({ mensaje: "Ya es contacto" });
    }

    // Verificar si ya existe una solicitud pendiente
    if (usuario.solicitudesPendientes.includes(contactoId)) {
      return res.status(400).json({ mensaje: "Ya existe una solicitud pendiente" });
    }

    // Agregar solicitud a pendientes
    usuario.solicitudesPendientes.push(contactoId);
    await usuario.save();

    res.json({ mensaje: "Solicitud de contacto enviada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al enviar la solicitud" });
  }
};

// Controlador para aceptar solicitud de contacto
const aceptarSolicitud = async (req = request, res = response) => {
  const { id } = req.params; // ID del usuario que acepta la solicitud
  const { contactoId } = req.body; // ID del usuario que envió la solicitud

  try {
    const usuario = await Usuario.findById(id);
    const contacto = await Usuario.findById(contactoId);

    if (!usuario || !contacto) {
      return res.status(404).json({ mensaje: "Uno de los usuarios no fue encontrado" });
    }

    // Verificar si ya es contacto
    if (usuario.contactos.includes(contactoId)) {
      return res.status(400).json({ mensaje: "Ya es contacto" });
    }

    // Verificar si existe una solicitud pendiente
    if (!usuario.solicitudesPendientes.includes(contactoId)) {
      return res.status(400).json({ mensaje: "No existe una solicitud pendiente de este usuario" });
    }

    // Aceptar la solicitud: agregar a contactos
    usuario.contactos.push(contactoId);
    contacto.contactos.push(id); // También añadir al contacto del otro usuario

    // Eliminar la solicitud pendiente
    usuario.solicitudesPendientes = usuario.solicitudesPendientes.filter(
      solicitud => solicitud.toString() !== contactoId
    );

    // Guardar cambios
    await usuario.save();
    await contacto.save();

    res.json({ mensaje: "Solicitud de contacto aceptada exitosamente", usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al aceptar la solicitud de contacto" });
  }
};

// Controlador para rechazar solicitud de contacto
const rechazarSolicitud = async (req = request, res = response) => {
  const { id } = req.params; // ID del usuario que rechaza la solicitud
  const { contactoId } = req.body; // ID del usuario que envió la solicitud

  try {
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Verificar si existe una solicitud pendiente
    if (!usuario.solicitudesPendientes.includes(contactoId)) {
      return res.status(400).json({ mensaje: "No existe una solicitud pendiente de este usuario" });
    }

    // Eliminar la solicitud pendiente
    usuario.solicitudesPendientes = usuario.solicitudesPendientes.filter(
      solicitud => solicitud.toString() !== contactoId
    );

    // Guardar cambios
    await usuario.save();

    res.json({ mensaje: "Solicitud de contacto rechazada exitosamente", usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al rechazar la solicitud de contacto" });
  }
};


module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
  buscarUsuario,
  enviarSolicitud,
  aceptarSolicitud,
  rechazarSolicitud
}
