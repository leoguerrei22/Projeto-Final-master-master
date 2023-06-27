import apiService, { createReservation } from '@/services/api';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

interface ReservationFormProps {
  onSuccess: () => void;
}

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface UserModalProps {
  onClose: () => void;
  onSelect: (userId: string) => void;
}

const UserModal: React.FC<UserModalProps> = ({ onClose, onSelect }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const userList = await apiService.getAll('user');
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredUsers(users);
    } else {
      const searchText = searchTerm.toLowerCase();
      const newFilteredUsers = users.filter((user: User) => {
        return (
          (user.id && user.id.toString().toLowerCase().includes(searchText)) ||
          (user.name && user.name.toLowerCase().includes(searchText)) ||
          (user.email && user.email.toLowerCase().includes(searchText)) ||
          (user.phone && user.phone.toLowerCase().includes(searchText))
        );
      });
      setFilteredUsers(newFilteredUsers);
    }
  }, [searchTerm, users]);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded w-full max-w-2xl mx-auto">
        <button className="absolute top-2 right-2 bg-gray-200 text-black rounded-full w-6 h-6 flex items-center justify-center" onClick={onClose}>X</button>
        <input className='bg-white rounded-lg p-1 w-full border border-solid border-gray-300 shadow-md mb-2' type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar usuário" />

        <div className="h-96 overflow-y-auto">
          {filteredUsers.map(user => (
            <div className='bg-white rounded-lg p-6 border border-solid border-gray-300 shadow-md mb-4' key={user.id}>
              <p> Nome: {user.name}</p>
              <p> Telefone: {user.phone}</p>
              <p> Email: {user.email}</p>
              <button className='mt-2' onClick={() => onSelect(user.id)}>Selecionar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ReservationForm: React.FC<ReservationFormProps> = ({ onSuccess }) => {
  const [userId, setUserId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [quantity, setQuantity] = useState<number>();
  const [hour, setHour] = useState<string>('');
  const [observations, setObservations] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dateTime = new Date(`${date}T${hour}`).toISOString();
    try {
        const tableId = await getAvailableTable(date, hour);
        if (tableId) {
          const data = {
            userId,
            date: dateTime,
            hour,
            quantity,
            observations,
            status,
            tableId, // Adiciona o ID da mesa aos dados da reserva
          };
          await createReservation(data);
          setShowAlert(true); // Exibe o alerta quando a reserva for concluída
          onSuccess();
        } else {
          throw new Error("Não há mesas disponíveis nessa data e hora.");
        }
      } catch (err) {
        console.error(err);
      }
    };
  
    const getAvailableTable = async (date: string, hour: string) => {
      const response = await axios.get(
        `http://localhost:8000/reservation/available-tables?date=${date}&hour=${hour}`
      );
      if (response.data && response.data.length > 0) {
        return response.data[0].id;
      } else {
        return null;
      }
    };
  return (
    <div>
      {modalOpen && <UserModal onClose={() => setModalOpen(false)} onSelect={selectedUserId => {
        setUserId(selectedUserId);
        setModalOpen(false);
      }} />}
            {showAlert && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded w-full max-w-2xl mx-auto">
            <h3 className="text-lg font-medium text-gray-900">Reserva concluída com sucesso!</h3>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowAlert(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <label className="my-2">
            User ID:
            <input type="text" value={userId} onChange={e => setUserId(e.target.value)} className="border p-2" />
          </label>
          <button type="button" onClick={() => setModalOpen(true)} className="bg-blue-500 text-white p-2 rounded">Pesquisar</button>
        </div>
        <label className="my-2">
          Dia:
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="p-2 border rounded" />
        </label>
        <label className="my-2">
          Hora:
          <input type="time" value={hour} onChange={e => setHour(e.target.value)} className="p-2 border rounded" />
        </label>
        <label className="my-2">
          Nº de pessoas:
          <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="p-2 border rounded" />
        </label>
        <label className="my-2">
          Observações:
          <input type="text" value={observations} onChange={e => setObservations(e.target.value)} className="p-2 border rounded" />
        </label>
        <label className="my-2">
          Status:
          <select value={status} onChange={e => setStatus(e.target.value)} className="p-2 border rounded">
            <option value="">Selecione o status</option>
            <option value="pendente">Pendente</option>
            <option value="confirmado">Confirmado</option>
            <option value="concluido">Concluído</option>
          </select>
        </label>
        <button type="submit" className="p-2 border rounded bg-blue-500 text-white">Create Reservation</button>
      </form>
    </div>
  );
};

export default ReservationForm;
