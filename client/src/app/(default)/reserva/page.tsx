// src/pages/Reservations.tsx
"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/context/AppContext';
import Login from '../components/login';
import ReservationModal from '../components/reservation';
import apiService from '@/services/api';

export default function Reservations() {
  const { state } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  const closeModal = () => {
    setShowModal(false);
    // Redirect to home page
    router.push('/');
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    if(state.isLoggedIn){
      setShowModal(true);
    }
    // Redirect to home page
    router.push('/');
  };

  useEffect(() => {
    if (!state.isLoggedIn) {
      setShowLoginModal(true);
    } else {
      setShowModal(true);
    }
  }, [state.isLoggedIn]);

  const handleReservation = async (reservation: {
    date: string;
    hour: string;
    quantity: number;
    observations: string;
  }) => {
    // You can handle the reservation here.
    try {
      const createdReservation = await apiService.create('reservation', reservation);
    } catch(error) {
      console.error('Error creating reservation:', error);
    }
  };

  return (
    <div>
      {showLoginModal && <Login closeModal={closeLoginModal} />}
      {showModal && <ReservationModal closeModal={closeModal} handleReservation={handleReservation} />}
    </div>
  );
}
