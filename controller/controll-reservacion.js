const Reservacion = require('./../models/reservacion');

module.exports = {
  // Crear una nueva reservación
  createReservacion: async (req, res) => {
    const { id, nameCliente, idCliente, mesa, fechaReservacion, numeroPersonas, estadoReservacion } = req.body;

    try {
      const reservacion = await Reservacion.create({
        id,
        nameCliente,
        idCliente,
        mesa,
        fechaReservacion,
        numeroPersonas,
        estadoReservacion,
        
      });
      return res.status(201).json({ state: true, data: reservacion });
    } catch (error) {
      return res.status(400).json({ state: false, message: 'Error creating new reservacion' });
    }
  },

  // Listar todas las reservaciones
  listReservaciones: async (req, res) => {
    try {
      const reservaciones = await Reservacion.find();
      return res.status(200).json({ state: true, data: reservaciones });
    } catch (error) {
      return res.status(500).json({ state: false, message: error });
    }
  },

  // Actualizar una reservación por su ID
  updateReservacion: async (req, res) => {
    const { id } = req.params;
    const { nameCliente, idCliente, mesa, fechaReservacion, numeroPersonas, estadoReservacion } = req.body;

    try {
      const reservacion = await Reservacion.findByIdAndUpdate(id, {
        nameCliente,
        idCliente,
        mesa,
        fechaReservacion,
        numeroPersonas,
        estadoReservacion
        
      }, { new: true });
      if (reservacion) {
        return res.status(200).json({ state: true, data: reservacion });
      } else {
        return res.status(404).json({ state: false, message: 'Reservacion not found' });
      }
    } catch (error) {
      return res.status(400).json({ state: false, message: error });
    }
  },

  // Eliminar una reservación por su ID
  deleteReservacion: async (req, res) => {
    const { id } = req.params;

    try {
      const reservacion = await Reservacion.findByIdAndDelete(id);
      if (reservacion) {
        return res.status(200).json({ state: true, message: 'Reservacion deleted' });
      } else {
        return res.status(404).json({ state: false, message: 'Reservacion not found' });
      }
    } catch (error) {
      return res.status(400).json({ state: false, message: error });
    }
  },

  // Encontrar una reservación por su ID
  findById: async (req, res) => {
    const { id } = req.params;

    try {
      const reservacion = await Reservacion.findById(id);
      if (reservacion) {
        return res.status(200).json({ state: true, data: reservacion });
      }
      return res.status(404).json({ state: false, message: 'Reservacion not found' });
    } catch (error) {
      return res.status(500).json({ state: false, message: error });
    }
  }
};
