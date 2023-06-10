import React, { useState } from 'react';

type Table = {
  id?: number;
  number?: number;
  seats?: number;
  status?: string;
  deleted?: boolean;
};

const initialTableState = {
  id: undefined,
  number: undefined,
  seats: undefined,
  status: undefined,
  deleted: undefined,
};

const TableService: React.FC = () => {
  const [table, setTable] = useState<Table>(initialTableState);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTable({ ...table, [name]: value });
  };

  return (
    <div>
      <form className="flex flex-col">
        <label className="mb-2">
          Number:
          <input type="number" name="number" onChange={handleInputChange} value={table.number || ''} />
        </label>

        <label className="mb-2">
          Seats:
          <input type="number" name="seats" onChange={handleInputChange} value={table.seats || ''} />
        </label>

        <label className="mb-2">
          Status:
          <input type="text" name="status" onChange={handleInputChange} value={table.status || ''} />
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default TableService;
