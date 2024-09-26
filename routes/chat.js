const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar_JWT"); // Middleware para validar token

const { obtenerChats, crearChat, obtenerMensajes, enviarMensaje } = require('../controllers/chatCtrl');

const router = Router();

// Obtener todos los chats del usuario autenticado
router.get('/', validarJWT, obtenerChats)

// Crear un nuevo chat
router.post('/', validarJWT, crearChat);

// Obtener mensajes de un chat específico
router.get('/:chatId/mensajes', validarJWT, obtenerChats)

// Enviar un mensaje en un chat
router.post('/mensaje', validarJWT, enviarMensaje);


module.exports = router;
