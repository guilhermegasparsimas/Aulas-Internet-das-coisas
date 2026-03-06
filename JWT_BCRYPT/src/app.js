const express = require('express'); // import express from 'express'; - Duas formas diferentes de importação
const cors = require('cors');
const app = express();
const routerUser = require('./routes/usuario.js');
const routerLogin = require('./routes/login.js');

app.use(cors());
app.use(express.json());
app.use(routerUser);
app.use(routerLogin);

app.get('/', (req, res) => {
  res.send('Hello World!')
});



module.exports = app;