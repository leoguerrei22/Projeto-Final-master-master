// services/api.ts

import axios from 'axios';

// Configuração do axios
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Definir uma função para obter o token de autenticação do local storage
function getAuthToken() {
  return localStorage.getItem('authToken');
}
// Adicionar um interceptor para definir o cabeçalho de autorização com o token JWT
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(token)
  }
  return config;
});

// Definir uma função para obter os detalhes do usuário
export async function getUserDetails(id: number | undefined) {
  try {
    const response = await api.get(`/user/${id}`);
    console.log(id);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Definir outras funções de chamada de API aqui...
