const editUser = async (req, res) => {
    try {
        const id = req.params.id; // Supondo que o ID venha pela URL (ex: /users/:id)
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const typeUser = req.body.typeUser;

        if(!id){
            return res.status(400).json({message: "O ID do usuário é obrigatório"})
        }

        if(name === "" || email === ""){
            return res.status(400).json({message: "Nome e email não podem estar vazio"})
        }

        // Montamos a query base (sem a senha inicialmente)
        let query = "UPDATE usuario SET name = ?, email = ?, typeUser = ?";
        let queryParams = [name, email, typeUser];

        // Se uma nova senha for enviada, fazemos o hash e adicionamos na query
        if(password && password !== ""){
            const saltRound = 10;
            const hashPassword = await bcrypt.hash(password, saltRound);
            
            query += ", password = ?";
            queryParams.push(hashPassword);
        }

        // Finalizamos a query com a condição do ID
        query += " WHERE id = ?";
        queryParams.push(id);

        const [result] = await db.query(query, queryParams);

        if(result.affectedRows === 0)
            return res.status(400).json({message: "Usuário não encontrado ou nenhuma alteração foi feita!"});
         
        return res.status(200).json({message: "Usuário atualizado com sucesso!"})
        
    } catch (error) {
        return res.status(500).json({message: "Erro ao editar usuário", error: error.message})
    }
}