const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar_JWT"); // Middleware para validar token
const { verificarAmistad } = require("../middlewares/validar_amistad")

const { enviarMensaje, obtenerConversacion, listaChats } = require('../controllers/chatCtrl');

const router = Router();

// Iniciar una conversación

// Enviar un mensaje
router.post('/enviar-mensaje', validarJWT, verificarAmistad, enviarMensaje);

// Obtener la conversación entre dos amigos
router.get('/conversacion/:amigoId', validarJWT, obtenerConversacion);

router.get('/chats', validarJWT, listaChats)


module.exports = router;
