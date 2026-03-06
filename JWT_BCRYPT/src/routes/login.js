const express = require('express');
const routerLogin = express.Router();
const { login } = require('../controllers/loginController');

routerLogin.post('/login', login)

module.exports = login;