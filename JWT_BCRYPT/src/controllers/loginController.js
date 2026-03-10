const db = require('../config/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, password } = req.body; // forma de resumir código

        if(email === "" || password === "") return res.status(400).json({message: "Email ou senha inválidos!", success: false});
        
        const [result] = await db.query("SELECT id, name, email, password, typeUser FROM usuario WHERE email = ? AND ativo = 1 LIMIT 1", [email]);

        if(result.length === 0) return res.status(401).json({ message: "Credenciais inválidas!", success: false });
        
        const user = result[0];
        const ok = await bcrypt.compare(password, user.password);

        if(!ok) return res.status(401).json({message: "Credenciais inválidas!", success: false});

        const token = jwt.sign(
            {
                sub: user.id,
                typeUser: user.typeUser
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );
        return res.status(201).json({
            message: "LoginController !*",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }, success: true
        })
    } catch (error) {
        return res.status(500).json({message: "MUITA TRETA!", error: error.message})
    }
}

module.exports = {login};