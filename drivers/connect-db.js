const mongoose = require('mongoose')

const URI = "mongodb+srv://jhonsalazar01:gYNE3RqRJfNpRi0y@final.0ux8x.mongodb.net/?retryWrites=true&w=majority&appName=Final;"

mongoose.set('strictQuery', false)

mongoose.connect(URI)
  .then(()=>console.log('Connect DB Success'))
  .catch((err)=>console.log('Connect DB Fail ' + err))

module.exports = mongoose