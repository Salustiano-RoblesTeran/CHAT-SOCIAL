const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar_campos");
const { login } = require("../controllers/authCtrl");

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

module.exports = router;
