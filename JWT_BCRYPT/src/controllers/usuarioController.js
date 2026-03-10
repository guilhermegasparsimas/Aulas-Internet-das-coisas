const createUser = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const typeUser = req.body.typeUser;

        if (name === "" || email === "") {
            // Adicionado success: false
            return res.status(400).json({ message: "Nome e email não podem estar vazios", success: false })
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%]).{6,12}$/;
        if (!password || !passwordRegex.test(password)) {
            // Adicionado success: false
            return res.status(400).json({ 
                message: "A senha deve ter de 6 a 12 caracteres, contendo pelo menos uma letra maiúscula, um número e um caractere especial (@, #, $, %).",
                success: false
            });
        }

        const saltRound = 10;
        const hashPassword = await bcrypt.hash(password, saltRound);

        const [result] = await db.query("INSERT INTO usuario (name, email, password, ativo, typeUser) VALUES (?, ?, ?, ?, ?)", [name, email, hashPassword, 1, typeUser]);

        if (result.affectedRows === 0)
            // Adicionado success: false
            return res.status(400).json({ message: "Não foi possível inserir o usuário!", success: false });

        // Adicionado success: true -> É isso que vai disparar o alerta lá no React!
        return res.status(201).json({ message: "Usuário cadastrado com sucesso!", success: true })

    } catch (error) {
        return res.status(500).json({ message: "Erro ao criar usuário", error: error.message, success: false })
    }
}