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
import { Metadata } from 'next';
import CustomPackTemplate from './_components/customPackTemplate';
import { Image as IImage } from '@prisma/client';

// 🔹 NEW: helper to extract the real id from slug or raw id
function extractId(slugOrId: string): string {
  // If it’s just an id (no "-"), this still works
  const parts = slugOrId.split("-");
  return parts[parts.length - 1];
}

interface Props {
  params: {
    slug: string;   // 🔹 was productId
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const productId = extractId(params.slug);

    const product = await prismadb.product.findFirst({
      where: {
        id: productId,
      }
    })
    if (!product) return {
      title: "Not Found",
      description: "The page is not found"
    }
    return {
      title: product.name,
      description: product.description
    }
  } catch (error) {
    return {
      title: '',
      description: ''
    }
  }
}

export const revalidate = 0;

interface ProductPageProps {
  params: {
    slug: string;  // 🔹 was productId
  },
}

interface ProdDeatails {
  title: string,
  value: string
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  const productId = extractId(params.slug);  // 🔹 get id from slug or raw id

  const product = await prismadb.product.findFirst({
    where: { id: productId },
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

  if (!product) return null;

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
    additionalDetails: item?.additionalDetails,
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
    additionalDetails: product.additionalDetails,
    comingSoon: product.comingSoon,
    outOfStock: product.outOfStock,
  }

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
      // … your other detail logic here …
    }
    return []
  }

  const details = getData(product)

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
    if (product.PackProduct.length > 0) {
      return (
        <div className="bg-background min-h-screen">
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
                      DefaultClavier: String
                      DefaultMouse: String
                      DefaultMousePad: String
                      DefaultMic: String
                      DefaultHeadset: String
                      DefaultCamera: String
                      DefaultScreen: String
                      DefaultSpeaker: String
                      DefaultManette: String
                      DefaultChair: String
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
      const unavailable = Boolean(product.comingSoon || product.outOfStock);
      const showSale = !unavailable && parseInt(product.dicountPrice.toString()) > 0;

      let ribbonText: string | null = null;
      if (product.comingSoon) ribbonText = "COMING SOON";
      else if (product.outOfStock) ribbonText = "OUT OF STOCK";
      else if (showSale) ribbonText = "SALE";

      return (
        <div className="bg-background min-h-screen">
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
              {details.length > 0 ? <DataTableDetails columns={columns} data={[...details, ...dataa]} /> : null}
              <ProductList title="Similar Products" items={formattedproducts} />
            </div>
          </Container>
        </div>
      )
    }
  }
}

export default ProductPage;
