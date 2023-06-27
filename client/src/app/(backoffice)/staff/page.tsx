"use client";
// staff/page.tsx
import Navbar from "@/app/(default)/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { User } from "@/models/types";
import { getUserDetails } from "@/services/api";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Admin from "../components/admin/structure";
import Cozinha from "../components/cozinha/structure";
import Salao from "../components/salao/structure";

export default function Staff() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { state } = useAppContext();
    const router = useRouter();
  
    useEffect(() => {
      const id = localStorage.getItem('authId');
      const role = localStorage.getItem('authRole');
  
      const redirectToHome = () => {
        router.push('/');
      };
  
      if (!id || !role) {
        redirectToHome();
        return;
      }
  
      if (Number(role) < 2) {
        redirectToHome();
        return;
      }
  
      const fetchUser = async () => {
        try {
          const userDetails = await getUserDetails(Number(id));
          setUser(userDetails);
        } catch (error) {
          console.error(error);
          // Lida com erros de carregamento do usuário
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchUser();
    }, []);
  
    const [currentDate, setCurrentDate] = useState<string | null>(null);
    useEffect(() => {
      setCurrentDate(new Date().toLocaleString('pt-BR'));
    }, []);
  
    const [activeTab, setActiveTab] = useState('salao');
  
    useEffect(() => {
      const removeLocalStorageData = () => {
        localStorage.removeItem('authId');
        localStorage.removeItem('authRole');
      };
  
      const timeout = setTimeout(removeLocalStorageData, 86400000);
  
      return () => clearTimeout(timeout);
    }, []);
  
    return (
      <div>
        {isLoading ? (
          <div>Carregando...</div>
        ) : (
          <>
            <Navbar />
  
            <div className="p-6">
              <h2 className="mb-4">
                Bem-vindo, {user ? user.name : 'Carregando...'}
              </h2>
              <p className="mb-8">Data e hora: {currentDate}</p>
  
              <div>
                <div className="mb-4 flex border-b border-gray-200">
                  <button
                    className={`px-4 py-2 rounded-tl-lg ${
                      activeTab === 'salao' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                    }`}
                    onClick={() => setActiveTab('salao')}
                  >
                    Atividades de salão
                  </button>
                  <button
                    className={`px-4 py-2 ${
                      activeTab === 'cozinha' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                    }`}
                    onClick={() => setActiveTab('cozinha')}
                  >
                    Atividades de cozinha
                  </button>
                  {Number(user?.role) > 2 && ( // Renderizar o botão "Admin" somente se o role for maior que 2
                    <button
                      className={`px-4 py-2 rounded-tr-lg ${
                        activeTab === 'administrativas' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                      }`}
                      onClick={() => setActiveTab('administrativas')}
                    >
                      Atividades administrativas
                    </button>
                  )}
                </div>
  
                {activeTab === 'salao' && (
                  <div>
                    <h3 className="text-lg mb-4">Atividades de salão</h3>
                    {<Salao />}
                  </div>
                )}
                {activeTab === 'cozinha' && (
                  <div>
                    <h3 className="text-lg mb-4">Atividades de cozinha</h3>
                    {<Cozinha />}
                  </div>
                )}
                {activeTab === 'administrativas' && (
                  <div>
                    <h3 className="text-lg mb-4">Atividades administrativas</h3>
                    {<Admin />}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
  