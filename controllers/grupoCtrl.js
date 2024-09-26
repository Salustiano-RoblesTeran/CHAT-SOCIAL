const Chat = require('../models/chat');
const Mensaje = require('../models/mensaje');


// Obtener todos los grupos de un usuario autenticado
const obtenerGrupos = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const grupos = await Grupo.find({ participantes: usuarioId }).populate('participantes', 'nombre correo');
    res.json(grupos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener los grupos', error });
  }
};

// Crear un nuevo grupo
const crearGrupo = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { nombre, descripcion } = req.body;

    const nuevoGrupo = new Grupo({
      nombre,
      descripcion,
      administrador: usuarioId,
      participantes: [usuarioId],
    });

    await nuevoGrupo.save();
    res.json(nuevoGrupo);
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear el grupo', error });
  }
};

// Añadir participante a un grupo
const addParticipante = async (req, res) => {
  try {
    const { grupoId } = req.params;
    const { participanteId } = req.body;

    const grupo = await Grupo.findById(grupoId);
    if (!grupo) return res.status(404).json({ msg: 'Grupo no encontrado' });

    // Verificar que el usuario no esté ya en el grupo
    if (grupo.participantes.includes(participanteId)) {
      return res.status(400).json({ msg: 'El usuario ya está en el grupo' });
    }

    grupo.participantes.push(participanteId);
    await grupo.save();

    res.json(grupo);
  } catch (error) {
    res.status(500).json({ msg: 'Error al añadir participante', error });
  }
};

// Enviar mensaje en un grupo
const enviarMensajeGrupo = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { grupoId, contenido } = req.body;

    const nuevoMensaje = new Mensaje({
      emisor: usuarioId,
      contenido,
      grupo: grupoId,
    });

    await nuevoMensaje.save();
    await Grupo.findByIdAndUpdate(grupoId, { $push: { mensajes: nuevoMensaje._id } });

    res.json(nuevoMensaje);
  } catch (error) {
    res.status(500).json({ msg: 'Error al enviar el mensaje', error });
  }
};

module.exports = {
  obtenerGrupos,
  crearGrupo,
  addParticipante,
  enviarMensajeGrupo,
};
