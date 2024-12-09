const mongoose = require('mongoose');
const { type } = require('os');


const { Schema } = mongoose;

const schemaReservacion= new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    nameCliente: {
        type: String,
        required: true
    },
    idCliente: {
        type: String,
        required: true
    },
    mesa: {
        type: String,
        required: true
    },
    fechaReservacion: {
        type: Date,
        required: true
    },numeroPersonas: {
        type: Number,
        required: true,
        min: 1
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        require: true

    }
})

module.exports = mongoose.model('reservacion', schemaReservacion);
