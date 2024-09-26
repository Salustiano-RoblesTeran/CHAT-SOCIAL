const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar_JWT");
const { validarCampos } = require("../middlewares/validar_campos");
const { esIdValido } = require("../helpers/db_validators");

const {
  editarUsuario,
  usuariosDelete,
  enviarSolicitud,
  buscarUsuario,
  aceptarSolicitud,
  rechazarSolicitud,
  obtenerContactos,
  obtenerSolicitudes
} = require("../controllers/usuariosCtrl");

const router = Router();



// Ruta PUT para modificar un usuario
router.put("/:id", validarJWT, editarUsuario);

// Ruta DELETE para eliminar un usuario (cambiar estado)
router.delete("/:id", validarJWT, usuariosDelete);

// Ruta GET para buscar usuarios por nombre
router.get("/buscar", [validarJWT, validarCampos], buscarUsuario);

// Ruta POST para enviar solicitud de contacto
router.post("/:id/enviar-solicitud", validarJWT, enviarSolicitud);


// Ruta POST para aceptar solicitud de contacto
router.post("/:id/aceptar-solicitud", validarJWT, aceptarSolicitud);

// Ruta POST para rechazar solicitud de contacto
router.post("/:id/rechazar-solicitud", validarJWT, rechazarSolicitud);


// Ruta para obtener contactos
router.get("/contactos", validarJWT, obtenerContactos); 

// Ruta para obtener solicitudes de amistad
router.get("/solicitudes", validarJWT, obtenerSolicitudes);



module.exports = router;
