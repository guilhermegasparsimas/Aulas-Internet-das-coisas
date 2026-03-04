const db = require('../config/db.js');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    try {

        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const typeUser = req.body.typeUser

        if(name === "" || email === ""){
            return res.status(400).json({message: "Nome e email não podem estar vazio"})
        }

        const saltRound = 10;
        const hashPassword = await bcrypt.hash(password, saltRound); // Hashed from password

        const [result] = await db.query("INSERT INTO usuario (name, email, password, ativo, typeUser) VALUES (?, ?, ?, ?, ?)", [name, email, hashPassword, 1, typeUser]);

        if(result.affectedRows === o)
            return res.status(400).json({message: "Não foi possível inserir o usuário!"});
         
        return res.status(201).json({message: "Usuário cadastrado com sucesso!"})
        
    } catch (error) {
        return res.status(500).json({message: "Erro ao criar usuário", error: error.message})
    }
}

module.exports = {
    createUser,
    db
}