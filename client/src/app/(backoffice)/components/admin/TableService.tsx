import React, { useState, useEffect, KeyboardEvent } from 'react'; 
import apiService from '@/services/api';

type Table = {
  id: number;
  number: number;
  seats: number;
  status: string;
  deleted: boolean;
};

const initialTableState: Table = {
  id: 0,
  number: 0,
  seats: 0,
  status: 'Available',
  deleted: false,
};

const TableService: React.FC<{selectedTable: string}> = ({ selectedTable }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTableRow, setSelectedTableRow] = useState<Table | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [table, setTable] = useState<Table>(initialTableState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filteredTables, setFilteredTables] = useState<Table[]>(tables);
  const [tableDetails, setTableDetails] = useState<Table | null>(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);



  useEffect(() => {
    const fetchTables = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getAll('table'); 
        setTables(response);
        setError(null);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTables();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTable({ ...table, [name]: value });
  };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      
      setIsLoading(true);
      try {
        let response: Table;
        const preparedTable = {
          number: Number(table.number),
          seats: Number(table.seats),
          status: table.status,
        };
        if (isUpdateMode) {
          response = await apiService.update('table', table.id, preparedTable);
          const updatedTables = tables.map((t) => t.id === table.id ? response : t);
          setTables(updatedTables);
        } else {
          response = await apiService.create('table', preparedTable);
          setTables([...tables, response]);
        }
        setTable(initialTableState);
        setShowForm(false);
        setIsUpdateMode(false);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
  

  
  
// Para pesquisas case-insensitive, converta searchText e value para minúsculas.
const handleEnterPress = (event: React.ChangeEvent<HTMLInputElement>) => {
  const searchText = event.target.value.toLowerCase();  // Converte o texto da pesquisa para minúsculas

  setSearchTerm(searchText);

  if (searchText === "") {
    setFilteredTables(tables);
  } else {
    const filtered = tables.filter((table) => {
      return Object.values(table).some((value) =>
        value.toString().toLowerCase().includes(searchText)  // Converte o valor para minúsculas
      );
    });
    setFilteredTables(filtered);
  }
};

// Use useEffect para atualizar filteredTables sempre que tables for atualizado
React.useEffect(() => {
  setFilteredTables(tables);
}, [tables]);


  const handleExpand = (table: Table) => {
    if (selectedTableRow && selectedTableRow.id === table.id) {
      setSelectedTableRow(null);
    } else {
      setSelectedTableRow(table);
    }
  };

  const handleDelete = async (table: Table) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const updatedTable = {...table, deleted: true};
      await apiService.update('table', table.id, updatedTable);
      const updatedTables = tables.map(t => t.id === table.id ? updatedTable : t);
      setTables(updatedTables);
    }
  };
  
  const handleUpdate = (table: Table) => {
    setTable(table);
    setIsUpdateMode(true);
    setShowForm(true);
  };


  const handleDetails = async (table: Table) => {
    setIsLoading(true);
    try {
      const response = await apiService.getById('table', table.id);
      setTableDetails(response);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
<input className="mb-4"
  type="search"
  placeholder="Search..."
  value={searchTerm}
  onChange={handleEnterPress}
/>

<button onClick={() => setShowForm(true)}>+ Nova Entrada</button>

        {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : filteredTables.length === 0 ? (
        <div>No tables found</div>
      ) : (
        filteredTables.map((table: Table) => (
          <div key={table.id}>
            <button onClick={() => handleExpand(table)}>Mesa {table.number}: {table.status} </button>
            {selectedTableRow && selectedTableRow.id === table.id && (
              <div>
<button className="ml-2 mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => handleDelete(table)}>Delete</button>
<button className="ml-2 mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => handleUpdate(table)}>Update</button>
<button className="ml-2 mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => handleDetails(table)}>Details</button>  
              </div>
            )}
          </div>
        ))
      )}
  
  {tableDetails && (
    <div className="p-4 m-2 bg-white rounded shadow-md relative">
  <h2 className="mb-1">Table Details:</h2>
  <button
    className="absolute top-0 right-0 mt-2 mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
    onClick={() => setTableDetails(null)}
  >
    X
  </button>
  <ul className="list-disc pl-4 space-y-1">
    {Object.entries(tableDetails)
      .filter(([key]) => key !== "deleted")
      .map(([key, value]) => (
        <li key={key}>{`${key}: ${value}`}</li>
      ))}
  </ul>
</div>

)}
      {showForm && (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Número da Mesa</label>
        <input
          type="number"
          name="number"
          value={table.number}
          onChange={handleInputChange}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
  
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Número de assentos</label>
        <input
          type="number"
          name="seats"
          value={table.seats}
          onChange={handleInputChange}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
  
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <input
          type="text"
          name="status"
          value={table.status}
          onChange={handleInputChange}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
  
      <button type="submit" className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Salvar
      </button>
      <button 
  type="button" 
  className="mt-3 ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
  onClick={() => {
    setTable(initialTableState);
    setShowForm(false);
  }}
>
  Cancelar
</button>
    </form>
      )}
    </div>
  );
};

export default TableService;
