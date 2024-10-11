const Dinero = require('./../models/dinero'); // Cambio a mayúscula inicial para seguir las convenciones


module.exports = {
  findAll: async (req, res) => {
    return res.status(200).json({ state: true, data: 'naaa' });
  },

  save: async (req, res) => {
    const dinero = new Dinero(req.body); // Instancia correcta del modelo
    const { id } = req.params;

    try {
      // Buscar la tienda por su ID
      
        
        const result = await dinero.save();

        // Enviar respuesta exitosa con el instrumento guardado
        return res.status(201).json({ state: true, data: result });
      
    } catch (err) {
      return res.status(500).json({ state: false, error: err });
    }
  }
};
