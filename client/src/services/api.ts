//src/services/api.ts
import { Order } from '@/models/types';
import axios, { AxiosResponse } from 'axios';

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
  }
  return config;
});

// Definir uma função para obter os detalhes do usuário
export async function getUserDetails(id: number | undefined) {
  try {
    const response = await api.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
// Generic API service
const apiService = {
  async getAll(tableName: string) {
    const response = await api.get(`/${tableName}`);
    return response.data;
  },
  async getById(tableName: string, id: number) {
    const response = await api.get(`/${tableName}/${id}`);
    return response.data;
  },
  async create(tableName: string, record: any) {
    const response = await api.post(`/${tableName}`, record);
    return response.data;
  },
  async update(tableName: string, id: number, record: any) {
    const response = await api.put(`/${tableName}/${id}`, record);
    return response.data;
  },
  async delete(tableName: string, id: number) {
    const response = await api.delete(`/${tableName}/${id}`);
    return response.data;
  },
};

export default apiService;