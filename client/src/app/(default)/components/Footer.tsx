import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white p-5">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold">Nome da Empresa</h1>
            <p>Rua, 123, Cidade, Estado, CEP</p>
            <p>(11) 99999-9999</p>
            <p>email@empresa.com</p>
          </div>
          <div className="flex space-x-5">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
        <div className="border-t border-gray-500 mt-5 pt-5">
          <p className="text-sm text-center">© 2023 Nome da Empresa. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
