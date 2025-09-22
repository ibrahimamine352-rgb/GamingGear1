
import Provider from '@/components/custom/Provider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/providers/theme-provider';
import { ToastProvider } from '@/providers/toast-provider';
import { ModalProvider } from '@/providers/modal-provider';
import Header from '@/components/front/Header';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
const inter = Inter({ subsets: ['latin'] });
import './globals.css'
import prismadb from '@/lib/prismadb';
import Navbar from '@/components/navbar';
export const metadata:Metadata={
  robots:{
    index:false,
    nocache:true
  }
  
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
  
   <div className=''>
   <Provider>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem
          >
          
            <Navbar/>
            <ToastProvider />
          
            {children}
         
          
          </ThemeProvider></Provider>
       
        
        
    
   </div>
 
        
         
          </>
  );
}
