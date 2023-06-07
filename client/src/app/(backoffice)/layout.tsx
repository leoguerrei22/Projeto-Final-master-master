"use client"
import { AppProvider } from '@/context/AppContext';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function staffLayout({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: {
      tag: string;
      item: string;
    };
  }) {

    return         (
    <AppProvider>
    {children}       
     </AppProvider>
    )
;
  }
