"use client"
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import { AppProvider } from '@/context/AppContext';

const inter = Inter({ subsets: ['latin'] })

export default function pageslayout({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: {
      tag: string;
      item: string;
    };
  }) {

    return (
        <AppProvider>
            <Navbar/>
            <HeroSection>{children}</HeroSection>
            <Footer/>
        </AppProvider>
    );
  }
