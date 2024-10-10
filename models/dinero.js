const mongoose = require('mongoose')

const {Schema} = mongoose
const schemaDinero = new Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true
    },
  
    value:{
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
                return /\d+/.test(v);
            },
            //message: props=>
            }

    },
    
})

module.exports = mongoose.model('dinero', schemaDinero);