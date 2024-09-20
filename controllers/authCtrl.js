const { response, request } = require('express');
const Usuario = require('../models/usuario')
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req = request, res = response) => {
    const { correo, password } = req.body;
  
    try {
      //Validar correo
      const usuario = await Usuario.findOne({ correo });
  
      if (!usuario) {
        return res.status(400).json({
          msg: "Correo o contraseña incorrectos!",
        });
      }
  
      //Validar ESTADO
      if (!usuario.estado) {
        return res.status(400).json({
          msg: "Usuario inactivo!",
        });
      }
  
      //Validacion de password
      //ENCRIPTACION
      const validPassword = bcrypt.compareSync(password, usuario.password);
      //VALIDACION
      if (!validPassword) {
        return res.status(400).json({
          msg: "Correo o contraseña incorrectos!",
        });
      }
  
      //GENERAR TOKEN
      const token = await generarJWT(usuario.id);
  
      //Respuesta del backEnd
      res.json({
        msg: "Login Ok!",
        usuario,
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: "Problemas internos del servidor!",
      });
    }
  };
  
  module.exports = {
    login,
  };
  