import React, { useState } from 'react';
import TableService from './service';


const Salao: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [action, setAction] = useState<string | null>(null);

  const tables = ['Reservation'];

  const actions = ['Create', 'Manage'];

  const handleTableClick = (tableName: string) => {
    setSelectedTable(tableName === selectedTable ? null : tableName);
    setAction(null); // Limpar a ação selecionada
  };

  const handleActionClick = (actionName: string) => {
    setAction(actionName === action ? null : actionName);
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
                {actions.map((action) => (
                  <button onClick={() => handleActionClick(action)} key={action}>
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-4/5 bg-gray-200 p-4">
        <h1 className="text-xl font-bold mb-4">Manage {selectedTable}</h1>
        {selectedTable === 'Reservation' && action === 'Manage' && <TableService selectedTable={selectedTable} />}
        {/* Adicione aqui os outros componentes correspondentes às tabelas e ações */}
      </div>
    </div>
  );
};

export default Salao;
