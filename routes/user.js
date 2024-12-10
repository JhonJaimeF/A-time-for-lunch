const routes = require('express').Router();

const {
    createUser,
    listUsers,
    updateUser,
    deleteUser,
    findUserById
} = require('./../controller/controller-user');
const verifyToken = require('./validate-token');

routes.get('/', listUsers);
routes.get('/:id', findUserById);
routes.post('/',  createUser);
routes.put('/:id', verifyToken, updateUser);
routes.delete('/:id', verifyToken, deleteUser);

module.exports = routes;
