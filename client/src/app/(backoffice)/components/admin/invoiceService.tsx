import React, { useState, useEffect, ChangeEvent } from "react";
import {
  getReservations,
  generateInvoiceForReservation,
  getAllInvoices,
  getInvoice,
  sendInvoiceEmail,
} from "@/services/api";
import { Reservation, Invoice, Order } from "@/models/types";

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
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoice, setInvoice] = useState<InvoiceInput>({
    billingDetails: "",
    paymentMethod: "",
    observations: "",
    paymentStatus: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadReservations();
    loadInvoices();
  }, []);

  const loadReservations = async () => {
    const res = await getReservations();
    if (res) {
      const currentDate = new Date().toISOString().substring(0, 10); // Obtém a data atual no formato "YYYY-MM-DD"
      const completedReservations = res.filter((r: Reservation) =>
        r.date.substring(0, 10) === currentDate &&
        r.orders!.some((o: Order) => o.status === "Concluido")
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

  const handleInvoiceChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.name === "reservation") {
      const selectedRes = reservations.find(
        (res) => Number(res.id) === Number(e.target.value)
      );
      setSelectedReservation(selectedRes || null);
    } else {
      setInvoice({ ...invoice, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async () => {
    if (selectedReservation) {
      const { billingDetails, paymentMethod, observations, paymentStatus } =
        invoice;
      try {
        await generateInvoiceForReservation(selectedReservation.id, {
          billingDetails,
          paymentMethod,
          observations,
          paymentStatus,
        });
        setSuccessMessage("Invoice created successfully");
        setIsCreateModalOpen(false);
        setInvoice({
          billingDetails: "",
          paymentMethod: "",
          observations: "",
          paymentStatus: "",
        });
        loadInvoices(); // Atualizar a lista de invoices após a criação bem-sucedida
      } catch (error) {
        setErrorMessage("Failed to create invoice");
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
    return total;
  };

  const handleEmailClick = async () => {
    if (selectedInvoice) {
      try {
        const response = await sendInvoiceEmail(selectedInvoice.id, email);
        if (response.message === "Email sent successfully") {
          setSuccessMessage("Email sent successfully");
          setEmail(""); // Limpar o campo de email após o envio bem-sucedido
          window.alert("Email sent successfully"); // Exibir um alerta informando o sucesso
          setIsInvoiceModalOpen(false);
        } else {
          window.alert("Failed to send email");
          setErrorMessage("Failed to send email");
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to send email");
      }
    } else {
      setErrorMessage("No invoice selected");
    }
  };

  return (
    <div>
      <button
        className="mb-3 cursor-pointer hover:underline"
        onClick={handleCreateModalOpen}
      >
        Criar Recibo
      </button>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {isCreateModalOpen && (
        // Modal de criação de invoice
        <div className="fixed z-10 inset-0 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex flex-col gap-4">
            <h2>Novo Recibo</h2>
            <label>
              Reserva:
              <select
                name="reservation"
                onChange={handleInvoiceChange}
                className="border border-gray-300 rounded p-2"
              >
                <option value="">Selecione uma reserva</option>
                {reservations.map((reservation) => (
                  <option key={reservation.id} value={reservation.id}>
                    {reservation.id}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Documento para fatura:
              <input
                type="text"
                name="billingDetails"
                onChange={handleInvoiceChange}
                className="border border-gray-300 rounded p-2"
              />
            </label>
            <label>
              Forma de Pagamento:
              <input
                type="text"
                name="paymentMethod"
                onChange={handleInvoiceChange}
                className="border border-gray-300 rounded p-2"
              />
            </label>
            <label>
              Observações:
              <input
                type="text"
                name="observations"
                onChange={handleInvoiceChange}
                className="border border-gray-300 rounded p-2"
              />
            </label>
            <label>
              Status do pagamento:
              <input
                type="text"
                name="paymentStatus"
                onChange={handleInvoiceChange}
                className="border border-gray-300 rounded p-2"
              />
            </label>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
              >
                Submit
              </button>
              <button
                onClick={handleModalClose}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isInvoiceModalOpen && selectedInvoice && (
        // Modal de exibição de invoice
        <div className="fixed z-10 inset-0 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 border border-solid border-gray-300 shadow-md">
            <h1 className="text-lg font-medium mb-4">Zeferino Restaurante</h1>
            <p>
              <span className="font-medium">Recibo Nº:</span>{" "}
              {selectedInvoice.id}
            </p>
            <p>
              <span className="font-medium">Reserva Nº:</span>{" "}
              {selectedInvoice.reservation?.id}
            </p>
            <p>
              <span className="font-medium">Mesa Nº:</span>{" "}
              {selectedInvoice.reservation!.reservationTables![0].table!.number}
            </p>
            <p>
              <span className="font-medium">Nome:</span>{" "}
              {selectedInvoice.reservation?.user?.name}
            </p>
            <p>
              <span className="font-medium">Dia:</span>{" "}
              {selectedInvoice.reservation?.date.substring(0, 10)}
            </p>
            <p>
              <span className="font-medium">Documento:</span>{" "}
              {selectedInvoice.billingDetails}
            </p>
            <p>
              <span className="font-medium">Forma de Pagamento:</span>{" "}
              {selectedInvoice.paymentMethod}
            </p>
            <hr className="my-4" />
            <p className="font-medium">Produtos:</p>
            <ul className="ml-6 mb-4">
            {selectedInvoice.reservation?.orders
  ?.filter((order) => order.status === "Concluido")
  .flatMap((order) =>
    order.orderProducts.map((orderProduct) => ({
      ...orderProduct,
      productName: orderProduct.product.name,
      productPrice: orderProduct.product.price,
    }))
  )
  .map((orderProduct) => (
    <li
      key={orderProduct.product.id}
      className="flex items-center justify-between"
    >
      <span>
        - {orderProduct.productName} x {orderProduct.quantity}
      </span>
      <span>{orderProduct.productPrice}</span>
    </li>
  ))}
            </ul>
            {selectedInvoice.reservation?.orders?.some(
              (order) => order.status === "Concluido"
            ) ? (
              <p className="text-lg font-semibold">
                Total Amount:{" "}
                {calculateTotalAmount(
                  selectedInvoice.reservation?.orders
                    ?.filter((order) => order.status === "Concluido")
                    ?.flatMap((order) =>
                      order.orderProducts.map((orderProduct) => ({
                        ...orderProduct,
                        price: orderProduct.product.price,
                      }))
                    ) || []
                )}
              </p>
            ) : (
              <p>No completed orders</p>
            )}

            <div className="mt-4">
              <label className="block">
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 border-gray-300 rounded mt-2 w-full"
                />
              </label>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleEmailClick}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Send Email
              </button>
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

      <h2 className="mb-4 mt-2 text-2xl">Invoices</h2>

      <ul>
        {invoices.map((invoice) => (
          <li
            key={invoice.id}
            onClick={() => handleInvoiceClick(invoice)}
            className="bg-white rounded-lg p-6 w-96 border border-solid border-gray-300 shadow-md cursor-pointer"
          >
            <p>ID: {invoice.id}</p>
            <p>Name: {invoice.reservation?.user?.name}</p>
            <p>Billing Details: {invoice.billingDetails}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvoiceService;
