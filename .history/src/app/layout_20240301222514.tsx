
import Provider from '@/components/custom/Provider';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/providers/theme-provider';
import { ToastProvider } from '@/providers/toast-provider';
import { ModalProvider } from '@/providers/modal-provider';
import Header from '@/components/front/Header';
import Navbar from '@/components/custom/Navbar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
const inter = Inter({ subsets: ['latin'] });


export default async function RootLayout({
  children,
  metadata
}: {
  children: React.ReactNode;
  metadata:Metadata;
}) {
  const session =  await getServerSession(authOptions)
  return (
    <>
  
      <html lang="en">
        <head>
        <meta name="viewport" content="width=device-width,height=device-height initial-scale=1"></meta>
        {metadata&&metadata.title
?<>
    <title>{"Gaming Gear"}</title>
        <meta name="description" content={metadata.description??'Votre escale exclusive pour des PC et périphériques haut de gamme, rehaussant votre expérience informatique avec élégance et performance incomparables.'} />
    
</>:<>
<title>{"Gaming Gear TN"}</title>
        <meta name="description" content={'Votre escale exclusive pour des PC et périphériques haut de gamme, rehaussant votre expérience informatique avec élégance et performance incomparables.'} />
    
</>

        }
         </head>
        <body id='root' className={inter.className}>

            {children}
        
        </body>
      </html>
    
        
         
          </>
  );
}
