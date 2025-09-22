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
      gpus:true
    }
  });
 
  const categories = await prismadb.category.findMany({
  });
  const gpuBrand = await prismadb.gpuBrand.findMany()
  const gpuArchBrand= await prismadb.gpuArchBrand.findMany()
  const graphiccardName= await prismadb.graphiccardName.findMany()

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          categories={categories}
          gpuBrand={gpuBrand}
          gpuArchBrand={gpuArchBrand}
          graphiccardName={graphiccardName}

          initialData={product}        />
      </div>
    </div>
  );
}

export default ProductPage;
