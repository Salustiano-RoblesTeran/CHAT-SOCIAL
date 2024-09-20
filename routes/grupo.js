const { Router } = require("express");
const { crearGrupo, agregarMiembro, enviarMensajeGrupo, obtenerChatGrupo } = require("../controllers/grupoCtrl");
const { validarJWT } = require("../middlewares/validar_JWT");

const router = Router();

// Ruta para crear un grupo
router.post("/:id", validarJWT, crearGrupo);

// Ruta POST para agregar un miembro al grupo
router.post("/:id/agregar-miembro", validarJWT, agregarMiembro);

router.post("/:id/mensaje", validarJWT, enviarMensajeGrupo);

router.get("/:id/mensajes", validarJWT, obtenerChatGrupo);

module.exports = router;
