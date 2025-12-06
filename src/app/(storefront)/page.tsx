import NewLanding from "@/components/front/new-landing";
import prismadb from "@/lib/prismadb";

import { format } from "date-fns";
import { Product } from "@/types";
import type { Metadata } from "next";

type SlidesColumn = {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  url: string;
  createdAt: string;
  discount: number;
  bgUrl: string;
  mobilebgURl: string;
  descriptionColor: string;
  titleColor: string;
  Price: string;
  PriceColor: string;
  DeletedPrice: string;
  DeletedPriceColor: string;
};

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
  "mouse",
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
  "configurations",
];

export const metadata: Metadata = {
  title: "PC Gamer & PC Portable Tunisie | Gaming Gear TN",
  description:
    "Gaming Gear TN : PC Gamer, PC portables, composants, écrans et accessoires en Tunisie. Configurations sur mesure, livraison rapide, garantie locale.",
  keywords,
  openGraph: {
    title: "PC Gamer & PC Portable Tunisie | Gaming Gear TN",
    description:
      "Gaming Gear TN : PC Gamer, PC portables, composants, écrans et accessoires en Tunisie. Configurations sur mesure, livraison rapide.",
    url: "https://gaminggeartn.tn",
    siteName: "Gaming Gear TN",
    locale: "fr_TN",
    type: "website",
  },
};

export default async function Home() {
  const slides = await prismadb.slide.findMany({});
  const formattedslides: SlidesColumn[] = slides.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl,
    bgUrl: item.bgUrl,
    mobilebgURl: item.mobilebgURl,
    url: item.url,
    descriptionColor: item.descriptionColor,
    titleColor: item.titleColor,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
    discount: item.discount,
    Price: item.Price,
    PriceColor: item.PriceColor,
    DeletedPrice: item.DeletedPrice,
    DeletedPriceColor: item.DeletedPriceColor,
  }));

  const featured = await prismadb.product.findMany({
    where: {
      isFeatured: true,
      isArchived: false,
    },
    include: {
      images: true,
      category: true,
      additionalDetails: true,
    },
  });

  const formattedproducts: Product[] = featured.map((item) => ({
    id: item.id,
    name: item.name,
    images: item.images,
    stock: parseInt(item.stock.toString()),
    price: parseFloat(item.price.toString()),
    dicountPrice: parseInt(item.dicountPrice.toString()),
    category: item.category,
    description: item.description,
    additionalDetails: item?.additionalDetails,
    comingSoon: item.comingSoon,
    outOfStock: item.outOfStock,
  }));

  return (
    <>
      {/* Hidden H1 for SEO – Google sees it, users don't */}
      <h1
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
        }}
      >
        PC Gamer et PC Portables en Tunisie – Gaming Gear TN
      </h1>

      <NewLanding slides={formattedslides} featured={formattedproducts} />
    </>
  );
}
