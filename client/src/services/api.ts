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

// Adicione o pedido a uma reserva existente
export async function addOrderToReservation(reservationId: number, order: any, products: any[]) {
  const response = await api.post(`/reservation/${reservationId}/order`, { order, products });
  return response.data;
}

// Gere a fatura para uma reserva
export async function generateInvoiceForReservation(reservationId: number, invoice: any) {
  const response = await api.post(`/reservation/${reservationId}/invoice`, invoice);
  return response.data;
}

// Obtenha mesas disponíveis
export async function getAvailableTables(date: string, hour: string) {
  const response = await api.get(`/tables/available?date=${date}&hour=${hour}`);
  return response.data;
}

// Crie uma nova reserva
export async function createReservation(data: any) {
  const response = await api.post(`/reservation`, data);
  return response.data;
}
// Lista de invoices
export async function getAllInvoices() {
  const response = await api.get('/invoice');
  return response.data;
}

// lista de reservas

export async function getReservations() {
    const response = await api.get('/reservation');
    return response.data;
}
// lista de order
export async function getAllOrder() {
  const response = await api.get('/order');
  return response.data;
}

// Obtenha um invoice específico pelo ID
export async function getInvoice(invoiceId: number) {
  const response = await api.get(`/invoice/${invoiceId}`);
  return response.data;
}

// enviar email
export async function sendInvoiceEmail(invoiceId: number, email: string) {
  const response = await api.post(`/invoice/${invoiceId}/email`, { email });
  return response.data;
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
    console.log(`Creating new ${tableName}:`, record); // Log the record
    const response = await api.post(`/${tableName}`, record);
    console.log(`Response from server:`, response.data); // Log the response
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