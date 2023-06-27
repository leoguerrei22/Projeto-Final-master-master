import React, { useState, useEffect } from 'react';
import apiService, { addOrderToReservation, getUserDetails } from '@/services/api';
import { Order, Product } from '@/models/types';
import OrderModal from './order';
import UpdateReservationModal from './updateReservation';

type TableServiceProps = {
  selectedTable: string;
};

type Table = {
  id: number;
  number: number;
  seats: number;
  status: string;
  deleted: boolean;
};

type Reservation = {
  id: number;
  userId: number;
  date: string;
  quantity: number;
  hour: string;
  observations: string;
  deleted: boolean;
  status: string;
  user: User;
  reservationTables: ReservationTable[];
};

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: number;
  deleted: boolean;
};

type ReservationTable = {
  id: number;
  reservationId: number;
  tableId: number;
  table: Table;
};

const TableService: React.FC<TableServiceProps> = ({ selectedTable }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<{ [id: number]: User }>({});
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false); // Add state to control OrderModal visibility
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // Add state to control UpdateModal visibility

  useEffect(() => {
    const fetchReservationsAndUsers = async () => {
      setIsLoading(true);
      try {
        const reservationResponse = await apiService.getAll('reservation');
        const uniqueUserIds = Array.from(new Set(reservationResponse.map((reservation: Reservation) => reservation.userId)));
        let newUsers: { [id: number]: User } = {};

        for (let userId of uniqueUserIds as number[]) {
          if (!users[userId]) {
            const userResponse = await getUserDetails(userId);
            newUsers[userId] = userResponse;
          } else {
            newUsers[userId] = users[userId];
          }
        }
        
        setUsers(newUsers);

        const updatedReservations = reservationResponse.map((reservation: Reservation) => {
          reservation.user = newUsers[reservation.userId];
          return reservation;
        });

        const searchText = searchValue.toLowerCase();
        const filteredReservations = updatedReservations.filter((reservation: Reservation) => {
          return (selectedDate === "" || reservation.date.includes(selectedDate)) && 
            (searchValue === "" || 
            reservation.id.toString().toLowerCase().includes(searchText) ||
            reservation.reservationTables[0]?.table.number.toString().toLowerCase().includes(searchText) ||
            reservation.user?.name.toLowerCase().includes(searchText) ||
            reservation.user?.email.toLowerCase().includes(searchText) ||
            reservation.user?.phone.toLowerCase().includes(searchText) 
            );
        });

        setReservations(filteredReservations);
        setError(null);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservationsAndUsers();
  }, [selectedDate, searchValue]);
  const handleExpandReservation = (reservation: Reservation) => {
    if (selectedReservation?.id === reservation.id) {
      setSelectedReservation(null); // Close the reservation if it's already open
    } else {
      setSelectedReservation(reservation); // Open the reservation
    }
  };

  const handleAddOrder = (reservation: Reservation) => {
    console.log("handleAddOrder called");
  
    setSelectedReservation(reservation); // Set the selected reservation
    setIsOrderModalOpen(true); // Open the OrderModal
  };
  
  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false); // Close the OrderModal
  };

  const handleUpdateReservation = async (reservation: Reservation) => {
    await apiService.update('reservation', reservation.id, reservation);
  };

  const handleOpenUpdateModal = () => {
    setIsUpdateModalOpen(true); // Open the UpdateModal
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false); // Close the UpdateModal
  };


  return (
    <div className="flex flex-col space-y-4">
      <input
        type="date"
        value={selectedDate}
        onChange={e => setSelectedDate(e.target.value)}
      />
      <input
        type="search"
        placeholder="Search by Reservation ID"
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
      />
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {reservations.map((reservation: Reservation) => (
        <div key={reservation.id}>
       <button className='bg-white rounded-lg p-6 w-500 border border-solid border-gray-300 shadow-md cursor-pointer' onClick={() => handleExpandReservation(reservation)}>
  ID: {reservation.id} table: {reservation.reservationTables[0]?.table.number || "Mesa não disponível"} / Nome: {reservation.user.name} / Tel: {reservation.user.phone} / Email: {reservation.user.email}
</button>
{selectedReservation?.id === reservation.id && (  // Use selectedReservation to control if reservation details are shown
            <div>
              <button    className="ml-2 mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
               onClick={() => handleAddOrder(reservation)}>Adicionar pedido</button>
              <button    className="ml-2 mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
               onClick={handleOpenUpdateModal}>Atualizar reserva</button>
            </div>
          )}
        </div>
      ))}
      {/* Order Modal */}
      <OrderModal 
  isOpen={isOrderModalOpen} 
  handleClose={handleCloseOrderModal} 
  products={products}
  addProductToReservation={addOrderToReservation} 
  selectedReservation={selectedReservation}
/>
<UpdateReservationModal
        isOpen={isUpdateModalOpen}
        handleClose={handleCloseUpdateModal}
        reservation={selectedReservation}
      /></div>
  );
};

export default TableService;
