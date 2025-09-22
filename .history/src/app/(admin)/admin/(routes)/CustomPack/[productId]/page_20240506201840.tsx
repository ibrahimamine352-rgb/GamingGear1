import prismadb from "@/lib/prismadb";

import { ProductForm, ProductFormProps } from "./components/product-form";
import { ProdCol } from "@/types";
import { Image, Product } from "@prisma/client";

const ProductPage = async ({
  params
}: {
  params: { productId: string, storeId: string }
}) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,

    },
    include: {
      images: true,
      additionalDetails: true,
      PackProduct:{
        include:{
          Camera:{include:{
            images:true
          }},
          Clavier:{include:{
            images:true
          }},
          Headset:{include:{
            images:true
          }},
          Mic:{include:{
            images:true
          }},
          Mouse:{include:{
            images:true
          }},
          MousePad:{include:{
            images:true
          }},
          Screen:{include:{
            images:true
          }},
          Chair:{include:{
            images:true
          }},
          Manette:{include:{
            images:true
          }},
          Speaker:{include:{
            images:true
          }},
        }
      }
    
    }
  });

  const categories = await prismadb.category.findMany({
  });

  const keyboard = await prismadb.product.findMany({
    where: {
      keyboard: {
        some: {}
      }
    },
    include: {
      images: true,
      keyboard: true,
    },
  });

  
  const keyboards:ProdCol[]=keyboard.map((item)=>(
    {
      id:item.id,
      name:item.name,
      description:item.description,
      images:item.images,
      price:parseFloat(item.price.toString())
    }
  ))
  
  const Mouse = await prismadb.product.findMany({
    where: {
      Mouse: {
        some: {}
      }
    },
    include: {
      images: true,
      Mouse: true,
    },
  });

  
  const Mouses:ProdCol[]=Mouse.map((item)=>(
    {
      id:item.id,
      name:item.name,
      description:item.description,
      images:item.images,
      price:parseFloat(item.price.toString())
    }
  ))
  const Mousepad = await prismadb.product.findMany({
    where: {
      Mousepad: {
        some: {}
      }
    },
    include: {
      images: true,
      Mousepad: true,
    },
  });

  
  const Mousepads:ProdCol[]=Mousepad.map((item)=>(
    {
      id:item.id,
      name:item.name,
      description:item.description,
      images:item.images,
      price:parseFloat(item.price.toString())
    }
  ))
  const Mic = await prismadb.product.findMany({
    where: {
      Mic: {
        some: {}
      }
    },
    include: {
      images: true,
      Mic: true,
    },
  });

  
  const Mics:ProdCol[]=Mic.map((item)=>(
    {
      id:item.id,
      name:item.name,
      description:item.description,
      images:item.images,
      price:parseFloat(item.price.toString())
    }
  ))
  const Headset = await prismadb.product.findMany({
    where: {
      Headset: {
        some: {}
      }
    },
    include: {
      images: true,
      Mouse: true,
    },
  });

  
  const Headsets:ProdCol[]=Headset.map((item)=>(
    {
      id:item.id,
      name:item.name,
      description:item.description,
      images:item.images,
      price:parseFloat(item.price.toString())
    }
  ))
  const Camera = await prismadb.product.findMany({
    where: {
      Camera: {
        some: {}
      }
    },
    include: {
      images: true,
      Camera: true,
    },
  });

  
  const Cameras:ProdCol[]=Camera.map((item)=>(
    {
      id:item.id,
      name:item.name,
      description:item.description,
      images:item.images,
      price:parseFloat(item.price.toString())
    }
  ))

  const Screen = await prismadb.product.findMany({
    where: {
      screens: {
        some: {}
      }
    },
    include: {
      images: true,
      screens: true,
    },
  });

  
  const screens:ProdCol[]=Screen.map((item)=>(
    {
      id:item.id,
      name:item.name,
      description:item.description,
      images:item.images,
      price:parseFloat(item.price.toString())
    }
  ))
  const Hautparleur = await prismadb.product.findMany({
    where: {
      Hautparleur: {
        some: {}
      }
    },
    include: {
      images: true,
      screens: true,
    },
  });

  
  const Hautparleurs:ProdCol[]=Hautparleur.map((item)=>(
    {
      id:item.id,
      name:item.name,
      description:item.description,
      images:item.images,
      price:parseFloat(item.price.toString())
    }
  ))
  const Manette = await prismadb.product.findMany({
    where: {
      Manette: {
        some: {}
      }
    },
    include: {
      images: true,
      screens: true,
    },
  });

  
  const Manettes:ProdCol[]=Manette.map((item)=>(
    {
      id:item.id,
      name:item.name,
      description:item.description,
      images:item.images,
      price:parseFloat(item.price.toString())
    }
  ))
  const Chaisegaming = await prismadb.product.findMany({
    where: {
      Chaisegaming: {
        some: {}
      }
    },
    include: {
      images: true,
      screens: true,
    },
  });

  
  const Chaisegamings:ProdCol[]=Chaisegaming.map((item)=>(
    {
      id:item.id,
      name:item.name,
      description:item.description,
      images:item.images,
      price:parseFloat(item.price.toString())
    }
  )) 
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
        initialData={product as unknown as Product & {
          images: Image[]
          PackProduct:{
              Clavier: ProdCol[],
              Headset:ProdCol[],
              Mic:ProdCol[],
              Mouse:ProdCol[],
              MousePad:ProdCol[],
              Screen:ProdCol[],   
              Speaker:ProdCol[], 
              Manette:ProdCol[], 
              Chair:ProdCol[],  
              Camera:ProdCol[],
              DefaultClavier:String
              DefaultMouse:String
              DefaultMousePad:String
              DefaultMic:String
              DefaultHeadset:String
              DefaultCamera:String
              DefaultScreen:String
              DefaultSpeaker :String
              DefaultManette:String
              DefaultChair   :String
              discountOnPack: number
          }[]
      
         
        } | null}
         categories={categories}
         Cameras={Cameras}
         Chaisegamings={Chaisegamings}
         Hautparleurs={Hautparleurs}
         Headsets={Headsets}
         Manettes={Manettes}
         Mics={Mics}
         Mousepads={Mousepads}
         Mouses={Mouses}
         keyboards={keyboards}
         screens={screens}
        />
      </div>
    </div>
  );
}

export default ProductPage;
