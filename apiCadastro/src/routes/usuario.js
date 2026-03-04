import { Router } from 'express';
const router = Router();

import { getTodosOsUsuarios, getUsuarioPorId, criarUsuario } from '../controllers/usuarioController';