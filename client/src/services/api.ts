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

// Definir função para obter pedidos por status
export const getAllOrders = async (): Promise<Order[]> => {
  const response: AxiosResponse<Order[]> = await api.get('/order');

  if (response.status !== 200) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.data;
};

export async function updateOrderStatus(orderId: number, newStatus: string): Promise<Order> {
  try {
    const response = await api.patch(`/order/${orderId}`, {
      status: newStatus,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


// Definir outras funções de chamada de API aqui...