  //src/app/(backoffice)/components/cozinha/structure.tsx
  import React, { useEffect, useState } from 'react';
  import { getAllOrders } from '@/services/api';
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

    useEffect(() => {
      if (selectedTable === 'Order') {
        loadOrders();
      }
    }, [selectedCategory]);
    
    const loadOrders = async () => {
      try {
        const allOrders = await getAllOrders(); // Sempre carregue todos os pedidos
  
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
        let filteredOrders: Order[] = [];
        if (selectedCategory === 'todos') {
          filteredOrders = allOrders.filter((order: Order) => order.createdAt?.startsWith(todayStr));
        } else if (selectedCategory === 'novos') {
          filteredOrders = allOrders.filter((order: Order) => order.createdAt?.startsWith(todayStr) && order.status !== 'cancelado' && order.status !== 'concluido');
        } else if (selectedCategory === 'concluidos') {
          filteredOrders = allOrders.filter((order: Order) => order.createdAt?.startsWith(todayStr) && order.status === 'concluido');
        }
  
        if (filteredOrders.length === 0) {
          setMessage("Não há pedidos disponíveis");
        } else {
          setMessage(null);
        }
  
        setOrders(filteredOrders);
      } catch (error) {
        setMessage("Ops... Há algo de errado :(");
        console.error(error);
      }
    };
    
    
    
    
    return (
      <div className="flex w-full h-screen">
        {/* Sidebar */}
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
                  <button onClick={() => setSelectedCategory('Todos')}>Todos</button>
                  <button onClick={() => setSelectedCategory('Concluidos')}>Concluidos</button>
                  <button onClick={() => setSelectedCategory('Novos')}>Novos</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
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
