"use client";
// client/src/app/(default)/components/Navbar.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import LoginModal from "./login";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { state, logout, dispatch } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('authRole');
    const id = localStorage.getItem('authId');
    if (token && role && id) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: { token, role, id } });
    }
  }, [dispatch]);

  const handleLogin = () => {
    setShowModal(true);
  };

  const handleLogout = () => {
    logout();
    router.push('/')
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <nav className="flex justify-between items-center p-5 bg-gray-800 text-white">
      <img src="/images/Zeferino.png" alt="Logo" width={75} height={75} />  
      <div className="flex justify-center items-center space-x-4 flex-grow">
        <Link href="/" className="hover:underline cursor-pointer">
          Home
        </Link>
        <Link href="/menu" className="hover:underline cursor-pointer">
          Menu
        </Link>
        <Link href="/reserva" className="hover:underline cursor-pointer">
          Reserva
        </Link>
        <Link href="/about" className="hover:underline cursor-pointer">
          About Us
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <button
          className="border-2 border-white py-2 px-4 hover:bg-white hover:text-gray-800 transition-colors"
          onClick={state.isLoggedIn ? handleLogout : handleLogin}
        >
          {state.isLoggedIn ? "Logout" : "Login"}
        </button>
        {showModal && <LoginModal closeModal={handleCloseModal} />}
      </div>
    </nav>
  );
}
