import apiService, { addOrderToReservation } from '@/services/api';
import React, { useEffect, useState } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
};

type Order = {
  id: number;
  tableId: number;
  userId: number;
  reservationId: number;
  totalPrice: number;
  status: string;
};

type Reservation = {
    id: number;
    userId: number;
    reservationTables: { table: { id: number } }[];
};

type OrderModalProps = {
    products: Product[];
    addProductToReservation: (
      reservationId: number,
      order: Order,
      products: { product: { id: number }; quantity: number }[]
    ) => Promise<any>;
    isOpen: boolean;
    handleClose: () => void;
    selectedReservation: Reservation | null;
    // setIsOrderModalOpen não é mais necessário como uma propriedade
  };
  const OrderModal: React.FC<OrderModalProps> = ({
    addProductToReservation,
    isOpen,
    handleClose,
    selectedReservation,
  }) => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<{ product: Product, quantity: number }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  
  const fetchProducts = async () => {
      try {
          setIsLoadingProducts(true);
          const productResponse = await apiService.getAll('product');
          setProducts(productResponse);
        } catch (e: any) {
            console.error(e);
        } finally {
            setIsLoadingProducts(false);
        }
    };
    
    useEffect(() => {
        fetchProducts();
    }, []);
    
    const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchValue.toLowerCase())
  );
    
    const handleAddProduct = () => {
      if (selectedProduct) {
        addProductToOrder(selectedProduct, productQuantity);
      }
      setSelectedProduct(null);
    };
    const addProductToOrder = (product: Product, quantity: number) => {
        const existingProduct = selectedProducts.find(p => p.product.id === product.id);
      
        if (existingProduct) {
          // Se o produto já estiver no pedido, apenas atualize a quantidade
          const updatedProducts = selectedProducts.map(p =>
            p.product.id === product.id
              ? { ...p, quantity: p.quantity + quantity }
              : p
          );
          setSelectedProducts(updatedProducts);
        } else {
          // Se o produto não estiver no pedido, adicione-o
          setSelectedProducts([...selectedProducts, { product, quantity }]);
        }
      };
      
    
      const handleConfirm = async () => {
        if (selectedReservation) {
          const totalPrice = selectedProducts.reduce(
            (total, { product, quantity }) => total + product.price * quantity,
            0
          );
          const order: Order = {
            id: 0,
            tableId: selectedReservation.reservationTables[0]?.table.id || 0,
            userId: selectedReservation.userId,
            reservationId: selectedReservation.id,
            totalPrice,
            status: "pending",
          };
    
          await addOrderToReservation(
            selectedReservation.id,
            order,
            selectedProducts.map(({ product, quantity }) => ({
              product: { id: product.id },
              quantity,
            }))
          );
          handleClose(); // Chame handleClose para fechar o modal
        }
      };

      

  return (
    <>
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <button onClick={handleClose} className="float-right">Fechar</button>
                <input
                  type="search"
                  placeholder="Search by product name"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 text-sm"
                />
                <div className="product-list mt-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`product-item ${selectedProduct?.id === product.id ? "bg-indigo-200" : ""} p-2 rounded-md my-2 cursor-pointer`}
                    >
                      {product.name}
                      {selectedProduct?.id === product.id && (
                        <div className="mt-2">
                          <button onClick={() => setProductQuantity((prevQuantity) => prevQuantity - 1)} className="px-2 py-1 bg-red-300 text-white rounded-md mr-2">-</button>
                          {productQuantity}
                          <button onClick={() => setProductQuantity((prevQuantity) => prevQuantity + 1)} className="px-2 py-1 bg-green-300 text-white rounded-md ml-2">+</button>
                          <button onClick={handleAddProduct} className="px-3 py-1 bg-blue-500 text-white rounded-md ml-4">Adicionar</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedProducts.length > 0 && (
       <button 
       onClick={handleConfirm} 
       disabled={isLoading} 
       className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
       Confirmar
     </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderModal;
