const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar_JWT"); // Middleware para validar token

const { enviarMensaje, obtenerMensajes } = require("../controllers/chatCtrl");

const router = Router();

// Ruta para enviar un mensaje
router.post('/enviar', validarJWT, enviarMensaje);

// Ruta para obtener mensajes entre dos usuarios
router.get('/mensajes/:emisorId/:receptorId', validarJWT, obtenerMensajes);

module.exports = router;
