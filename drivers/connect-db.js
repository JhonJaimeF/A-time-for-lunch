const mongoose = require('mongoose')

const URI = "mongodb://localhost:27017"

mongoose.set('strictQuery', false)

mongoose.connect(URI)
  .then(()=>console.log('Connect DB Success'))
  .catch((err)=>console.log('Connect DB Fail ' + err))

module.exports = mongoose