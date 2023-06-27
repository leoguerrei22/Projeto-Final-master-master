import { Reservation } from '@/models/types';
import apiService from '@/services/api';
import React, { useState, useEffect } from 'react';

interface UpdateReservationModalProps {
  isOpen: boolean;
  handleClose: () => void;
  reservation: Reservation | null;
}

const UpdateReservationModal: React.FC<UpdateReservationModalProps> = ({ isOpen, handleClose, reservation }) => {
  const [updatedFields, setUpdatedFields] = useState<Partial<Reservation>>({});

  useEffect(() => {
    // Quando a reserva muda, limpe os campos atualizados
    setUpdatedFields({});
  }, [reservation]);

  const handleChange = (field: keyof Reservation, value: string | number) => {
    setUpdatedFields({
      ...updatedFields,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reservation) {
      try {
        // Apenas envie os campos que foram atualizados
        await apiService.update('reservation', reservation.id, updatedFields);
        handleClose();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (!isOpen || !reservation) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded shadow">
        <h2>Update Reservation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label>Date</label>
            <input
              type="date"
              value={updatedFields.date || reservation.date || ""}
              onChange={(e) => handleChange('date', e.target.value)}
              className="border border-gray-300 rounded p-2"
            />
          </div>
          <div className="flex flex-col">
            <label>Hour</label>
            <input
              type="text"
              value={updatedFields.hour || reservation.hour || ""}
              onChange={(e) => handleChange('hour', e.target.value)}
              className="border border-gray-300 rounded p-2"
            />
          </div>
          <div className="flex flex-col">
            <label>Status</label>
            <input
              type="text"
              value={updatedFields.status || reservation.status || ""}
              onChange={(e) => handleChange('status', e.target.value)}
              className="border border-gray-300 rounded p-2"
            />
          </div>
          <div className="flex flex-col">
            <label>Observations</label>
            <input
              type="text"
              value={updatedFields.observations || reservation.observations || ""}
              onChange={(e) => handleChange('observations', e.target.value)}
              className="border border-gray-300 rounded p-2"
            />
          </div>
          <div className="flex flex-col">
            <label>Quantity</label>
            <input
              type="number"
              value={updatedFields.quantity || reservation.quantity || 0}
              onChange={(e) => handleChange('quantity', Number(e.target.value))}
              className="border border-gray-300 rounded p-2"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
            Update Reservation
          </button>
        </form>
        <button onClick={handleClose} className="bg-gray-500 text-white font-bold py-2 px-4 mt-4 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default UpdateReservationModal;
