"use client";
import { useState } from "react";
import Link from "next/link";
import { Link as ChakraLink } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import LoginModal from "./login";

export default function Navigation() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsUserLoggedIn(!isUserLoggedIn);
  };

  return (
    <nav className="flex justify-between items-center p-5">
        <img src="/images/Zeferino.png" alt="Logo" width={75} height={75} />  
      <div className="flex justify-center items-center space-x-4 flex-grow">
        <Link href="/" passHref>
          <ChakraLink color="white" _hover={{ textDecoration: 'underline', cursor: 'pointer' }}>
            Home
          </ChakraLink>
        </Link>
        <Link href="/menu" passHref>
          <ChakraLink color="white" _hover={{ textDecoration: 'underline', cursor: 'pointer' }}>
            Menu
          </ChakraLink>
        </Link>
        <Link href="/reserva" passHref>
          <ChakraLink color="white" _hover={{ textDecoration: 'underline', cursor: 'pointer' }}>
            Reserva
          </ChakraLink>
        </Link>
        <Link href="/about" passHref>
          <ChakraLink color="white" _hover={{ textDecoration: 'underline', cursor: 'pointer' }}>
            About Us
          </ChakraLink>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Button
          color="white"
          borderColor="white"
          borderWidth={2}
          variant="outline"
          py={2}
          width="100px" 
          onClick={handleLogin} // Aqui está a mudança
        >
          {isUserLoggedIn ? "Logout" : "Login"}
        </Button>
        {isUserLoggedIn && <LoginModal closeModal={handleLogin} />}
      </div>
    </nav>
  );
}
