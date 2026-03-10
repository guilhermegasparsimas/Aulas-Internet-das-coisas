import { useState } from 'react';
import { cadastroApi } from '../services/user.js';

const Cadastro = () => {

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        typeUser: 1
    })
    const handleSubmit = async (e) => { // Função de salvar
        e.preventDefault();
        try {
            const response = await cadastroApi(form);
            if (response?.success)
                alert('Usuario criado com sucesso!')
        } catch (error) {
            return console.error(error)
        }
    }

    return (
        <>
            <div className='container'>

                <h1>Cadastro!</h1>

                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="name" className='form-label'>Nome</label>
                        <input type="name" className='form-control' id="name" placeholder='Nome completo' value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" placeholder="email@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Senha</label>
                        <input type="password" className="form-control" id="password" placeholder='********' value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="tipo_usuario" className='form-label'>Tipo de usuário</label>
                        <select name="tipo_usuario" id="tipo_usuario" className='form-select' value={form.typeUser} onChange={(e) => setForm({ ...form, typeUser: e.target.value })}>
                            <option value={1}>Usuário normal</option>
                            <option value={2}>Admin</option>
                        </select>
                    </div>
                    <button className='btn btn-danger' type='submit'>Salvar cadastro</button>
                </form>
            </div>

        </>
    )
}

export default Cadastro;