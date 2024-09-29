const Usuario = require('../models/usuario'); // Importa el modelo de usuario

const verificarAmistad = async (req, res, next) => {
  const { id } = req.usuario; // El ID del usuario que envía la solicitud
  const { amigoId } = req.body; // El ID del amigo

  try {
    const usuario = await Usuario.findById(id);
    const amigo = await Usuario.findById(amigoId);

    // Verifica si ambos usuarios existen
    if (!usuario || !amigo) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Verifica si ya son amigos
    const sonAmigos = usuario.amigos.includes(amigoId);

    if (!sonAmigos) {
      return res.status(403).json({ mensaje: 'No son amigos' });
    }

    next(); // Si son amigos, permite continuar
  } catch (error) {
    console.error('Error al verificar amistad:', error);
    return res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = { verificarAmistad };
