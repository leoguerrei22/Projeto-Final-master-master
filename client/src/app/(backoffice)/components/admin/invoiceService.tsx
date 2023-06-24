import React, { useState, useEffect } from 'react';
import { getReservations, generateInvoiceForReservation, getAllInvoices } from '@/services/api';
import { Reservation, Invoice, Order } from '@/models/types';

interface InvoiceInput {
  billingDetails: string;
  paymentMethod: string;
  observations: string;
  paymentStatus: string;
}

const InvoiceService: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [invoice, setInvoice] = useState<InvoiceInput>({
    billingDetails: '',
    paymentMethod: '',
    observations: '',
    paymentStatus: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadReservations();
    loadInvoices();
  }, []);

  const loadReservations = async () => {
    const res = await getReservations();
    if (res) {
      const completedReservations = res.filter(r => r.orders.some(o => o.status === 'Concluido'));
      setReservations(completedReservations);
    }
  };

  const loadInvoices = async () => {
    const invoices = await getAllInvoices();
    setInvoices(invoices);
  };

  const handleReservationClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (selectedReservation) {
      const { billingDetails, paymentMethod, observations, paymentStatus } = invoice;
      try {
        await generateInvoiceForReservation(selectedReservation.id, {
          billingDetails,
          paymentMethod,
          observations,
          paymentStatus,
        });
        setSuccessMessage('Invoice created successfully');
        setIsModalOpen(false);
        setInvoice({
          billingDetails: '',
          paymentMethod: '',
          observations: '',
          paymentStatus: '',
        });
        loadInvoices(); // Atualizar a lista de invoices após a criação bem-sucedida
      } catch (error) {
        setErrorMessage('Failed to create invoice');
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Create Invoice</button>
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto" role="dialog">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Reservations
                    </h3>
                    <div className="mt-2">
                      {reservations.map(reservation => (
                        <div
                          key={reservation.id}
                          onClick={() => {
                            handleReservationClick(reservation);
                            handleModalClose();
                          }}
                          className="cursor-pointer hover:underline"
                        >
                          <p>
                            Reserva: {reservation.id} / Mesa: {reservation.reservationTables?.[0]?.id} / Nome do Cliente:{' '}
                            {reservation.user!.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleModalClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedReservation && (
        <div>
          <h2>Reservation: {selectedReservation.id}</h2>
          <label>Billing Details<input type="text" name="billingDetails" onChange={handleInvoiceChange} /></label>
          <label>Payment Method<input type="text" name="paymentMethod" onChange={handleInvoiceChange} /></label>
          <label>Observations<input type="text" name="observations" onChange={handleInvoiceChange} /></label>
          <label>Payment Status<input type="text" name="paymentStatus" onChange={handleInvoiceChange} /></label>
          <div className="mt-4">
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={handleModalClose}>Cancel</button>
          </div>
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
      )}
      <hr/>
      <h2>Invoices</h2>
      <ul>
        {invoices.map(invoice => (
          <li key={invoice.id}>
            <p>Id: {invoice.id}</p>
            <p>Name: {invoice.reservation!.user!.name}</p>
            <p>Documento fatura: {invoice.billingDetails}</p>
            {/* Exibir outras informações do invoice aqui */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InvoiceService;
