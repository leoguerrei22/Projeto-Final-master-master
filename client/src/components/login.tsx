import UserContext from '@/context/user';
import { login } from '@/services/authService';
import { FormEvent, useContext, useState } from 'react';

type LoginModalProps = {
    closeModal: () => void;
};

const LoginModal: React.FC<LoginModalProps> = ({ closeModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
        const user = await login(email, password);
        setUser(user);
      } catch (err) {
        console.log(err);
      }
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 opacity-75"></div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
          <div className="text-right">
          <button className="text-black bg-transparent hover:bg-gray-200 rounded-full p-1" onClick={closeModal}>X</button>
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Entrar</h3>
            <form onSubmit={handleSubmit}>
              <div className="mt-5">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Email"
                />
              </div>
              <div className="mt-5">
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Senha"
                />
              </div>
              <div className="mt-5">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
          <div className="mt-5 sm:mt-6">
            <div className="text-sm leading-5">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Registre-se
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
