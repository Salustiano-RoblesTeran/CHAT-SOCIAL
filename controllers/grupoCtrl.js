const Grupo = require('../models/grupo');
const MensajeGrupo = require('../models/mensajeGrupo');

// Función para crear un grupo
const crearGrupo = async (req, res) => {
  const { nombre } = req.body;
  const adminId = req.params.id; // Obtener el ID del admin desde los parámetros de la ruta

  try {
    const nuevoGrupo = new Grupo({
      nombre,
      administrador: adminId,
      miembros: [adminId] // El administrador se agrega como miembro
    });

    await nuevoGrupo.save();
    res.status(201).json(nuevoGrupo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear el grupo' });
  }
};

const agregarMiembro = async (req, res) => {
    const { id } = req.params; // ID del grupo
    const { adminId, miembroId } = req.body; // ID del administrador y del miembro a agregar
  
    try {
      // Buscar el grupo por ID
      const grupo = await Grupo.findById(id);
  
      // Verificar si el grupo existe
      if (!grupo) {
        return res.status(404).json({ msg: 'Grupo no encontrado' });
      }
  
      // Verificar si el adminId coincide con el administrador del grupo
      if (grupo.administrador.toString() !== adminId) {
        return res.status(403).json({ msg: 'No tienes permiso para agregar miembros' });
      }
  
      // Agregar el nuevo miembro al grupo
      grupo.miembros.push(miembroId);
      await grupo.save();
  
      res.status(200).json({ msg: 'Miembro agregado exitosamente', grupo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al agregar el miembro al grupo' });
    }
  };

// Función para enviar un mensaje al grupo
const enviarMensajeGrupo = async (req, res) => {
  const { id } = req.params; // ID del grupo
  const { mensaje, emisorId } = req.body; // Mensaje y emisorId desde el body

  try {
    // Verificar si el grupo existe
    const grupo = await Grupo.findById(id);

    if (!grupo) {
      return res.status(404).json({ msg: 'Grupo no encontrado' });
    }

    // Verificar si el usuario es miembro del grupo
    if (!grupo.miembros.includes(emisorId)) {
      return res.status(403).json({ msg: 'El emisor no es miembro de este grupo' });
    }

    // Guardar el mensaje
    const nuevoMensaje = new MensajeGrupo({
      grupo: id,
      emisor: emisorId,
      mensaje,
    });

    await nuevoMensaje.save();

    // Añadir el mensaje al grupo
    grupo.mensajes.push(nuevoMensaje._id);
    await grupo.save();

    res.status(201).json(nuevoMensaje);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al enviar el mensaje' });
  }
};

// Función para obtener los mensajes de un grupo
const obtenerChatGrupo = async (req, res) => {
  const { id } = req.params; // ID del grupo

  try {
    // Buscar el grupo por su ID y popular el campo de mensajes
    const grupo = await Grupo.findById(id).populate({
      path: 'mensajes',
      populate: {
        path: 'emisor', // Esto sirve para popular también el campo del emisor
        select: 'nombre correo' // Seleccionamos solo los campos de nombre y correo del emisor
      }
    });

    if (!grupo) {
      return res.status(404).json({ msg: 'Grupo no encontrado' });
    }

    // Devolver los mensajes del grupo
    res.json(grupo.mensajes);
  } catch (error) {
    console.error('Error al obtener los mensajes del grupo:', error);
    res.status(500).json({ msg: 'Error al obtener los mensajes del grupo' });
  }
};

module.exports = {
  crearGrupo,
  agregarMiembro,
  enviarMensajeGrupo,
  obtenerChatGrupo
};
