// src/components/ReservationModal.tsx
"use client"
import React, { useState } from 'react'
import axios from 'axios';

type Props = {
  closeModal: () => void;
  handleReservation: (reservation: {
    date: string;
    hour: string;
    quantity: number;
    observations: string;
    userId: number;
      tableId: number;  // Add this field to reservation
  }) => void;
};

const ReservationModal: React.FC<Props> = ({ closeModal, handleReservation }) => {
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [observations, setObservations] = useState("");
  const [userId, setUserId] = useState(Number(localStorage.getItem('authId')));
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Função para obter a primeira mesa disponível
  const getAvailableTable = async (date: string, hour: string) => {
    const response = await axios.get(`http://localhost:8000/reservation/available-tables?date=${date}&hour=${hour}`);
    if (response.data && response.data.length > 0) {
      // Retorna o ID da primeira mesa disponível
      return response.data[0].id;
    } else {
      return null;
    }
  }

  const handleSubmit = async () => {
    // Combine date and hour into a single ISO 8601 string
    const dateTime = new Date(`${date}T${hour}:00`).toISOString(); 

    try {
      // Obtem a mesa disponível
      const tableId = await getAvailableTable(date, hour);
      if (tableId) {
        // Submete a reserva
        await handleReservation({ date: dateTime, hour, quantity, observations, userId, tableId });
        setShowSuccessModal(true);
      } else {
        throw new Error("Não há mesas disponíveis nessa data e hora.");
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  }

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal();
  }

  return (
    <>
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg p-8 m-2 max-w-xs max-h-full text-left overflow-auto shadow-xl transform transition-transform sm:max-w-lg">
          <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Make a reservation</h3>
          <div className="mt-2">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full border-none p-2 rounded-md"/>
            <input type="time" value={hour} onChange={(e) => setHour(e.target.value)} className="mt-1 block w-full border-none p-2 rounded-md"/>
            <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="mt-1 block w-full border-none p-2 rounded-md"/>
            <input type="text" value={observations} onChange={(e) => setObservations(e.target.value)} className="mt-1 block w-full border-none p-2 rounded-md"/>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button onClick={handleSubmit} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Submit
            </button>
            <button onClick={closeModal} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Close
            </button>
          </div>
        </div>
      </div>
      </div>
    {showSuccessModal && (
      <div className="fixed z-20 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg p-8 m-2 max-w-xs max-h-full text-center overflow-auto shadow-xl transform transition-transform sm:max-w-lg">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Reserva realizada com sucesso!</h3>
            <div className="mt-4">
              <button onClick={closeSuccessModal} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

export default ReservationModal;
