import React, { useState } from 'react';
import { loginApi } from '../services/login';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginApi(form);
            if(response.sucess) alert("Login realizado com sucesso!");

            // redirecionar para tela de cadastro
            navigate('/cadastro');
        } catch (error) {
            console.log("Erro ao realizar o login!");
            
        }
    }
  return (
    <>
        <div className='container-login'>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
            <label htmlFor="">Email</label>
            <input type="text" name="email" id="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
                </div>
                <div className="mb-3">
                    <label htmlFor="">Senha</label>
                    <input type="password" name='password' value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}/>
                </div>

                <button type='submit'>Entrar</button>
            </form>

        </div>
    </>
  )
}

export default Login;