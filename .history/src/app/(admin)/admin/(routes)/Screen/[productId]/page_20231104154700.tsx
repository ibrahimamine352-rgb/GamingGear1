import prismadb from "@/lib/prismadb";

import { ProductForm } from "./components/product-form";

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
      screens:true,
      additionalDetails:true
    }
  });
 
  const categories = await prismadb.category.findMany({
  });
  const resolution = await prismadb.resolution.findMany()
  const refreshRate= await prismadb.refreshRate.findMany()
  const pouce= await prismadb.pouce.findMany()

  return ( 
    <div className="flex-col"> 
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          categories={categories}
          resolution={resolution}
          refreshRate={refreshRate}
          pouce={pouce}
          initialData={product}        />
      </div>
    </div>
  );
}

export default ProductPage;
