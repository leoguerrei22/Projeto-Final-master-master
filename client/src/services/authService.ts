// services/authService.ts
import axios from 'axios';
import { AuthResponse } from '@/models/types';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await axios.post('http://localhost:8000/user/login', {
    email,
    password
  });
  
  // Verifique se o token está presente na resposta e tem as propriedades necessárias
  if (response.data.token && response.data.token.id && response.data.token.role && response.data.token.token) {
    // Armazene o token no localStorage
    localStorage.setItem('authToken', response.data.token.token);
    localStorage.setItem('authRole', response.data.token.role);
    localStorage.setItem('authId', response.data.token.id);
    return response.data;
  } else {
    throw new Error('Failed to login');
  }
}

// Definir um interceptor que adiciona o token de autenticação aos cabeçalhos
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function register(
  name: string,
  email: string,
  password: string,
  phone: string | null,
  role: number
): Promise<AuthResponse> {
  try {
    const response = await axios.post('http://localhost:8000/user/register', {
      name,
      email,
      password,
      phone,
      role
    });
    return response.data; // assume que data é do tipo AuthResponse
  } catch (error) {
    console.error(error);
    throw new Error('Failed to register');
  }
}




