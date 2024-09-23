// controllers/chatCtrl.js

const Chat = require('../models/chat'); // Importa el modelo de Chat
const Usuario = require('../models/usuario')

// Función para manejar el envío de mensajes
const enviarMensaje = async (req, res) => {
  const { mensaje, emisorId, receptorId } = req.body;

  try {
    // Verificar si ya existe un chat entre el emisor y el receptor
    let chatExistente = await Chat.findOne({
      emisor: { $in: [emisorId, receptorId] },
      receptor: { $in: [emisorId, receptorId] }
    });

    if (chatExistente) {
      // Si ya existe la conversación, simplemente agregar el nuevo mensaje
      chatExistente.mensaje = mensaje; // Actualizamos con el nuevo mensaje
      chatExistente.fecha = Date.now(); // Actualizar la fecha del último mensaje

      await chatExistente.save();

      res.status(200).json({
        msg: 'Mensaje agregado al chat existente',
        chatExistente,
      });
    } else {
      // Si no existe, crear un nuevo chat
      const nuevoChat = new Chat({
        mensaje,
        emisor: emisorId,
        receptor: receptorId,
      });

      await nuevoChat.save();

      // Actualizar el chat en los usuarios
      await Usuario.findByIdAndUpdate(emisorId, { $push: { chats: nuevoChat._id } });
      await Usuario.findByIdAndUpdate(receptorId, { $push: { chats: nuevoChat._id } });

      res.status(201).json({
        msg: 'Nuevo chat creado y mensaje enviado',
        nuevoChat,
      });
    }
  } catch (error) {
    console.error('Error al procesar el mensaje:', error);
    res.status(500).json({
      msg: 'Hubo un error al enviar el mensaje',
    });
  }
};

// Función para obtener todos los mensajes entre dos usuarios
const obtenerMensajes = async (req, res) => {
  const { emisorId, receptorId } = req.params;

  try {
    const mensajes = await Chat.find({
      $or: [
        { emisor: emisorId, receptor: receptorId },
        { emisor: receptorId, receptor: emisorId }
      ]
    }).sort({ fecha: 1 });

    res.status(200).json(mensajes);
  } catch (error) {
    console.error('Error al obtener los mensajes:', error);
    res.status(500).json({
      msg: 'Hubo un error al obtener los mensajes',
    });
  }
};


// Funcion para obtener todos los chats de un usuario
const obtenerChats = async (req, res) => {
  const { userId } = req.params;

  try {
    // Obtener el usuario por su ID
    const usuario = await Usuario.findById(userId).populate('chats');

    if (!usuario) {
      return res.status(404).json({
        msg: 'Usuario no encontrado',
      });
    }

    // Obtener los chats asociados al usuario
    const chats = await Chat.find({
      $or: [
        { emisor: userId },
        { receptor: userId }
      ]
    }).populate('emisor receptor'); // Opcional: esto te permitirá obtener los detalles del emisor y receptor

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error al obtener los chats:', error);
    res.status(500).json({
      msg: 'Hubo un error al obtener los chats',
    });
  }
};

module.exports = {
  enviarMensaje,
  obtenerMensajes,
  obtenerChats
};
