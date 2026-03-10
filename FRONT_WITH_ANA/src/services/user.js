import { api } from "/src/services/api.js";

export const cadastroApi = async (form) => {
    try {
        const response = await api.post('/usuario', form);
        return response.data; 
    } catch (error) {
        console.error("Ocorreu um erro ao cadastrar o usuário.", error);
        return { 
            success: false, 
            message: error.response?.data?.message || "Erro desconhecido ao cadastrar" 
        };
    }
};