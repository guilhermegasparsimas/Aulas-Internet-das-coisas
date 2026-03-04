import { prismaClient } from "../../../prisma/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function getTodosOsUsuarios(req, res) {
  try {
    const usuarios = await prismaClient.usuario.findMany({
      select: { id: true, nome: true, email: true, tipo: true } 
    });
    return res.json(usuarios);
  } catch (e) {
    console.error("Erro em getTodosOsUsuarios:", e);
    return res.status(500).json({ error: "Erro ao buscar usuários" });
  }
}

export async function getUsuarioPorId(req, res) {
  try {
    const usuario = await prismaClient.usuario.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!usuario) return res.status(404).send("Usuário não existe!");
    
    const { senha, ...usuarioSemSenha } = usuario;
    return res.json(usuarioSemSenha);
  } catch (e) {
    console.error("Erro em getUsuarioPorId:", e);
    return res.status(500).json({ error: "Erro ao buscar usuário" });
  }
}

export async function criarUsuario(req, res) {
  try {
    console.log("Requisição recebida em /usuarios:", req.body);

    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Nome, email e senha são obrigatórios!" });
    }

    const tipoUsuario = tipo === "admin" ? "admin" : "normal"; 

    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    const usuario = await prismaClient.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        tipo: tipoUsuario, 
      },
    });

    const { senha: _, ...usuarioSemSenha } = usuario;

    const secret = process.env.JWT_SECRET || "chave_secreta_temporaria_para_desenvolvimento";
    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      secret,
      { expiresIn: "1d" } 
    );

    console.log("Usuário criado:", usuarioSemSenha);
    

    return res.status(201).json({
      usuario: usuarioSemSenha,
      token: token
    });

  } catch (error) {
    console.error("Erro ao criar usuário:", error);

    if (error.code === "P2002") {
      return res.status(400).json({ error: "Falha ao cadastrar usuário: Email já cadastrado!" });
    }

    return res.status(500).json({ error: "Erro inesperado no servidor" });
  }
}