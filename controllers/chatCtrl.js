const { response, request } = require("express");
const Conversacion = require('../models/conversacion');
const Mensaje = require('../models/mensaje')

const iniciarConversacion = async (req = request, res = response) => {
  const { amigoId } = req.body;
  const { _id: usuarioId } = req.usuario; // ID del usuario autenticado

  try {
    // Verificar si ya existe una conversación entre los dos amigos
    let conversacion = await Conversacion.findOne({
      participantes: { $all: [usuarioId, amigoId] }
    });

    // Si no existe la conversación, crear una nueva
    if (!conversacion) {
      conversacion = new Conversacion({
        participantes: [usuarioId, amigoId]
      });
      await conversacion.save();
    }

    res.json({ conversacion });
  } catch (error) {
    console.error("Error al iniciar conversación:", error);
    res.status(500).json({ mensaje: "Error al iniciar conversación" });
  }
};

const enviarMensaje = async (req = request, res = response) => {
  const { mensaje, amigoId } = req.body;
  const { _id: usuarioId } = req.usuario; // ID del usuario autenticado

  try {
    // Verificar si existe una conversación
    let conversacion = await Conversacion.findOne({
      participantes: { $all: [usuarioId, amigoId] }
    });

    if (!conversacion) {
      return res.status(404).json({ mensaje: "No existe una conversación con este usuario" });
    }

    // Crear un nuevo mensaje
    const nuevoMensaje = new Mensaje({
      remitente: usuarioId,
      receptor: amigoId,
      contenido: mensaje,
    });

    // Guardar el mensaje en la colección de Mensajes
    await nuevoMensaje.save();
    console.log("Mensaje guardado:", nuevoMensaje); // Verifica que el mensaje se guarda

    // Agregar la referencia del mensaje a la conversación
    conversacion.mensajes.push(nuevoMensaje._id);

    // Guardar la conversación con el nuevo mensaje
    await conversacion.save();

    res.json({ conversacion });
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res.status(500).json({ mensaje: "Error al enviar mensaje" });
  }
};




const obtenerConversacion = async (req = request, res = response) => {
  const { amigoId } = req.params; // El ID del amigo viene de los parámetros
  const { _id: usuarioId } = req.usuario; // El ID del usuario autenticado

  try {
    // Buscar la conversación entre los dos amigos
    const conversacion = await Conversacion.findOne({
      participantes: { $all: [usuarioId, amigoId] }
    }).populate('mensajes'); // Opcional: Puedes usar populate para traer los mensajes

    if (!conversacion) {
      return res.status(404).json({ mensaje: "No se encontró conversación entre los usuarios" });
    }

    res.json({ mensajes: conversacion.mensajes });
  } catch (error) {
    console.error("Error al obtener conversación:", error);
    res.status(500).json({ mensaje: "Error al obtener conversación" });
  }
};


module.exports = {
  iniciarConversacion,
  enviarMensaje,
  obtenerConversacion,
};
