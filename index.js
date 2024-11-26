const express = require('express');
const cors= require('cors');
const express = require('express')
const authRoutes = require('./routes/auth.js')
const dashboardRoutes = require('./routes/dashboard')
const verifyToken = require('./routes/validate-token')
const cors = require('cors')
require('dotenv').config()


const app = express();

// Conectar a la base de datos
require('./drivers/connect-db');


app.set('PORT', process.env.PORT || 3030);

// Configurar middlewares
app.use(cors());
app.use(express.json());


// Configurar rutas
app.use('/reservaciones', require('./routes/reservacion'));


app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/user', authRoutes)
app.use('/api/dashboard', verifyToken, dashboardRoutes)


app.get('/', (req, res) => {
  res.json({ mensaje: 'My Auth Api Rest' })
})

// Iniciar el servidor (solo una vez)
app.listen(app.get('PORT'), () => {
    console.log(`Server Ready at port ${app.get('PORT')}`);
});
