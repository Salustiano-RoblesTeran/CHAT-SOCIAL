const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar_JWT"); // Middleware para validar token
const { verificarAmistad } = require("../middlewares/validar_amistad")

const { iniciarConversacion, enviarMensaje, obtenerConversacion } = require('../controllers/chatCtrl');

const router = Router();

// Iniciar una conversación
router.post('/iniciar', validarJWT, verificarAmistad, iniciarConversacion);

// Enviar un mensaje
router.post('/enviar-mensaje', validarJWT, verificarAmistad, enviarMensaje);

// Obtener la conversación entre dos amigos
router.get('/conversacion/:amigoId', validarJWT, obtenerConversacion);


module.exports = router;
