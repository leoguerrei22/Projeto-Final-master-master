"use client"
// staff/page.tsx
import Navbar from '@/app/(default)/components/Navbar';
import { useAppContext } from '@/context/AppContext';
import { User } from '@/models/types';
import { getUserDetails } from '@/services/api';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';


export default function Staff() {
    const [user, setUser] = useState<User | null>(null);  // Defina o tipo User
    const { state } = useAppContext();
    const router = useRouter();

    useEffect(() => {
        const id = localStorage.getItem('authId')
        const role = localStorage.getItem('authRole')
        
        // se não tiver id ou role é redirecionado para a página de login
        if (!id || !role) {
            router.push('/login');
        }
        
        // se role < 2 redireciona para home page
        if (Number(role) < 2) {
            router.push('/');
        }

        const fetchUser = async () => {
            const userDetails = await getUserDetails(Number(id));
            setUser(userDetails);
        };

        fetchUser();}, []); // Chamar a função fetchUser assim que o componente for montado

    const [currentDate, setCurrentDate] = useState<string | null>(null);
    useEffect(() => {
        setCurrentDate(new Date().toLocaleString('pt-BR'));
    }, []);

    const [activeTab, setActiveTab] = useState('salao');

    return (
        <div>

            <Navbar/>
        <div className="p-6">
            <h2 className="mb-4">Bem-vindo, {user ? user.name : 'Carregando...'}</h2>
            <p className="mb-8">Data e hora: {currentDate}</p>

            <div>
                <div className="mb-4 flex">
                    <button
                        className={`px-4 py-2 ${activeTab === 'salao' ? 'font-semibold underline' : ''}`}
                        onClick={() => setActiveTab('salao')}
                        >
                        Atividades de salão
                    </button>
                    <button
                        className={`px-4 py-2 ${activeTab === 'cozinha' ? 'font-semibold underline' : ''}`}
                        onClick={() => setActiveTab('cozinha')}
                        >
                        Atividades de cozinha
                    </button>
                    <button
                        className={`px-4 py-2 ${activeTab === 'administrativas' ? 'font-semibold underline' : ''}`}
                        onClick={() => setActiveTab('administrativas')}
                        >
                        Atividades administrativas
                    </button>
                </div>

                {activeTab === 'salao' && (
                    <div>
                        <h3 className="text-lg mb-4">Atividades de salão</h3>
                        {/* Adicione aqui os componentes de consulta de reservas, atribuição de mesa, adição/remoção de pedidos */}
                    </div>
                )}
                {activeTab === 'cozinha' && (
                    <div>
                        <h3 className="text-lg mb-4">Atividades de cozinha</h3>
                        {/* Adicione aqui os componentes relevantes para a cozinha */}
                    </div>
                )}
                {activeTab === 'administrativas' && (
                    <div>
                        <h3 className="text-lg mb-4">Atividades administrativas</h3>
                        {/* Adicione aqui os componentes relevantes para as atividades administrativas */}
                    </div>
                )}
            </div>
        </div>
    </div>
    );
}
