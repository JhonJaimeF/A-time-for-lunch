const express = require('express');
const cors= require('cors');

const app = express();

// Conectar a la base de datos
require('./drivers/connect-db');


app.set('PORT', process.env.PORT || 3005);

// Configurar middlewares
app.use(cors());
app.use(express.json());
//app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Configurar rutas
//app.use('/shops', require('./routes/shop'));
app.use('/dineros', require('./routes/dinero'));

// Iniciar el servidor (solo una vez)
app.listen(app.get('PORT'), () => {
    console.log(`Server Ready at port ${app.get('PORT')}`);
});
