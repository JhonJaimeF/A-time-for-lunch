const User = require('./../models/user');

module.exports = {
  // Crear un nuevo usuario
  createUser: async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const user = await User.create({
        name,
        email,
        password,
      });
      return res.status(201).json({ state: true, data: user });
    } catch (error) {
      return res.status(400).json({ state: false, message: 'Error creating new user' });
    }
  },

  // Listar todos los usuarios
  listUsers: async (req, res) => {
    try {
      const users = await User.find();
      return res.status(200).json({ state: true, data: users });
    } catch (error) {
      return res.status(500).json({ state: false, message: error });
    }
  },

  // Actualizar un usuario
  updateUser: async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
      const user = await User.findByIdAndUpdate(id, {
        name,
        email,
        password,
      }, { new: true });
      
      if (user) {
        return res.status(200).json({ state: true, data: user });
      } else {
        return res.status(404).json({ state: false, message: 'User not found' });
      }
    } catch (error) {
      return res.status(400).json({ state: false, message: error });
    }
  },

  // Eliminar un usuario por su ID
  deleteUser: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findByIdAndDelete(id);
      if (user) {
        return res.status(200).json({ state: true, message: 'User deleted' });
      } else {
        return res.status(404).json({ state: false, message: 'User not found' });
      }
    } catch (error) {
      return res.status(400).json({ state: false, message: error });
    }
  },

  // Encontrar un usuario por su ID
  findUserById: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findById(id);
      if (user) {
        return res.status(200).json({ state: true, data: user });
      }
      return res.status(404).json({ state: false, message: 'User not found' });
    } catch (error) {
      return res.status(500).json({ state: false, message: error });
    }
  }
};
