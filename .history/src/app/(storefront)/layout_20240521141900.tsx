
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
import './globals.css'
import prismadb from '@/lib/prismadb';
import Footer from '@/components/front/Footer';
import { LocalCathegoryCollection } from '../(admin)/admin/(routes)/mainpage/components/Navbar';

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
  metadataBase: new URL('https://gaminggear.tn'),

  keywords
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session =  await getServerSession(authOptions)
  const cathegories = await prismadb.category.findMany(

    {
      where:{
        products:{
          some:{}
        }
      },
      include:{
        _count:{
          select:{
            products:{
              where:{
                category:{}
              }
            }
          }
        }
      },
      orderBy:{
products:{
  _count:'desc'
}
      },
      take:5,

    }
  ) 
  const noscategydata = await prismadb.cathegoryCollection.findMany({
    where:{
     interface:{equals:'Desktop'},
    },
    include:{
      catgories:true,
      navitem:true

    },
    orderBy:{
      index:'asc'
    }
  })
  const noscategydataMobile = await prismadb.cathegoryCollection.findMany({
    where:{
     interface:{equals:'Mobile'}},
    include:{
      catgories:true,
      navitem:true

    },
    orderBy:{
      index:'asc'
    }
  })
  
const noscategy:LocalCathegoryCollection[]=noscategydata.map((item)=>({
   navitemId:item.navitemId,
id:item.id,
index:parseInt(item.index.toString()),
Label:item.Label,
CathegoryCollectiondata:item.catgories.map((i)=>({
  id: i.id, // Changed "String" to "string"
  index: parseInt(i.index.toString()),
  catId: i.catId, // Changed "String" to "string"
  Label: i.Label, // Changed "String" to "string"
}))
}))

const noscategyMobile:LocalCathegoryCollection[]=noscategydataMobile.map((item)=>({
  navitemId:item.navitemId,
id:item.id,
index:parseInt(item.index.toString()),
Label:item.Label,
CathegoryCollectiondata:item.catgories.map((i)=>({
 id: i.id, // Changed "String" to "string"
 index: parseInt(i.index.toString()),
 catId: i.catId, // Changed "String" to "string"
 Label: i.Label, // Changed "String" to "string"
}))
}))
const links=await prismadb.navitem.findMany(   {
  where:{
    interface:{equals:'Desktop'},
   },
  orderBy: { createdAt: "asc" },
})
const linkMobile=await prismadb.navitem.findMany(   {
  where:{
    interface:{equals:'Mobile'},
   },
  orderBy: { createdAt: "asc" },
})
  return (
    <>
  
   
         
           
            <Provider>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="dark" 
            enableSystem

          >   
  
      
            <div className='OverlayS'>  
              
        <Header  linkMobile={linkMobile} noscategyMobile={noscategyMobile} links={links} noscategy={noscategy} session={session} cathegories={cathegories} />
        
          
            {children}
              <Footer/>
              <ToastProvider />
            
            </div>

          </ThemeProvider></Provider>
    
          <section  id="myVideo">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
      </section>
         
          </>
  );
}
