import React, { useEffect, useState, useCallback } from 'react';
import { getAllOrder } from '@/services/api';
import { Order } from '@/models/types';
import OrderService from './OrderService';

const Cozinha: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const tables = ['Order'];

  const handleTableClick = (tableName: string) => {
    setSelectedTable(tableName === selectedTable ? null : tableName);
  };

  const loadOrders = useCallback(async () => {
    try {
      const allOrders = await getAllOrder();

      let filteredOrders: Order[] = [];

      if (selectedCategory === 'todos') {
        const today = new Date().toISOString().substring(0, 10);
        filteredOrders = allOrders.filter((order: Order) => {
          const orderDate = order.createdAt?.substring(0, 10);
          return orderDate === today;
        });
      } else if (selectedCategory === 'novos') {
        const today = new Date().toISOString().substring(0, 10);
        filteredOrders = allOrders.filter((order: Order) => {
          const orderDate = order.createdAt?.substring(0, 10);
          return (
            orderDate === today &&
            order.status !== 'Cancelado' &&
            order.status !== 'Concluido'
          );
        });
      } else if (selectedCategory === 'concluidos') {
        const today = new Date().toISOString().substring(0, 10);
        filteredOrders = allOrders.filter((order: Order) => {
          const orderDate = order.createdAt?.substring(0, 10);
          return orderDate === today && order.status === 'Concluido';
        });
      }

      setOrders(filteredOrders);
      if (filteredOrders.length === 0 && selectedCategory !== null) {
        setMessage('Não há pedidos disponíveis');
      } else {
        setMessage(null);
      }
    } catch (error) {
      setMessage('Ops... Há algo de errado :(');
      console.error(error);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory !== null) {
      // Chame loadOrders uma vez para carregar os pedidos imediatamente
      loadOrders();
    }
  }, [selectedCategory, loadOrders]);

  useEffect(() => {
    if (selectedCategory !== null) {
      // Configura o intervalo para atualizar os pedidos a cada 10 segundos
      const intervalId = setInterval(loadOrders, 5000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [selectedCategory, loadOrders]);

  return (
    <div className="flex w-full h-screen">
      <div className="w-1/5 bg-gray-100 p-4 space-y-4">
        <h1 className="text-xl font-bold mb-4">Status</h1>
        {tables.map((table) => (
          <div key={table}>
            <button
              className="w-full text-left"
              onClick={() => handleTableClick(table)}
            >
              {table}
            </button>
            {selectedTable === table && (
              <div className="ml-4 flex flex-col space-y-2">
                <button onClick={() => setSelectedCategory('todos')}>Todos</button>
                <button onClick={() => setSelectedCategory('concluidos')}>Concluídos</button>
                <button onClick={() => setSelectedCategory('novos')}>Novos</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="w-4/5 bg-gray-200 p-4">
        <h1 className="text-xl font-bold mb-4">Manage {selectedTable}</h1>
        {message && <p>{message}</p>}
        {orders.map((order) => (
          <OrderService key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default Cozinha;
