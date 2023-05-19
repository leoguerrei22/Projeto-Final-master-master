"use client"
import { useState } from 'react'
import Link from 'next/link'


export default function Navbar() {

  const [showReserva, setShowReserva] = useState(false)

  return (
    <nav className="bg-transparent text-blue-500">
      <ul className="flex justify-around">
        <li>
          <Link href="/">
            Menu
          </Link>
        </li>
        <li>
          <Link href="/service">
            Serviço
          </Link>
        </li>
        <li>
          {/* Aqui você pode adicionar o seu logo */}
          <Link href="/">
          Logo
          </Link>
        </li>
        <li>
          <Link href="/contact">
            Contacto
          </Link>
        </li>
        <li>
          <Link href="/about">
            About Us
          </Link>
        </li>
        {showReserva && (
          <li>
            <Link href="/reserva">
              Reserva
            </Link>
          </li>
        )}
        <li>
          <a onClick={() => setShowReserva(!showReserva)}>
            {showReserva ? 'Logout' : 'Login'}
          </a>
        </li>
      </ul>
    </nav>
  )
}
