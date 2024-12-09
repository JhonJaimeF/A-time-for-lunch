const routes = require('express').Router()

const {
    createReservacion,
    listReservaciones,
    updateReservacion,
    deleteReservacion,
    findById
} = require('./../controller/controll-reservacion')
const verifyToken = require('./validate-token')

routes.get('/',listReservaciones)
routes.get('/:id',findById)
routes.post('/:id', verifyToken,createReservacion)
routes.put('/', updateReservacion)
routes.delete('/',deleteReservacion)

module.exports = routes