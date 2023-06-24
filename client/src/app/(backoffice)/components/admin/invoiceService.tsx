import React, { useState, useEffect } from 'react';
import { getReservations, generateInvoiceForReservation, getAllInvoices, getInvoice } from '@/services/api';
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
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
      const completedReservations = res.filter((r: Reservation) =>
        r.orders!.some((o: Order) => o.status === 'Concluido')
      );
      setReservations(completedReservations);
    }
  };

  const loadInvoices = async () => {
    const invoices = await getAllInvoices();
    setInvoices(invoices);
  };

  const handleReservationClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsInvoiceModalOpen(true);
  };

  const handleInvoiceClick = async (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsInvoiceModalOpen(true);

    // Load additional details of the invoice
    const updatedInvoice = await getInvoice(invoice.id);
    setSelectedInvoice(updatedInvoice);
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
        setIsCreateModalOpen(false);
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

  const handleCreateModalOpen = () => {
    setIsCreateModalOpen(true);
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setIsInvoiceModalOpen(false);
  };

  const calculateTotalAmount = (orderProducts: any[]): number => {
    let total = 0;
    for (const orderProduct of orderProducts) {
      total += orderProduct.product.price * orderProduct.quantity;
    }
    console.log("tot", total)
    return total;
  };

  return (
    <div>
      <button onClick={handleCreateModalOpen}>Create Invoice</button>

      {isCreateModalOpen && (
        // Modal de criação de invoice
        <div className="fixed z-10 inset-0 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6">
            <h2>Create Invoice</h2>
            <label>Billing Details<input type="text" name="billingDetails" onChange={handleInvoiceChange} /></label>
            <label>Payment Method<input type="text" name="paymentMethod" onChange={handleInvoiceChange} /></label>
            <label>Observations<input type="text" name="observations" onChange={handleInvoiceChange} /></label>
            <label>Payment Status<input type="text" name="paymentStatus" onChange={handleInvoiceChange} /></label>
            <div className="flex justify-end mt-4">
              <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded">Submit</button>
              <button onClick={handleModalClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}

{isInvoiceModalOpen && selectedInvoice && (
  // Modal de exibição de invoice
  <div className="fixed z-10 inset-0 flex items-center justify-center ">
    <div className="bg-white rounded-lg p-6 w-96 border border-solid border-gray-300 shadow-md">
      <h1 className="text-lg font-medium mb-4">Zeferino Restaurante</h1>
      <p>
        <span className="font-medium">Recibo Nº:</span> {selectedInvoice.id}
      </p>
      <p>
        <span className="font-medium">Reserva Nº:</span> {selectedInvoice.reservation?.id}
      </p>
      <p>
        <span className="font-medium">Mesa Nº:</span> {selectedInvoice.reservation!.reservationTables![0].table!.number}
      </p>
      <p>
        <span className="font-medium">Nome:</span> {selectedInvoice.reservation?.user?.name}
      </p>
      <p>
        <span className="font-medium">Dia:</span> {selectedInvoice.reservation?.date.substring(0, 10)}
      </p>
      <p>
        <span className="font-medium">Documento:</span> {selectedInvoice.billingDetails}
      </p>
      <p>
        <span className="font-medium">Forma de Pagamento:</span> {selectedInvoice.paymentMethod}
      </p>
      <hr className="my-4" />
      <p className="font-medium">Produtos:</p>
      <ul className="ml-6 mb-4">
        {selectedInvoice.reservation?.orders!.find(order => order.status === 'Concluido')?.orderProducts.map(orderProduct => (
          <li key={orderProduct.product.id} className="flex items-center justify-between">
            <span>
              - {orderProduct.product.name} x {orderProduct.quantity}
            </span>
            <span>{orderProduct.product.price}</span>
          </li>
        ))}
      </ul>
      {selectedInvoice.reservation?.orders?.some(order => order.status === 'Concluido') ? (
        <p className="text-lg font-semibold">
          Total Amount: {calculateTotalAmount(selectedInvoice.reservation?.orders.find(order => order.status === 'Concluido')!.orderProducts)}
        </p>
      ) : (
        <p>No completed orders</p>
      )}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleModalClose}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
      <h2>Invoices</h2>
    <div >
      <ul>
        {invoices.map(invoice => (
          <li key={invoice.id} onClick={() => handleInvoiceClick(invoice)} className='bg-white rounded-lg p-6 w-96 border border-solid border-gray-300 shadow-md cursor-pointer hover:underline'>
            <p>ID: {invoice.id}</p>
            <p>Name: {invoice.reservation?.user?.name}</p>
            <p>Billing Details: {invoice.billingDetails}</p>
            {/* Exibir outras informações do invoice aqui */}
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}

export default InvoiceService;
