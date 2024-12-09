const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.js');
const dashboardRoutes = require('./routes/dashboard');
const verifyToken = require('./routes/validate-token');
require('dotenv').config();
require('./drivers/connect-db');

const app = express();
app.set('PORT', process.env.PORT || 3030);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use('/reservaciones', require('./routes/reservacion'));
app.use('/api/user', authRoutes);
app.use('/api/dashboard', verifyToken, dashboardRoutes);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({ mensaje: 'My Auth Api Rest' });
});

// Iniciar el servidor
app.listen(app.get('PORT'), () => {
    console.log(`Server Ready at port ${app.get('PORT')}`);
});
