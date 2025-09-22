import prismadb from "@/lib/prismadb";

import { ProductForm } from "./components/product-form";
import { ProdCol } from "@/types";

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
          Camera:{},
          Clavier:{},
          Headset:{},
          Mic:{},
          Mouse:{},
          MousePad:{},
          Screen:{}
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
      : {
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
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          categories={categories}
          initialData={product}
          cooling={coolingformated}
          cpuData={cpuData}
          motherboardData={motherboardss}
          motherboards={motherboardsformated}
          cpus={cpuformated}
          gpus={gpuformated}
          rams={ramformated}
          diks={didkformated}
          powersupplies={powerformated}
          cases={casesformated}
        />
      </div>
    </div>
  );
}

export default ProductPage;
