const db = require('../config/db.js');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    try {

        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const typeUser = req.body.typeUser

        if (name === "" || email === "") {
            return res.status(400).json({ message: "Nome e email não podem estar vazio" })
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%]).{6,12}$/;
        if (!password || !passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: "A senha deve ter de 6 a 12 caracteres, contendo pelo menos uma letra maiúscula, um número e um caractere especial (@, #, $, %)." 
            });
        }

        const saltRound = 10;
        const hashPassword = await bcrypt.hash(password, saltRound); // Hashed from password

        const [result] = await db.query("INSERT INTO usuario (name, email, password, ativo, typeUser) VALUES (?, ?, ?, ?, ?)", [name, email, hashPassword, 1, typeUser]);

        if (result.affectedRows === 0)
            return res.status(400).json({ message: "Não foi possível inserir o usuário!" });

        return res.status(201).json({ message: "Usuário cadastrado com sucesso!" })

    } catch (error) {
        return res.status(500).json({ message: "Erro ao criar usuário", error: error.message })
    }
}

const editUser = async (req, res) => {
    try {
        const id = req.body.id;
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const ativo = req.body.ativo;
        const typeUser = req.body.typeUser;

        if (!id) {
            return res.status(400).json({ messgae: "ID é obrigatório!" })
        }

        if (name === "" || email === "") {
            return res.status(400).json({ message: "Nome e email são obrigatórios!" })
        }

        let query = "UPDATE usuario SET name = ?, email = ?, ativo = ?, typeUser = ?"
        let queryParams = [name, email, ativo, typeUser]

        if (password && password !== "") {
            const saltRound = 10;
            const hashPassword = await bcrypt.hash(password, saltRound)

            query += ", password = ?";
            queryParams.push(hashPassword);
        }

        query += " WHERE id = ?";
        queryParams.push(id);

        const [result] = await db.query(query, queryParams);

        if (result.affectedRows === 0)
            return res.status(400).json({ message: "Usuário não encontrado ou nenhuma alteração foi feita!" })
        return res.status(200).json({ message: "Usuário atualizado com sucesso!" })
    } catch (error) {
        return res.status(500).json({ message: "Erro ao editar usuário" })
    }
}

const editEmailAndPassword = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

module.exports = {
    createUser,
    editUser
}