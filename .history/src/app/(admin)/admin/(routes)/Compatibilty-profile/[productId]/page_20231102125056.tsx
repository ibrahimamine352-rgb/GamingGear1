import prismadb from "@/lib/prismadb";

import { ProductForm } from "./components/product-form";

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
      images:true
    },
  });

const cpu=await prismadb.product.findMany({
  where:{
    cpus:{
      some:{}
    },
  },
  include: {
    cpus:true
  }
})
const gpu=await prismadb.product.findMany({
  where:{
    gpus:{
      some:{}
    },
  },
  include: {
    gpus:true
  }
})
const ram=await prismadb.product.findMany({
  where:{
    memories:{
      some:{}
    },
  },
  include: {
    memories:true
  }
})
const didk=await prismadb.product.findMany({
  where:{
    storages:{
      some:{}
    },
  },
  include: {
    storages:true
  }
})
const power=await prismadb.product.findMany({
  where:{
    powersupplies:{
      some:{}
    },
  },
  include: {
    powersupplies:true
  }
})
const cases=await prismadb.product.findMany({
  where:{
    cases:{
      some:{}
    },
  },
  include: {
    cases:true
  }
})
  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
           
          initialData={product} motherboards={motherboards} cpus={cpu} gpus={gpu} rams={ram} diks={didk} powersupplies={power} cases={cases}        />
      </div>
    </div>
  );
}

export default ProductPage;
