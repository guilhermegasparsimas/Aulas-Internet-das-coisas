import {api} from "./api.js"

/**  
 * Busca lista de produtos no back-end.  
 * O back retorna: { message: string, data: Produto[] }  
 * Aqui devolvemos APENAS o array (data).  
 */  
export async function getProdutos() {  
    const response = await api.get("/produto");  
    if (response.status === 200) {  
        return response.data?.data ?? [];  
    }  
    return [];  
}  
  
/**  
 * Adiciona um produto (POST /produto)  
 * Espera receber { nome, descricao, valor }  
 */  
export async function adicionarProduto(produto) {  
    const response = await api.post("/produto", produto);  
    
    // back retorna 201 quando cria 
    let r = ""; 
    if (response.status === 201) {  
        r = response.message;  
    }  
    return r;  
}  
  
/**  
 * Edita um produto (PATCH /produto/:id)  
 */  
export async function editarProduto(id, produto) {  
    const response = await api.patch(`/produto/${id}`, produto);  
    
    let r = "";
    if (response.status === 200) {  
        r = response.message;  
    }  
    return r;  
}  
  
/**  
 * Exclui um produto (DELETE /produto/:id)  
 */  
export async function excluirProduto(id) {  
    const response = await api.delete(`/produto/${id}`);  
    
    if (response.status === 200) {  
        return true;  
    }  
    return false;  
}