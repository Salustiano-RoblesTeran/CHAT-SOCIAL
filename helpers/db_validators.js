const Usuario = require("../models/usuario");

const esMailValido = async (correo) => {
  const exiteCorreo = await Usuario.findOne({ correo });

  if (exiteCorreo) {
    throw new Error(`El correo ${correo} ya existe en la base de datos!`);
  }
};


const esIdValido = async (id) => {
  const exiteUsuario = await Usuario.findById(id);

  if (!exiteUsuario) {
    throw new Error(`El ${id} no se encuentra en la base de datos!`);
  }
};

module.exports = {
  esMailValido,
  esIdValido,
};
