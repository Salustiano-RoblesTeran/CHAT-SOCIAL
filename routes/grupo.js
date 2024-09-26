const { Router } = require("express");
const { obtenerGrupos, crearGrupo, addParticipante, enviarMensajeGrupo } = require('../controllers/grupoCtrl');

const { validarJWT } = require("../middlewares/validar_JWT");

const router = Router();

// Obtener todos los grupos del usuario autenticado
router.get('/', validarJWT, obtenerGrupos);

// Crear un nuevo grupo
router.post('/', validarJWT, crearGrupo);

// Añadir participante a un grupo
router.post('/:grupoId/participante', validarJWT, addParticipante)

// Enviar mensaje en un grupo
router.post('mensaje', validarJWT, enviarMensajeGrupo)



module.exports = router;
