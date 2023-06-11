// src/app/(backoffice)/components/admin/structure.tsx
import React, { useState } from 'react';
import TableService from './TableService';
import UserService from './UserService';

const Admin: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const tables = ['User', 'Reservation', 'Table', 'Product', 'Invoice', 'Order'];

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
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-4/5 bg-gray-200 p-4">
        <h1 className="text-xl font-bold mb-4">Manage {selectedTable}</h1>
        {selectedTable === 'Table' && <TableService selectedTable={selectedTable} />}
        {selectedTable === 'User' && <UserService />}
      </div>
    </div>
  );
};

export default Admin;