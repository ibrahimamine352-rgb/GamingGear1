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
      FullPack:{
        include:{
          Screen:{include:{
            images:true
          }},
          Unity:{include:{
            images:true
          }},
          Pack:true,
         
        }
      }
    
    }
  });

  const categories = await prismadb.category.findMany({
  });


  const Unities = await prismadb.product.findMany({
    where: {
      motherboard: {
        some: {}
      }
    },
    include: {
      images: true,
    },
  });

  
  const Unity:ProdCol[]=Unities.map((item)=>(
    {
      id:item.id,
      name:item.name,
      description:item.description,
      images:item.images,
      price:parseFloat(item.price.toString())
    }
  ))
  const Pack = await prismadb.product.findMany({
    where: {
      Pack: {
        some: {}
      }
    },
    include: {
      images: true,
    },
  });

  
  const packs:ProdCol[]=Pack.map((item)=>(
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
 
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
        initialData={product as unknown as Product & {
          images: Image[]
          FullPack: {
            id: number,
            Unity: ProdCol[],
            Screen: ProdCol[],
            Pack: ProdCol[],
            DefaultPack: String
            DefaultUnity: String
            DefaultScreen: String
            discountOnPack: number
          }[]
        } | null}
         categories={categories}
        packs={packs}
        unities={Unity}
         screens={screens}
        />
      </div>
    </div>
  );
}

export default ProductPage;
