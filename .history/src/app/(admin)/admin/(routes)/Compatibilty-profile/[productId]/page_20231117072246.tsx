import prismadb from "@/lib/prismadb";

import { ProductForm } from "./components/product-form";
import { ProdCol } from "@/types";

const ProductPage = async ({
  params
}: {
  params: { productId: string, storeId: string }
}) => {
  const product = await prismadb.compatibiltyProfile.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      cases: true,
      CPUs:true,
   
      GPUs:true,
      motherboards:true,
      powersupplys:true,
      RAMs: { include: { Components: true } },
      disks: { include: { Components: true } },
      
    }
  });

  const motherboards = await prismadb.product.findMany({
    where: {
      motherboard: {
        some: {},
      },
    },
    include: {
      motherboard: true,
      images:true,

    },
  });
  const motherboardss = await prismadb.motherboard.findMany({
    where:{
      products:{
        some:{}
      }
    },
    include: {
      cpusupport: true,
      products:true

    },
  });
  
  const motherboardsformated:ProdCol[]=motherboards.map((item)=>(
   
    {
      id:item.id,
      name:item.name,
      description:item.description,
      images:item.images,
      price:parseFloat(item.price.toString())
    }
  ))
const cpu=await prismadb.product.findMany({
  where:{
    cpus:{
      some:{}
    },
  },
  include: {
    cpus:true,
    images:true
  }
})
const cpuData=await prismadb.processor.findMany({
  include: {
    products:true,
    cpusupport:true
  }
})
const cpuformated:ProdCol[]=cpu.map((item)=>(
  {
    id:item.id,
    name:item.name,
    description:item.description,
    images:item.images,
    price:parseFloat(item.price.toString())
  }
))
const gpu=await prismadb.product.findMany({
  where:{
    gpus:{
      some:{}
    },
  },
  include: {
    gpus:true,
    images:true
  }
})

const gpuformated:ProdCol[]=gpu.map((item)=>(
  {
    id:item.id,
    name:item.name,
    description:item.description,
    images:item.images,
    price:parseFloat(item.price.toString())
  }
))
const ram=await prismadb.product.findMany({
  where:{
    memories:{
      some:{}
    },
  },
  include: {
    memories:true,
    images:true
  }
})

const ramformated:ProdCol[]=ram.map((item)=>(
  {
    id:item.id,
    name:item.name,
    description:item.description,
    images:item.images,
    price:parseFloat(item.price.toString())
  }
))
const didk=await prismadb.product.findMany({
  where:{
    storages:{
      some:{}
    },
  },
  include: {
    storages:true,
    images:true
  }
})

const didkformated:ProdCol[]=didk.map((item)=>(
  {
    id:item.id,
    name:item.name,
    description:item.description,
    images:item.images,
    price:parseFloat(item.price.toString())
  }
))
const power=await prismadb.product.findMany({
  where:{
    powersupplies:{
      some:{}
    },
  },
  include: {
    powersupplies:true,
    images:true
  }
})

const powerformated:ProdCol[]=power.map((item)=>(
  {
    id:item.id,
    name:item.name,
    description:item.description,
    images:item.images,
    price:parseFloat(item.price.toString())
  }
))
const cases=await prismadb.product.findMany({
  where:{
    cases:{
      some:{}
    },
  },
  include: {
    cases:true,
    images:true
  }
})

const casesformated:ProdCol[]=cases.map((item)=>(
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
cpuData={cpuData}
        motherboardData={motherboardss}
           
          initialData={product} motherboards={motherboardsformated} cpus={cpuformated} gpus={gpuformated} rams={ramformated} diks={didkformated} powersupplies={powerformated} cases={casesformated}        />
      </div>
    </div>
  );
}

export default ProductPage;
