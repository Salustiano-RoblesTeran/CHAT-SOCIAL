const Chat = require('../models/chat');
const Mensaje = require('../models/mensaje');


// Obtener todos los chats de un usuario autenticado
const obtenerChats = async (req, res) => {
  try {
    const usuarioId = req.user.id; // ID del usuario autenticado obtenido del middleware de autenticación
    const chats = await Chat.find({ participantes: usuarioId }).populate('participantes', 'nombre correo');
    res.json(chats);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener los chats', error });
  }
};

// Crear un nuevo chat entre dos usuarios
const crearChat = async (req, res) => {
  try {
    const usuarioId = req.user.id; // ID del usuario autenticado
    const { receptorId } = req.body;

    // Verificar que el chat entre los usuarios no exista ya
    const chatExistente = await Chat.findOne({
      participantes: { $all: [usuarioId, receptorId] },
    });

    if (chatExistente) {
      return res.status(400).json({ msg: 'El chat ya existe' });
    }

    const nuevoChat = new Chat({
      participantes: [usuarioId, receptorId],
    });

    await nuevoChat.save();
    res.json(nuevoChat);
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear el chat', error });
  }
};

// Obtener mensajes de un chat específico
const obtenerMensajes = async (req, res) => {
  try {
    const { chatId } = req.params;
    const mensajes = await Mensaje.find({ chat: chatId }).populate('emisor', 'nombre correo');
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener los mensajes', error });
  }
};

// Enviar un mensaje en un chat
const enviarMensaje = async (req, res) => {
  try {
    const usuarioId = req.user.id; // ID del usuario autenticado
    const { chatId, contenido } = req.body;

    const nuevoMensaje = new Mensaje({
      emisor: usuarioId,
      contenido,
      chat: chatId,
    });

    await nuevoMensaje.save();
    await Chat.findByIdAndUpdate(chatId, { $push: { mensajes: nuevoMensaje._id } });

    res.json(nuevoMensaje);
  } catch (error) {
    res.status(500).json({ msg: 'Error al enviar el mensaje', error });
  }
};

module.exports = {
  obtenerChats,
  crearChat,
  obtenerMensajes,
  enviarMensaje,
};
