import React, { useState } from 'react';
import { Order, OrderProduct, ReservationTable } from '@/models/types'; // Import Order from your types
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
    <div className='bg-white rounded-lg p-6 border border-solid border-gray-300 shadow-md cursor-pointer'>
      <h2>Pedido #{order.id}</h2>
      <p>Mesa: {order.reservation!.reservationTables![0]!.table!.number}</p>
      <p>Reserva: {order.reservationId}</p>
      {order.orderProducts && order.orderProducts.map((orderProduct: OrderProduct) => (
        <p key={orderProduct.product.id}>Produto: {orderProduct.product.name} - Quantidade: {orderProduct.quantity}</p>
      ))}
      <div className="flex space-x-2">
        {statusList.map((statusOption) => (
          <button
            key={statusOption}
            className={`px-4 py-2 rounded ${status === statusOption ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
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
