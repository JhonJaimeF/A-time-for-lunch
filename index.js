const express = require('express')
const cors= require('cors')

const app = express()


// Connect DB
require("./config/connectDB")

//const swaggerUI = require('swagger-ui-express')
//const swaggerSpec = require('./swagger')

app.set('PORT',process.env.PORT || 3000 )
app.use(express.json())
app.use(cors())

//app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  


//middleware
app.use('/supplier',require('./routes/supplier'))
app.use('/product',require('./routes/products'))
app.use('/inventory',require('./routes/inventory'))

app.listen(app.get('PORT'), () => console.log(`Server Ready at http://localhost:${app.get('PORT')}`))
