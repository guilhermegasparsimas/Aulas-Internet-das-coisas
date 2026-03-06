const express = require('express');
const routerUser = express.Router();


const { createUser, editUser } = require('../controllers/usuarioController.js');
const { LoginUser } = require('../controllers/usuarioLogin.js');

routerUser.post('/usuario', createUser);
routerUser.put('/usuario/:id', editUser);
routerUser.post('/usuario/login', LoginUser);


module.exports = routerUser;
