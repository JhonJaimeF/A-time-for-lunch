const Dinero = require('./../models/dinero');

module.exports = {
  // Obtener todas las entradas de dinero
  findAll: async (req, res) => {
    try {
      const dinero = await Dinero.find();  // Obtiene todas las entradas en la colección 'dinero'
      return res.status(200).json({ state: true, data: dinero });
    } catch (err) {
      return res.status(500).json({ state: false, error: err.message });
    }
  },

  // Guardar una nueva entrada de dinero
  save: async (req, res) => {
    const { id, description, value } = req.body;  // Extraer los campos del cuerpo de la solicitud
    const dinero = new Dinero({ id,description, value });

    try {
      // Guardar la nueva entrada en la base de datos
      const result = await dinero.save();

      // Enviar respuesta exitosa con los datos guardados
      return res.status(201).json({ state: true, data: result });
    } catch (err) {
      return res.status(500).json({ state: false, error: err.message });
    }
  },

  // Actualizar una entrada de dinero por su ID
  update: async (req, res) => {
    const { id } = req.params;
    const { description, value } = req.body;

    try {
      // Actualiza la entrada de dinero por su ID
      const updatedDinero = await Dinero.findByIdAndUpdate(id, { description, value }, { new: true });
      
      if (updatedDinero) {
        return res.status(200).json({ state: true, data: updatedDinero });
      } else {
        return res.status(404).json({ state: false, message: 'Dinero no encontrado' });
      }
    } catch (err) {
      return res.status(500).json({ state: false, error: err.message });
    }
  },

  // Eliminar una entrada de dinero por su ID
  deleteD: async (req, res) => {
    const { id } = req.params;

    try {
      const deletedDinero = await Dinero.findByIdAndDelete(id);

      if (deletedDinero) {
        return res.status(200).json({ state: true, message: 'Entrada de dinero eliminada' });
      } else {
        return res.status(404).json({ state: false, message: 'Dinero no encontrado' });
      }
    } catch (err) {
      return res.status(500).json({ state: false, error: err.message });
    }
  },

  // Buscar una entrada de dinero por su ID
  findById: async (req, res) => {
    const { id } = req.params;

    try {
      const dinero = await Dinero.findById(id);
      
      if (dinero) {
        return res.status(200).json({ state: true, data: dinero });
      } else {
        return res.status(404).json({ state: false, message: 'Dinero no encontrado' });
      }
    } catch (err) {
      return res.status(500).json({ state: false, error: err.message });
    }
  }
};
