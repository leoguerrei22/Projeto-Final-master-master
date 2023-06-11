// src/app/(backoffice)/components/cozinha/OrderService.tsx
import React, { useState } from 'react';
import { Order } from '@/models/types';
import apiService from '@/services/api';

interface OrderServiceProps {
  order: Order;
}

const statusList = ['Cancelado', 'Pendente', 'Preparando', 'Pronto', 'Concluido'];

const OrderService: React.FC<OrderServiceProps> = ({ order }) => {
  const [status, setStatus] = useState(order.status);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const updatedOrder = await apiService.update('order', order.id, {status: newStatus});
      setStatus(updatedOrder.status);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  return (
    <div className="flex items-center space-x-4">
      <h2>Pedido #{order.id}</h2>

      <div className="flex space-x-2">
        {statusList.map((statusOption) => (
          <button
            key={statusOption}
            className={status === statusOption ? 'bg-blue-500' : 'bg-gray-200'}
            onClick={() => handleStatusChange(statusOption)}
          >
            {statusOption}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrderService;
