// RegisterModal.tsx
"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { useAppContext } from '@/context/AppContext';
import { login } from '@/services/authService'; // Import login function

interface Props {
  closeModal: () => void;
}

const RegisterModal: React.FC<Props> = ({ closeModal }) => {
  const { dispatch } = useAppContext();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/user/register', {
        name,
        email,
        password,
        phone,
      });

      dispatch({ type: 'REGISTER_SUCCESS', payload: response.data });
      
      // After successful registration, log in the user
      const loginResponse = await login(email, password);
      dispatch({ type: 'LOGIN_SUCCESS', payload: loginResponse.token });

      closeModal();
    } catch (error) {
      console.error(error);
      dispatch({ type: 'REGISTER_FAIL', payload: 'Registration failed' });
    }
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 opacity-75"></div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
          <div className="text-right">
            <button className="text-black bg-transparent hover:bg-gray-200 rounded-full p-1" onClick={closeModal}>X</button>
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Registrar</h3>
            <form onSubmit={handleSubmit}>
              <div className="mt-5">
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-black"
                  placeholder="Nome"
                />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mt-4 text-black" // added mt-4
                  placeholder="Email"
                />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mt-4 text-black" // added mt-4
                  placeholder="Senha"
                />
                <input
                  type="text"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mt-4 text-black" // added mt-4
                  placeholder="Telefone"
                />
              </div>
              <div className="mt-5">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
