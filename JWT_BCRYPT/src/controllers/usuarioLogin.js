const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const LoginUser = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if(!email || !password)
            return res.status(400).json({message: "Email e senha são obrigatórios!"});  

        const [users] = await db.query("SELECT * FROM usuario WHERE email = ?", [email]);

        if(users.length === 0)
            return res.status(400).json("Usuário não encontrado!");
        
        const user = users[0];
        if(user.ativo === 0)
            return res.status(400).json({message: "Conta desativada. Entre em contato com o suporte!"});

        const passwordValid = await bcrypt.compare(password, user.password);

        if(!passwordValid)
            return res.status(401).json({message: "Senha incorreta!"});
        
        const payload = {
            id: user.id,
            email: user.email,
            typeUser: user.typeUser

        };
        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secretKey, { expiresIn: '2h' });

        delete user.password;

        return res.status(200).json({message: "Login efetuado!", token: token, user: user});
    } catch (error) {
        return res.status(500).json({message: "Erro interno do servidor!"})
    }
};

module.exports = { LoginUser };