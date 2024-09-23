const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar_campos");
const { login, registro } = require("../controllers/authCtrl");

const {esMailValido} = require("../helpers/db_validators")

const router = Router();

router.post(
  "/login",
  [
    check("correo", "El correo no es valido!").isEmail(),
    check("correo", "El campo es obligatorio!").notEmpty(),
    check("password", "El campo es obligatorio!").notEmpty(),
    validarCampos,
  ],
  login
);

//Ruta POST - register
router.post(
  "/registro",
  [
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check("password","La contraseña debe tener como minimo 6 caracteres").isLength({ min: 6 }),
    check("correo", "no es un correo valido!").isEmail(),
    check("correo").custom(esMailValido),
    validarCampos,
  ],
  registro
);

module.exports = router;
