// src/app/(storefront)/product/[slug]/page.tsx
import ProductList from '@/components/product-list'
import Gallery from '@/components/gallery';
import Info from '@/components/info';
import Container from '@/components/ui/container';
import prismadb from '@/lib/prismadb';
import { Field, ProdCol, Product } from '@/types';

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from '@/components/ui/Prosuct-data-table';
import PCInfos from '@/components/front/PCInfos';
import { DataTableDetails } from '@/components/front/Prod-data-table';
import Image from 'next/image';
import CustomPcTemplate from './_components/customPcTemplate';
import CustomPackTemplate from './_components/customPackTemplate';
import { Image as IImage } from '@prisma/client';

// 🔥 make this route fully dynamic
export const dynamic = 'force-dynamic'
export const revalidate = 0;

// ✅ CORRECT helper: extract full UUID from the slug
function extractIdFromParam(slugParam: string): string | null {
  if (!slugParam) return null;

  const uuidRegex =
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  const match = slugParam.match(uuidRegex);
  if (match && match[0]) {
    return match[0];
  }

  return slugParam;
}

interface Props {
  params: {
    slug: string;
  }
}

/* ================== SEO: generateMetadata with OG images ================== */

export async function generateMetadata({ params }: Props) {
  const baseUrl = 'https://gaminggeartn.tn';

  try {
    const idCandidate = extractIdFromParam(params.slug);

    const product = await prismadb.product.findFirst({
      where: {
        OR: [
          { slug: params.slug },
          ...(idCandidate ? [{ id: idCandidate }] : []),
        ],
      },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        category: { select: { name: true } },
        images: {
          select: { url: true },
        },
      },
    });

    if (!product) {
      return {
        metadataBase: new URL(baseUrl),
        title: "Produit introuvable | Gaming Gear TN",
        description: "Ce produit n'existe plus ou a été retiré.",
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    const name = product.name ?? "Produit Gaming";
    const categoryName = product.category?.name ?? "Produit Gaming";

    const shortDesc =
      (product.description ?? "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 150) ||
      `${name} disponible en Tunisie chez Gaming Gear TN. Livraison rapide et garantie.`;

    const productSlugOrId = product.slug ?? product.id;
    const productUrl = `${baseUrl}/product/${productSlugOrId}`;

    // Normalize image URLs to absolute (required for OG)
    const rawImages = product.images ?? [];
    const absoluteImageUrls = rawImages
      .map((img) => img.url)
      .filter(Boolean)
      .map((url) => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
          return url;
        }
        const clean = url.startsWith('/') ? url : `/${url}`;
        return `${baseUrl}${clean}`;
      });

    // ✅ For Next Metadata typings: use string[]
    const ogImages: string[] =
      absoluteImageUrls.length > 0
        ? absoluteImageUrls
        : [`${baseUrl}/og/default-product.png`]; // make sure this file exists

    const fullTitle = `${name} – ${categoryName} Tunisie | Gaming Gear TN`;

    return {
      metadataBase: new URL(baseUrl),
      title: fullTitle,
      description: shortDesc,
      alternates: {
        canonical: productUrl,
      },
      openGraph: {
        title: fullTitle,
        description: shortDesc,
        url: productUrl,
        type: 'product',
        siteName: 'Gaming Gear TN',
        images: ogImages,
      },
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description: shortDesc,
        images: ogImages,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error("[PRODUCT_METADATA_ERROR]", error);

    return {
      title: "Erreur | Gaming Gear TN",
      description: "Impossible de charger les informations produit.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

interface ProductPageProps {
  params: {
    slug: string;
  },
}

interface ProdDeatails {
  title: string,
  value: string
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  const idCandidate = extractIdFromParam(params.slug);

  console.log('[PRODUCT_PAGE] slug param =', params.slug, '-> idCandidate =', idCandidate);

  const product = await prismadb.product.findFirst({
    where: {
      OR: [
        { slug: params.slug },
        ...(idCandidate ? [{ id: idCandidate }] : []),
      ],
    },
    include: {
      PackProduct: {
        include: {
          Camera: { include: { images: true } },
          Clavier: { include: { images: true } },
          Headset: { include: { images: true } },
          Mic: { include: { images: true } },
          Mouse: { include: { images: true } },
          MousePad: { include: { images: true } },
          Screen: { include: { images: true } },
          Chair: { include: { images: true } },
          Manette: { include: { images: true } },
          Speaker: { include: { images: true } },
        }
      },
      PreBuiltPcmodel: {
        include: {
          pcTemplate: {
            include: {
              caseId: true,
              cooling: true,
              graphicCardId: true,
              hardDiskArray: { include: { Components: true } },
              motherBoardId: true,
              powerSupplyId: true,
              processorId: true,
              ramIdArray: { include: { Components: true } },
            }
          }
        }
      },
      cooling: { include: { CoolingMark: true, CoolingType: true, CPUSupport: true, FansNumber: true } },
      Headset: { include: { HeadsetInterfaceAvecOrdinateur: true, HeadsetModel: true, HeadsetSonSurround: true, Manufacturer: true } },
      keyboard: { include: { keyboarbrand: true, keyboarButtonsNumber: true, keyboarFormat: true, keyboarTouchType: true, Manufacturer: true } },
      Laptop: { include: { Camera: true, Graphiccard: true, Hardisk: true, Manufacturer: true, memory: true, network: true, Processeur: true, RefreshRate: true, ScreenSize: true, ScreenType: true, System: true, Sound: true } },
      Mic: { include: { Manufacturer: true, MicInterfaceAvecOrdinateur: true, MicModel: true, MicSonSurround: true } },
      Mouse: { include: { Manufacturer: true, SensorType: true } },
      Mousepad: { include: { Manufacturer: true, MousepadModel: true, MousepadSize: true } },
      screens: { include: { Mark: true, Pouce: true, RefreshRate: true, resolution: true } },
      cases: { include: { brand: true, caseformat: true, numberofFansPreinstalled: true, rGBType: true } },
      cpus: { include: { processorModel: true, cpusupport: true } },
      gpus: { include: { gpuArchBrand: true, gpuBrand: true, graphiccardName: true } },
      memories: { include: { frequency: true, marque: true, number: true, type: true } },
      motherboard: { include: { chipset: true, cpusupport: true, format: true, manufacturer: true, ramslots: true } },
      orderItems: true,
      powersupplies: { include: { certification: true, Marque: true } },
      storages: { include: { brand: true, capacity: true, Computerinterface: true, type: true } },
      additionalDetails: true,
      images: true,
      category: true,
    }
  });

  // 🔥 If no product, show a simple 404-like page
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          <p className="text-sm text-muted-foreground">
            We could not find any product for URL segment: <code>{params.slug}</code>
          </p>
        </div>
      </div>
    );
  }

  const suggestedProducts = await prismadb.product.findMany({
    where: { categoryId: product?.category?.id },
    include: { images: true, category: true, additionalDetails: true },
    orderBy: { updatedAt: 'desc' },
    take: 4
  });

  const formattedproducts: Product[] = suggestedProducts.map((item) => ({
    id: item.id,
    name: item.name,
    images: item.images,
    dicountPrice: parseFloat(item.dicountPrice.toString()),
    price: parseFloat(item.price.toString()),
    stock: parseInt(item.stock.toString()),
    category: item.category,
    description: item.description,
    additionalDetails: item?.additionalDetails ?? [],
    comingSoon: item.comingSoon,
    outOfStock: item.outOfStock,
  }));

  const formattedproduct: Product = {
    id: product.id,
    name: product.name,
    images: product.images,
    dicountPrice: parseFloat(product.dicountPrice.toString()),
    stock: parseInt(product.stock.toString()),
    price: parseFloat(product.price.toString()),
    category: product.category,
    description: product.description,
    additionalDetails: product.additionalDetails ?? [],
    comingSoon: product.comingSoon,
    outOfStock: product.outOfStock,
  };

  const productUrl = `https://gaminggeartn.tn/product/${params.slug}`;
  const categoryName = product.category?.name || "Produit Gaming";

  // ✅ JSON-LD structured data for Google (Product)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: formattedproduct.name,
    description:
      formattedproduct.description ||
      "Produit gaming disponible en Tunisie chez Gaming Gear TN.",
    image: formattedproduct.images?.map((img) => img.url) ?? [],
    sku: formattedproduct.id,
    brand: categoryName || "Gaming Gear TN",
    category: categoryName || "Gaming",
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "TND",
      price: formattedproduct.price,
      availability: product.outOfStock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  // ✅ JSON-LD structured data for Google (Breadcrumbs)
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://gaminggeartn.tn",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: "https://gaminggeartn.tn/shop",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: formattedproduct.name,
        item: productUrl,
      },
    ],
  };

  const dataa: Field[] = formattedproduct.additionalDetails.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value
  }))

  const columns: ColumnDef<Field>[] = [
    { accessorKey: "name", header: "" },
    { accessorKey: "value", header: "" }
  ];

  const getData = (prod: typeof product): Field[] => {
    let i = 0
    if (prod) {
      if (prod.Headset.length > 0) {
        const prodet = prod.Headset[0]
        const data: Field[] = []
        data.push({
          id: prodet.HeadsetInterfaceAvecOrdinateur?.id ?? i.toString(),
          name: "Interface avec l'ordinateur",
          value: prodet.HeadsetInterfaceAvecOrdinateur?.name ?? ''
        })
        i++
        return data
      }
    }
    return []
  }

  const details = getData(product)

  // 🔹 Branch 1: Prebuilt PC
  if (product.PreBuiltPcmodel) {
    const mbs = await prismadb.motherboard.findMany({
      where: { products: { some: { id: { in: product.PreBuiltPcmodel.pcTemplate.motherBoardId.map((e) => e.productId) } } } },
      include: { products: { include: { images: true, category: true } }, ramslots: true }
    });
    const cpus = await prismadb.processor.findMany({
      where: { products: { some: { id: { in: product.PreBuiltPcmodel.pcTemplate.processorId.map((e) => e.productId) } } } },
      include: { products: { include: { images: true, category: true } } }
    });
    const gpus = await prismadb.gpu.findMany({
      where: { products: { some: { id: { in: product.PreBuiltPcmodel.pcTemplate.graphicCardId.map((e) => e.productId) } } } },
      include: { products: { include: { images: true, category: true } } }
    });
    const cases = await prismadb.pCcase.findMany({
      where: { product: { some: { id: { in: product.PreBuiltPcmodel.pcTemplate.caseId.map((e) => e.productId) } } } },
      include: { product: { include: { images: true, category: true } } }
    });
    const power = await prismadb.powersupply.findMany({
      where: { products: { some: { id: { in: product.PreBuiltPcmodel.pcTemplate.powerSupplyId.map((e) => e.productId) } } } },
      include: { products: { include: { images: true, category: true } } }
    });
    const coolings = await prismadb.cooling.findMany({
      where: { product: { some: { id: { in: product.PreBuiltPcmodel.pcTemplate.cooling.map((e) => e.productId) } } } },
      include: { product: { include: { images: true, category: true } } }
    });

    const ramIDs = product.PreBuiltPcmodel.pcTemplate.ramIdArray
      .map((e) => e.Components).flat().map((e) => e.productId);
    const Rams = await prismadb.memory.findMany({
      where: { products: { some: { id: { in: ramIDs } } } },
      include: { products: { include: { images: true, category: true } }, type: true, number: true }
    });

    const HddIDs = product.PreBuiltPcmodel.pcTemplate.hardDiskArray
      .map((e) => e.Components).flat().map((e) => e.productId);
    const hdds = await prismadb.harddisk.findMany({
      where: { product: { some: { id: { in: HddIDs } } } },
      include: { product: { include: { images: true, category: true } }, capacity: true, type: true }
    });

    return (
      <div className="bg-background min-h-screen">
        {/* JSON-LD for Google */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <div className="container mx-auto px-6 py-8">
          <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.02)] glass-card p-8">
            <CustomPcTemplate
              cases={cases}
              cooling={coolings}
              cpus={cpus}
              diks={hdds}
              gpus={gpus}
              initialData={product}
              motherboards={mbs}
              powersupplies={power}
              rams={Rams}
            />
            <ProductList title="Similar Products" items={formattedproducts} />
          </div>
        </div>
      </div>
    )
  } else {
    // 🔹 Branch 2: Pack product
    if (product.PackProduct.length > 0) {
      return (
        <div className="bg-background min-h-screen">
          {/* JSON-LD for Google */}
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
          />
          <Container>
            <div className="px-4 py-10 sm:px-6 lg:px-8">
              {product.PackProduct ? (
                <CustomPackTemplate
                  initialData={product as unknown as Product & {
                    images: IImage[]
                    PackProduct: {
                      id: number,
                      Clavier: ProdCol[],
                      Headset: ProdCol[],
                      Mic: ProdCol[],
                      Mouse: ProdCol[],
                      MousePad: ProdCol[],
                      Screen: ProdCol[],
                      Speaker: ProdCol[],
                      Manette: ProdCol[],
                      Chair: ProdCol[],
                      Camera: ProdCol[],
                      DefaultClavier: string,
                      DefaultMouse: string,
                      DefaultMousePad: string,
                      DefaultMic: string,
                      DefaultHeadset: string,
                      DefaultCamera: string,
                      DefaultScreen: string,
                      DefaultSpeaker: string,
                      DefaultManette: string,
                      DefaultChair: string,
                      discountOnPack: number
                    }[]
                  }}
                />
              ) : null}
              <ProductList title="Similar Products" items={formattedproducts} />
            </div>
          </Container>
        </div>
      )
    } else {
      // 🔹 Branch 3: Normal single product
      const unavailable = Boolean(product.comingSoon || product.outOfStock);
      const showSale = !unavailable && parseInt(product.dicountPrice.toString()) > 0;

      let ribbonText: string | null = null;
      if (product.comingSoon) ribbonText = "COMING SOON";
      else if (product.outOfStock) ribbonText = "OUT OF STOCK";
      else if (showSale) ribbonText = "SALE";

      return (
        <div className="bg-background min-h-screen">
          {/* JSON-LD for Google */}
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
          />
          <Container>
            <div className="px-4 py-10 sm:px-6 lg:px-8">
              <div className="lg:grid lg:grid-cols-3 lg:items-start lg:gap-x-8">
                <div>
                  {ribbonText && (
                    <div className="w-full flex justify-end">
                      <div className="bg-[hsl(var(--promo))] text-black font-bold px-4 py-2 rounded-full text-lg transform rotate-[25deg] z-20 -mr-6 ml-auto">
                        {ribbonText}
                      </div>
                    </div>
                  )}
                  <Gallery images={product.images} />
                </div>

                <div className="mt-10 md:mx-0 sm:mx-0 lg:mx-20 col-span-2 sm:mt-16 sm:px-0 lg:mt-0">
                  <Info data={formattedproduct} />
                </div>
              </div>
              <hr className="my-10 border-border" />
              {details.length > 0 ? (
                <DataTableDetails columns={columns} data={[...details, ...dataa]} />
              ) : null}
              <ProductList title="Similar Products" items={formattedproducts} />
            </div>
          </Container>
        </div>
      )
    }
  }
}

export default ProductPage;
