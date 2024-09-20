// controllers/chatCtrl.js

const Chat = require('../models/chat'); // Importa el modelo de Chat

// Función para manejar el envío de mensajes
const enviarMensaje = async (req, res) => {
  const { mensaje, emisorId, receptorId } = req.body;

  try {
    const nuevoMensaje = new Chat({
      mensaje,
      emisor: emisorId,
      receptor: receptorId,
    });

    await nuevoMensaje.save();

    res.status(201).json({
      msg: 'Mensaje enviado correctamente',
      nuevoMensaje,
    });
  } catch (error) {
    console.error('Error al guardar el mensaje en la base de datos:', error);
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

module.exports = {
  enviarMensaje,
  obtenerMensajes,
};
