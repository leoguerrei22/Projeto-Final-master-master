import React, { useState, useEffect } from 'react'; 
import apiService from '@/services/api';

type Product = {
  id: number;
  name: string;
  category: string;
  observations?: string;
  stock: number;
  status: string;
  deleted: boolean;
  price: number;
};

const initialProductState: Product = {
  id: 0,
  name: '',
  category: '',
  observations: '',
  stock: 0,
  status: 'unavailable',
  deleted: false,
  price: 0,
};

const ProductService: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductRow, setSelectedProductRow] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [product, setProduct] = useState<Product>(initialProductState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [productDetails, setProductDetails] = useState<Product | null>(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getAll('product'); 
        setProducts(response);
        setError(null);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
    console.log('handleInputChange:', name, value); // Log adicionado

  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
      
    setIsLoading(true);
    try {
        let response: Product;
        const preparedProduct = {
          name: product.name,
          category: product.category,
          status: product.status,
          price: Number(product.price),
          stock: Number(product.stock)
        
        };
        if (isUpdateMode) {
          console.log('Update Mode:', product.id, preparedProduct); // Log adicionado
          response = await apiService.update('product', product.id, preparedProduct);
          const updatedProducts = products.map((p) => p.id === product.id ? response : p);
          setProducts(updatedProducts);
      } else {
          console.log('Create Mode:', product.id, preparedProduct); // Log adicionado
          response = await apiService.create('product', preparedProduct);
          console.log('Create Mode Response:', response); // Log adicionado
          setProducts([...products, response]);
      }
      
        setProduct(initialProductState);
        setShowForm(false);
        setIsUpdateMode(false);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

  const handleEnterPress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value.toLowerCase(); 

    setSearchTerm(searchText);

    if (searchText === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) => {
        return Object.values(product).some((value) =>
          value.toString().toLowerCase().includes(searchText)
        );
      });
      setFilteredProducts(filtered);
    }
  };

  React.useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleExpand = (product: Product) => {
    if (selectedProductRow && selectedProductRow.id === product.id) {
      setSelectedProductRow(null);
    } else {
      setSelectedProductRow(product);
    }
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const updatedProduct = {...product, deleted: true};
      await apiService.update('product', product.id, updatedProduct);
      const updatedProducts = products.map(p => p.id === product.id ? updatedProduct : p);
      setProducts(updatedProducts);
    }
  };
  
  const handleUpdate = (product: Product) => {
    setProduct(product);
    setIsUpdateMode(true);
    setShowForm(true);
  };

  const handleDetails = async (id: number) => {
    console.log('Product ID:', id); // Log adicionado

    setIsLoading(true);
    try {
      const response = await apiService.getById('product', id);
      setProductDetails(response);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <input
        className="mb-4"
        type="search"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleEnterPress}
      />

      <button onClick={() => setShowForm(true)}>+ Novo Produto</button>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : filteredProducts.length === 0 ? (
        <div>No products found</div>
      ) : (
        filteredProducts.map((product: Product) => (
          <div key={product.id}>
          <button onClick={() => handleExpand(product)}>{product.name}: {product.status}</button>
          {selectedProductRow && selectedProductRow.id === product.id && (
            <div>
              <button
                className="ml-2 mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => handleDelete(product)}
              >
                Delete
              </button>
              <button
                className="ml-2 mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => handleUpdate(product)}
              >
                Update
              </button>
              <button
  className="ml-2 mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  onClick={() => handleDetails(product.id)}
>
  Details
</button>
            </div>
            )}
          </div>
        ))
      )}

      {productDetails && (
        <div className="p-4 m-2 bg-white rounded shadow-md relative">
          <h2 className="mb-1">Product Details:</h2>
          <button
            className="absolute top-0 right-0 mt-2 mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => setProductDetails(null)}
          >
            X
          </button>
          <ul className="list-disc pl-4 space-y-1">
            {Object.entries(productDetails)
              .filter(([key]) => key !== 'deleted')
              .map(([key, value]) => (
                <li key={key}>{`${key}: ${value}`}</li>
              ))}
          </ul>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Nome do Produto</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Preço</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Quantidade em Estoque</label>
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleInputChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Categoria</label>
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleInputChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Observações</label>
            <textarea
              name="observations"
              value={product.observations}
              onChange={handleInputChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={product.status}
              onChange={handleInputChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Salvar
          </button>
          <button
            type="button"
            className="mt-3 ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={() => {
              setProduct(initialProductState);
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

export default ProductService;
