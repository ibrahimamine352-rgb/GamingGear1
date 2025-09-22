import ProductList from '@/components/product-list'
import Gallery from '@/components/gallery';
import Info from '@/components/info';
import Container from '@/components/ui/container';
import prismadb from '@/lib/prismadb';
import { Field, Product } from '@/types';

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from '@/components/ui/Prosuct-data-table';
import PCInfos from '@/components/front/PCInfos';
import { DataTableDetails } from '@/components/front/Prod-data-table';

export const revalidate = 0;

interface ProductPageProps {
  params: {
    productId: string;
  },
}
interface ProdDeatails{
  title:string,
  value:string
}

const ProductPage: React.FC<ProductPageProps> = async ({
  params
}) => {
  const product = await prismadb.product.findFirst({
    where: {
      id: params.productId
    },
    include:
    {
      PreBuiltPcmodel: {
        include: {
          pcTemplate: true
        }
      },
      cooling: {
        include: {
          CoolingMark: true,
          CoolingType: true,
          CPUSupport: true,
          FansNumber: true,

        }
      },
      Headset: {
        include: {
          HeadsetInterfaceAvecOrdinateur: true,
          HeadsetModel: true,
          HeadsetSonSurround: true,
          Manufacturer: true,
        }
      },
      keyboard: {
        include: {
          keyboarbrand: true,
          keyboarButtonsNumber: true,
          keyboarFormat: true,
          keyboarTouchType: true,
          Manufacturer: true,
        }
      },
      Laptop: {
        include: {
          Camera: true,
          Graphiccard: true,
          Hardisk: true,
          Manufacturer: true,
          memory: true,
          network: true,
          Processeur: true,
          RefreshRate: true,
          ScreenSize: true,
          ScreenType: true,
          System: true,
          Sound:true

        }
      },
      Mic: {
        include: {
          Manufacturer: true,
          MicInterfaceAvecOrdinateur: true,
          MicModel: true,
          MicSonSurround: true,
        }
      },
      Mouse: {
        include: {
          Manufacturer: true,
          SensorType: true,
        }
      },
      Mousepad: {
        include: {
          Manufacturer: true,
          MousepadModel: true,
          MousepadSize: true,
        }
      },
      screens: {
        include: {
          Mark: true,
          Pouce: true,
          RefreshRate: true,
          resolution: true,
        }
      },
      cases: {
        include: {
          brand: true,
          caseformat: true,
          numberofFansPreinstalled: true,
          rGBType: true,
        }
      },
      cpus: {
        include: {
          processorModel: true,
          cpusupport: true,
        }
      },
      gpus: {
        include: {
          gpuArchBrand: true,
          gpuBrand: true,
          graphiccardName: true,
        }
      },
      memories: {
        include: {
          frequency: true,
          marque: true,
          number: true,
          type: true,
        }
      },
      motherboard: {
        include: {
          chipset: true,
          cpusupport: true,
          format: true,
          manufacturer: true,
          ramslots: true,
        }
      },
      orderItems: true,
      powersupplies: {
        include: {
          certification: true,
          Marque: true,

        }
      },
      storages: {
        include: {
          brand: true,
          capacity: true,
          Computerinterface: true,
          type: true,
        }
      },

      additionalDetails: true,
      images: true,
      category: true,
    }
  });
  const suggestedProducts = await prismadb.product.findMany({
    where: {
      categoryId: product?.category?.id
    },
    include: {

      images: true,
      category: true,

      additionalDetails: true

    },
    orderBy: {
      updatedAt: 'desc' // Replace with your actual date field (e.g., 'createdAt')
    },

    take: 4
  });


  const formattedproducts: Product[] = suggestedProducts.map((item) => ({
    id: item.id,
    name: item.name,
    images: item.images,
    price: parseFloat(item.price.toString()),
    stock: parseInt(item.stock.toString()),
    category: item.category,
    description: item.description,
    additionalDetails: item?.additionalDetails

  }));
  if (!product) {
    return null;
  }
  const formattedproduct: Product = {
    id: product?.id,
    name: product?.name,
    images: product?.images,
    stock: parseInt(product.stock.toString()),
    price: parseFloat(product?.price?.toString()),
    category: product?.category,
    description: product.description,
    additionalDetails: product?.additionalDetails
  }


  const dataa: Field[] = formattedproduct.additionalDetails.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value

  }))


  const columns: ColumnDef<Field>[] = [
    {
      accessorKey: "name",
      header: "",
    },
    {
      accessorKey: "value",
      header: "",
    }
    // Add more columns as needed
  ];


  const getData=(prod:typeof product):Field[]=>{
    let i=0
if(prod){
if(prod.Headset.length>0){
  const prodet= prod.Headset[0]
  const data:Field[]=[]
  data.push({id:prodet.HeadsetInterfaceAvecOrdinateur?.id??i.toString(),name:"Interface avec l'ordinateur",value:prodet.HeadsetInterfaceAvecOrdinateur?.name??''})
  i++
  return data
  
}
if(prod.Laptop.length>0){
  const prodet= prod.Laptop[0]
  const data:Field[]=[]
  if(prodet.Manufacturer){
    data.push({id:prodet.Manufacturer?.id??i.toString(),name:"Marque",value:prodet.Manufacturer.name??'zz'})
    i++
  }
  if(prodet.Processeur){
    data.push({id:prodet.Processeur?.id??i.toString(),name:"Modèle De Processeur",value:prodet.Processeur.name??'zz'})
    i++
  }
  if(prodet.memory){
    data.push({id:prodet.memory?.id??i.toString(),name:"Capacité RAM installée",value:prodet.memory.name??'zz'})
    i++
  }
  if(prodet.Graphiccard){
    data.push({id:prodet.Graphiccard?.id??i.toString(),name:"Carte graphique",value:prodet.Graphiccard.name??'zz'})
    i++
  }
  if(prodet.ScreenSize){
    data.push({id:prodet.ScreenSize?.id??i.toString(),name:"Taille de l'écran",value:prodet.ScreenSize.name??'zz'})
    i++
  }
  if(prodet.RefreshRate){
    data.push({id:prodet.RefreshRate?.id??i.toString(),name:"Taux De Rafraichissement",value:prodet.RefreshRate.name??'zz'})
    i++
  }

  if(prodet.Camera){
    data.push({id:prodet.Camera?.id??i.toString(),name:"Camera",value:prodet.Camera.name??'zz'})
    i++
  }
 
  if(prodet.Hardisk){
    data.push({id:prodet.Hardisk?.id??i.toString(),name:"Disque dur",value:prodet.Hardisk.name??'zz'})
    i++
  }
  if(prodet.ScreenType){
    data.push({id:prodet.ScreenType?.id??i.toString(),name:"Type de l'écran",value:prodet.ScreenType.name??'zz'})
    i++
  }
  if(prodet.System){
    data.push({id:prodet.System?.id??i.toString(),name:"System d'exploitation",value:prodet.System.name??'zz'})
    i++
  }
  if(prodet.TouchScreen){
    data.push({id:i.toString(),name:"Ecran Tactile",value:prodet.TouchScreen?"oui":'non'})
    i++
  }

  if(prodet.network){
    data.push({id:prodet.network?.id??i.toString(),name:"Carte réseau",value:prodet.network.name??'zz'})
    i++
  }
  if(prodet.Sound){
    data.push({id:prodet.Sound?.id??i.toString(),name:"Son",value:prodet.Sound.name??'zz'})
    i++
  }
  return data
  
}
if(prod.Mic.length>0){
 
  const prodet= prod.Mic[0]
  const data:Field[]=[]
  let i=0
  if(prodet.Manufacturer){
    data.push({id:prodet.Manufacturer?.id??i.toString(),name:"Mark",value:prodet.Manufacturer.name??'zz'})
    i++
  }
  if(prodet.MicInterfaceAvecOrdinateur){
    data.push({id:prodet.MicInterfaceAvecOrdinateur?.id??i.toString(),name:"Interface avec l'ordinateur",value:prodet.MicInterfaceAvecOrdinateur.name??'zz'})
    i++
  }
  if(prodet.MicModel){
    data.push({id:prodet.MicModel?.id??i.toString(),name:"Modél",value:prodet.MicModel.name??'zz'})
    i++
  }
  if(prodet.MicSonSurround){
    data.push({id:prodet.MicSonSurround?.id??i.toString(),name:"Son surround",value:prodet.MicSonSurround.name??'zz'})
    i++
  }
  if(prodet.rgb){
    data.push({id:i.toString(),name:"RGB",value:prodet.rgb?"oui":'non'})
    i++
  }
  if(prodet.wireless){
    data.push({id:i.toString(),name:"Sans-fil",value:prodet.wireless?"oui":'non'})
    i++
  }
  
  return data 
  
}
if(prod.Mouse.length>0){
 
  const prodet= prod.Mouse[0]
  const data:Field[]=[]
  let i=0
  if(prodet.Manufacturer){
    data.push({id:prodet.Manufacturer?.id??i.toString(),name:"Mark",value:prodet.Manufacturer.name??'zz'})
    i++
  }
  if(prodet.SensorType){
    data.push({id:prodet.SensorType?.id??i.toString(),name:"type de capteur",value:prodet.SensorType.name??'zz'})
    i++
  }


  if(prodet.rgb){
    data.push({id:i.toString(),name:"RGB",value:prodet.rgb?"oui":'non'})
    i++
  }
  if(prodet.wirless){
    data.push({id:i.toString(),name:"Sans-fil",value:prodet.wirless?"oui":'non'})
    i++
  }
  
  return data 
  
}
if(prod.Mousepad.length>0){
 
  const prodet= prod.Mousepad[0]
  const data:Field[]=[]
  let i=0
  if(prodet.Manufacturer){
    data.push({id:prodet.Manufacturer?.id??i.toString(),name:"Mark",value:prodet.Manufacturer.name??'zz'})
    i++
  }
  if(prodet.MousepadModel){
    data.push({id:prodet.MousepadModel?.id??i.toString(),name:"Modéle",value:prodet.MousepadModel.name??'zz'})
    i++
  }

  if(prodet.MousepadSize){
    data.push({id:prodet.MousepadSize?.id??i.toString(),name:"Taille",value:prodet.MousepadSize.name??'zz'})
    i++
  }

  if(prodet.rgb){
    data.push({id:i.toString(),name:"RGB",value:prodet.rgb?"oui":'non'})
    i++
  }
  return data 
  
}
if(prod.cases.length>0){
 
  const prodet= prod.cases[0]
  const data:Field[]=[]
  let i=0
  if(prodet.brand){
    data.push({id:prodet.brand?.id??i.toString(),name:"Mark",value:prodet.brand.name??'zz'})
    i++
  }
  if(prodet.caseformat){
    data.push({id:prodet.caseformat?.id??i.toString(),name:"Format",value:prodet.caseformat.name??'zz'})
    i++
  }
  if(prodet.numberofFansPreinstalled){
    data.push({id:prodet.numberofFansPreinstalled?.id??i.toString(),name:"Nombre de ventilateur installé",value:prodet.numberofFansPreinstalled.name??'zz'})
    i++
  }

  if(prodet.rGBType){
    data.push({id:prodet.rGBType?.id??i.toString(),name:"RGB",value:prodet.rGBType.name??'zz'})
    i++
  }
  return data 
  
}
if(prod.cooling.length>0){
 
  const prodet= prod.cooling[0]
  const data:Field[]=[]
  let i=0
  if(prodet.CoolingMark){
    data.push({id:prodet.CoolingMark?.id??i.toString(),name:"Mark",value:prodet.CoolingMark.name??'zz'})
    i++
  }
  if(prodet.CoolingType){
    data.push({id:prodet.CoolingType?.id??i.toString(),name:"Type",value:prodet.CoolingType.name??'zz'})
    i++
  }
  if(prodet.CPUSupport){
    data.push({id:prodet.CPUSupport?.id??i.toString(),name:"Support avec Processeur",value:prodet.CPUSupport.name??'zz'})
    i++
  }

  return data 
  
}
if(prod.cpus.length>0){
 
  const prodet= prod.cpus[0]
  const data:Field[]=[]
  let i=0
  if(prodet.processorModel){
    data.push({id:prodet.processorModel?.id??i.toString(),name:"Model",value:prodet.processorModel.name??'zz'})
    i++
  }

  if(prodet.cpusupport){
    data.push({id:prodet.cpusupport?.id??i.toString(),name:"Support",value:prodet.cpusupport.name??'zz'})
    i++
  }
  return data 
  
}
if(prod.gpus.length>0){
 
  const prodet= prod.gpus[0]
  const data:Field[]=[]
  let i=0
  if(prodet.gpuBrand){
    data.push({id:prodet.gpuBrand?.id??i.toString(),name:"Mark",value:prodet.gpuBrand.name??'zz'})
    i++
  }
  if(prodet.gpuArchBrand){
    data.push({id:prodet.gpuArchBrand?.id??i.toString(),name:"Architecture",value:prodet.gpuArchBrand.name??'zz'})
    i++
  }
  if(prodet.graphiccardName){
    data.push({id:prodet.graphiccardName?.id??i.toString(),name:"Nom",value:prodet.graphiccardName.name??'zz'})
    i++
  }

  return data 
  
}
if(prod.keyboard.length>0){
 
  const prodet= prod.keyboard[0]
  const data:Field[]=[]
  let i=0
  if(prodet.Manufacturer){
    data.push({id:prodet.Manufacturer?.id??i.toString(),name:"Mark",value:prodet.Manufacturer.name??'zz'})
    i++
  }
  if(prodet.keyboarButtonsNumber){
    data.push({id:prodet.keyboarButtonsNumber?.id??i.toString(),name:"Nombre de buttons",value:prodet.keyboarButtonsNumber.name??'zz'})
    i++
  }
  if(prodet.keyboarFormat){
    data.push({id:prodet.keyboarFormat?.id??i.toString(),name:"Format",value:prodet.keyboarFormat.name??'zz'})
    i++
  }
  if(prodet.keyboarTouchType){
    data.push({id:prodet.keyboarTouchType?.id??i.toString(),name:"Type",value:prodet.keyboarTouchType.name??'zz'})
    i++
  }
  if(prodet.keyboarbrand){
    data.push({id:prodet.keyboarbrand?.id??i.toString(),name:"Mark",value:prodet.keyboarbrand.name??'zz'})
    i++
  }


  if(prodet.rgb){
    data.push({id:i.toString(),name:"RGB",value:prodet.rgb?"oui":'non'})
    i++
  }
  if(prodet.wireless){
    data.push({id:i.toString(),name:"Sans-fil",value:prodet.wireless?"oui":'non'})
    i++
  }
  return data 
  
}
if(prod.memories.length>0){
 
  const prodet= prod.cases[0]
  const data:Field[]=[]
  let i=0
  if(prodet.brand){
    data.push({id:prodet.brand?.id??i.toString(),name:"Mark",value:prodet.brand.name??'zz'})
    i++
  }
  if(prodet.caseformat){
    data.push({id:prodet.caseformat?.id??i.toString(),name:"Format",value:prodet.caseformat.name??'zz'})
    i++
  }
  if(prodet.numberofFansPreinstalled){
    data.push({id:prodet.numberofFansPreinstalled?.id??i.toString(),name:"Nombre de ventilateur installé",value:prodet.numberofFansPreinstalled.name??'zz'})
    i++
  }

  if(prodet.rGBType){
    data.push({id:prodet.rGBType?.id??i.toString(),name:"RGB",value:prodet.rGBType.name??'zz'})
    i++
  }
  return data 
  
}
if(prod.motherboard.length>0){
 
  const prodet= prod.cases[0]
  const data:Field[]=[]
  let i=0
  if(prodet.brand){
    data.push({id:prodet.brand?.id??i.toString(),name:"Mark",value:prodet.brand.name??'zz'})
    i++
  }
  if(prodet.caseformat){
    data.push({id:prodet.caseformat?.id??i.toString(),name:"Format",value:prodet.caseformat.name??'zz'})
    i++
  }
  if(prodet.numberofFansPreinstalled){
    data.push({id:prodet.numberofFansPreinstalled?.id??i.toString(),name:"Nombre de ventilateur installé",value:prodet.numberofFansPreinstalled.name??'zz'})
    i++
  }

  if(prodet.rGBType){
    data.push({id:prodet.rGBType?.id??i.toString(),name:"RGB",value:prodet.rGBType.name??'zz'})
    i++
  }
  return data 
  
}
if(prod.powersupplies.length>0){
 
  const prodet= prod.cases[0]
  const data:Field[]=[]
  let i=0
  if(prodet.brand){
    data.push({id:prodet.brand?.id??i.toString(),name:"Mark",value:prodet.brand.name??'zz'})
    i++
  }
  if(prodet.caseformat){
    data.push({id:prodet.caseformat?.id??i.toString(),name:"Format",value:prodet.caseformat.name??'zz'})
    i++
  }
  if(prodet.numberofFansPreinstalled){
    data.push({id:prodet.numberofFansPreinstalled?.id??i.toString(),name:"Nombre de ventilateur installé",value:prodet.numberofFansPreinstalled.name??'zz'})
    i++
  }

  if(prodet.rGBType){
    data.push({id:prodet.rGBType?.id??i.toString(),name:"RGB",value:prodet.rGBType.name??'zz'})
    i++
  }
  return data 
  
}
if(prod.screens.length>0){
 
  const prodet= prod.cases[0]
  const data:Field[]=[]
  let i=0
  if(prodet.brand){
    data.push({id:prodet.brand?.id??i.toString(),name:"Mark",value:prodet.brand.name??'zz'})
    i++
  }
  if(prodet.caseformat){
    data.push({id:prodet.caseformat?.id??i.toString(),name:"Format",value:prodet.caseformat.name??'zz'})
    i++
  }
  if(prodet.numberofFansPreinstalled){
    data.push({id:prodet.numberofFansPreinstalled?.id??i.toString(),name:"Nombre de ventilateur installé",value:prodet.numberofFansPreinstalled.name??'zz'})
    i++
  }

  if(prodet.rGBType){
    data.push({id:prodet.rGBType?.id??i.toString(),name:"RGB",value:prodet.rGBType.name??'zz'})
    i++
  }
  return data 
  
}
if(prod.storages.length>0){
 
  const prodet= prod.cases[0]
  const data:Field[]=[]
  let i=0
  if(prodet.brand){
    data.push({id:prodet.brand?.id??i.toString(),name:"Mark",value:prodet.brand.name??'zz'})
    i++
  }
  if(prodet.caseformat){
    data.push({id:prodet.caseformat?.id??i.toString(),name:"Format",value:prodet.caseformat.name??'zz'})
    i++
  }
  if(prodet.numberofFansPreinstalled){
    data.push({id:prodet.numberofFansPreinstalled?.id??i.toString(),name:"Nombre de ventilateur installé",value:prodet.numberofFansPreinstalled.name??'zz'})
    i++
  }

  if(prodet.rGBType){
    data.push({id:prodet.rGBType?.id??i.toString(),name:"RGB",value:prodet.rGBType.name??'zz'})
    i++
  }
  return data 
  
}

}

    return []
  }
  const details=getData(product)
  
  return (
    <div className="bg-[#ffffffe6]  dark:bg-[#000000e6] lg:rounded-lg  container sm:rounded-none my-10">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:items-start lg:gap-x-8">
            <Gallery images={product.images} />
            <div className="mt-10 md:mx-0 sm:mx-0 lg:mx-20 col-span-2 sm:mt-16 sm:px-0 lg:mt-0">
              <Info data={formattedproduct} />
            </div>
          </div>
          <hr className="my-10" />
          
          {details.length>0?<>
            <DataTableDetails columns={columns} data={[...details,...dataa]}  />
          </>:<></>}
       
          {
            product.PreBuiltPcmodel ? <>
              <PCInfos data={product.PreBuiltPcmodel.pcTemplate} />
            </> : <></>
          }
          
          <ProductList title="Related Items" items={formattedproducts} />
        </div>
      </Container>
    </div>
  )
}

export default ProductPage;
