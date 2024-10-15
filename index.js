const express = require('express');
const cors= require('cors');

const app = express();

// Conectar a la base de datos
require('./drivers/connect-db');


app.set('PORT', process.env.PORT || 3030);

// Configurar middlewares
app.use(cors());
app.use(express.json());


// Configurar rutas
app.use('/reservaciones', require('./routes/reservacion'));


// Iniciar el servidor (solo una vez)
app.listen(app.get('PORT'), () => {
    console.log(`Server Ready at port ${app.get('PORT')}`);
});
