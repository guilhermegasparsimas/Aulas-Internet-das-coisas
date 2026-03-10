import { api } from "./api.js";

export const loginApi = async (form) => {
    try {
       const response = await api.posy('/login', form)
       return response.data;
    } catch (error) {
        console.error("Erro ao realizar o login!", error.response.data || error.message.data)
    }
}