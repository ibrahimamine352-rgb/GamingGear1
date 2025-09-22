
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

const keywords = [
  // Arabic
  "أجهزة كمبيوتر",
  "أجهزة كمبيوتر محمولة",
  "أجهزة كمبيوتر مكتبية",
  "ملحقات",
  "شاشات عرض",
  "أجهزة",
  "أجهزة عالية الأداء",
  "تخصيص أجهزة الكمبيوتر",
  "مكونات",
  "بطاقات الرسومات",
  "لوحات المفاتيح",
  "الفأرة",
  "سماعات الرأس",
  "كراسي",
  "أجهزة التحكم",
  "معدات",
  "ترقيات",
  "معدات الرياضات الإلكترونية",
  "إعدادات",
  "تحسين الأداء",
  "معدات التنافسية",
  "معدات البث",
  "بناء الأجهزة",
  "صيانة الأجهزة",
  "ترقية الأجهزة",
  "ملحقات الكمبيوتر",
  "أجهزة الكمبيوتر",
  "مكونات الكمبيوتر",
  "برمجيات الكمبيوتر",
  "تحسين أداء الكمبيوتر",
  "عروض",
  "مبيعات",
  "عروض خاصة",
  "تخفيضات",
  "حزم",
  "تكوينات",

  // English
  "computers",
  "laptops",
  "desktops",
  "accessories",
  "displays",
  "devices",
  "high-performance",
  "customization",
  "components",
  "graphics cards",
  "keyboards",
  "mice",
  "headsets",
  "chairs",
  "controllers",
  "equipment",
  "upgrades",
  "esports equipment",
  "settings",
  "performance improvement",
  "competitive equipment",
  "broadcasting equipment",
  "building",
  "maintenance",
  "upgrading",
  "computer accessories",
  "computer devices",
  "computer components",
  "computer software",
  "computer performance improvement",
  "offers",
  "sales",
  "special offers",
  "discounts",
  "bundles",
  "configurations",

  // French
  "ordinateurs",
  "portables",
  "bureaux",
  "accessoires",
  "affichages",
  "appareils",
  "haute performance",
  "personnalisation",
  "composants",
  "cartes graphiques",
  "claviers",
  "souris",
  "écouteurs",
  "chaises",
  "contrôleurs",
  "équipement",
  "mises à niveau",
  "matériel esports",
  "paramètres",
  "amélioration des performances",
  "équipement compétitif",
  "équipement de diffusion",
  "construction",
  "maintenance",
  "mise à niveau",
  "accessoires informatiques",
  "appareils informatiques",
  "composants informatiques",
  "logiciels informatiques",
  "amélioration des performances informatiques",
  "offres",
  "ventes",
  "offres spéciales",
  "réductions",
  "bundles",
  "configurations"
];

export const metadata:Metadata= {
 
  title:{default:"Gaming Gear TN",template:`%s | Gaming Gear TN`},
  description:"Votre escale exclusive pour des PC et périphériques haut de gamme, rehaussant votre expérience informatique avec élégance et performance incomparables.",

}


export default async function RootLayout({
  children,
  
}: {
  children: React.ReactNode;

}) {
  const session =  await getServerSession(authOptions)
  return (
    <>
  
      <html lang="en">

        <body  className={inter.className}>

            {children}
        
        </body>
      </html>
    
        
         
          </>
  );
}
