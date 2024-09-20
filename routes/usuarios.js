const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar_JWT");

const router = Router();
const {
  esMailValido,
  esIdValido,
} = require("../helpers/db_validators");

const { validarCampos } = require("../middlewares/validar_campos");
const {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
  enviarSolicitud,
  buscarUsuario,
  aceptarSolicitud,
  rechazarSolicitud
} = require("../controllers/usuariosCtrl");

//Ruta GET
router.get("/", usuariosGet);

//Ruta POST - register
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check(
      "password",
      "La contraseña debe tener como minimo 6 caracteres"
    ).isLength({ min: 6 }),
    check("correo", "no es un correo valido!").isEmail(),
    check("correo").custom(esMailValido),
    // check("rol").custom(esRolValido),
    validarCampos,
  ],
  usuariosPost
);

//Ruta PUT - update
router.put(
  "/:id",
  [
    check("id", "No es un ID valido!").isMongoId(),
    check("id").custom(esIdValido),
    validarCampos,
  ],
  usuariosPut
);

//Ruta DELETE
router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID valido!").isMongoId(),
    check("id").custom(esIdValido),
    validarCampos,
  ],
  usuariosDelete
);

// Ruta GET para buscar usuarios
router.get('/buscar',
  [
    validarJWT,
    validarCampos
  ],
  buscarUsuario);


// Ruta POST - enviar solicitud de contacto
router.post("/:id/enviar-solicitud", validarJWT, enviarSolicitud);

// Ruta POST - aceptar solicitud de contacto
router.post("/:id/aceptar-solicitud", validarJWT, aceptarSolicitud);

// Ruta POST - rechazar solicitud de contacto
router.post("/:id/rechazar-solicitud", validarJWT, rechazarSolicitud);



module.exports = router;
