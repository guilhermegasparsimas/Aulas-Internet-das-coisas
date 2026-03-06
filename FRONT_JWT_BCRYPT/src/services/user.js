import { useEffect, useState } from "react";
// Lembre-se de criar/renomear este arquivo de serviços para apontar para as rotas da sua API de usuários
import { 
  getUsers, 
  addUser, 
  editUser, 
  deleteUser 
} from "../services/users";

import ModalUser from "./ModalUser";
import EditarUser from "./EditarUser"; // Este será o seu formulário de usuário

const User = () => {
  // Lista que vem do backend (array de usuários)  
  const [users, setUsers] = useState([]);  
  
  // Controle do modal  
  const [modal, setModal] = useState(false);  
  
  // Usuário escolhido para editar (quando modo === "edit")  
  const [userSelecionado, setUserSelecionado] = useState(null);  
  
  // Define se o modal está em modo adicionar ou editar  
  const [modo, setModo] = useState("edit"); // "add" | "edit"  
  
  // Estados do formulário (inputs) adaptados para o seu banco de dados
  const [nameEdit, setNameEdit] = useState("");  
  const [emailEdit, setEmailEdit] = useState("");  
  const [typeUserEdit, setTypeUserEdit] = useState("");
  const [passwordEdit, setPasswordEdit] = useState(""); // Adicionado para a criação de senha
  
  /** * Busca usuários no backend e guarda no state.  
   */  
  const carregarUsers = async () => {  
    try {  
      const lista = await getUsers();  
      setUsers(lista); 
    } catch (error) {  
      console.log("Erro ao carregar usuários:", error);  
      setUsers([]); // garante que a tabela não quebre  
    }  
  };  
  
  // Carrega 1 vez quando o componente monta  
  useEffect(() => {  
    carregarUsers();  
  }, []);  
  
  /** * Abre modal no modo "edit" e preenche os inputs com o usuário clicado  
   */  
  const abrirModalEditar = (user) => {  
    setModo("edit");  
    setUserSelecionado(user);  
  
    // Preenche form com os dados do usuário  
    setNameEdit(user.name ?? "");  
    setEmailEdit(user.email ?? "");  
    setTypeUserEdit(user.typeUser ?? "");  
    setPasswordEdit(""); // Deixamos a senha em branco na edição por segurança
  
    setModal(true);  
  };  
  
  /** * Abre modal no modo "add" com inputs vazios  
   */  
  const abrirModalAdicionar = () => {  
    setModo("add");  
    setUserSelecionado(null);  
  
    setNameEdit("");  
    setEmailEdit("");  
    setTypeUserEdit("");  
    setPasswordEdit("");
  
    setModal(true);  
  };  
  
  const fecharModal = () => {  
    setModal(false);  
    setUserSelecionado(null);  
  };  
  
  /** * Salvar faz duas coisas dependendo do modo:  
   * - add  -> POST  
   * - edit -> PUT / PATCH  
   */  
  const salvar = async () => {  
    try {  
      // Monta o payload exatamente como o nosso backend (Node.js) espera!
      const payload = {  
        name: nameEdit,  
        email: emailEdit,  
        typeUser: typeUserEdit,
        password: passwordEdit,
        ativo: 1 // Mandando ativo por padrão, como fizemos no back-end
      };  
  
      if (modo === "add") {  
        const ok = await addUser(payload);  
        if (ok === "") {  
          alert("Não foi possível adicionar o usuário");  
          return false;  
        }  
        alert("Usuário adicionado com sucesso!");
      } else {  
        // modo edit: precisa ter um usuário selecionado  
        if (!userSelecionado?.id) {  
          alert("Nenhum usuário selecionado para editar");  
          return false;  
        }  
        
        // Adicionamos o ID no payload para a sua rota editUser do Node.js funcionar
        payload.id = userSelecionado.id;

        const ok = await editUser(userSelecionado.id, payload);  
        if (ok === "") {  
          alert("Não foi possível editar o usuário");  
          return false;  
        }
        alert("Você editou o usuário com sucesso!");  
      }  
  
      // Recarregamos a lista do backend
      await carregarUsers();  
  
      fecharModal();  
    } catch (e) {  
      alert("Erro ao salvar: " + e);  
    }  
  };  
 
  const remover = async (id) => {
    try {
      const excluido = await deleteUser(id);
      if(excluido === ""){
        alert("Não excluído!");
      return false;
      }
      alert("Excluído com sucesso!");
      carregarUsers();
    } catch (error) {
      console.log("Erro", error);
    }
  }

  return (
   <div className="container">  
      <h2>Gestão de Usuários</h2>  
  
      <button className="btn btn-warning" onClick={abrirModalAdicionar}>  
        Adicionar Usuário
      </button>  
  
      <br /><br />  
  
      <table className="table table-bordered">  
        <thead>  
          <tr>  
            <th>Nome</th>  
            <th>Email</th>  
            <th>Tipo (Permissão)</th>  
            <th>Ações</th>  
          </tr>  
        </thead>  
  
        <tbody>  
          {users && users.map((u) => (  
            <tr key={u.id}>  
              <td>{u.name}</td>  
              <td>{u.email}</td>  
              <td>{u.typeUser}</td>  
              <td>  
                <button className="btn btn-primary" onClick={() => abrirModalEditar(u)}>  
                  Editar  
                </button>  
                &nbsp;  
                <button className="btn btn-danger" onClick={() => remover(u.id)}>  
                  Excluir  
                </button>  
              </td>  
            </tr>  
          ))}  
        </tbody>  
      </table>  
  
      <ModalUser  
        open={modal}  
        onClose={fecharModal}  
        onSave={salvar}  
        title={modo === "add" ? "Adicionar Usuário" : (userSelecionado?.name ?? "Editar Usuário")}  
      >  
        <EditarUser  
          name={nameEdit}  
          email={emailEdit}  
          typeUser={typeUserEdit} 
          password={passwordEdit} 
          onChangeName={setNameEdit}  
          onChangeEmail={setEmailEdit}  
          onChangeTypeUser={setTypeUserEdit}  
          onChangePassword={setPasswordEdit}
        />  
      </ModalUser>  
    </div>
  );
};

export default User;