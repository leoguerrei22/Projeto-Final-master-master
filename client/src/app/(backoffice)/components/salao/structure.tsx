import React, { useState } from 'react';

const Salao: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const tables = ['Reservation', 'Table', 'Order'];

  const handleTableClick = (tableName: string) => {
    setSelectedTable(tableName === selectedTable ? null : tableName);
  };

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-100 p-4 space-y-4">
        <h1 className="text-xl font-bold mb-4">Tables</h1>
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
                <button>Create</button>
                <button>Read</button>
                <button>Update</button>
                <button>List</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-4/5 bg-gray-200 p-4">
        {/* Aqui é onde os inputs serão renderizados baseados no botão CRUD selecionado */}
        <h1 className="text-xl font-bold mb-4">Manage {selectedTable}</h1>
      </div>
    </div>
  );
};

export default Salao;
