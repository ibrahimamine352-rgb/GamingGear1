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
    }
  });
 
  const categories = await prismadb.category.findMany({
  });
  const memoryMarque = await prismadb.memoryMarque.findMany()
  const memoryNumber= await prismadb.memoryNumber.findMany()
  const memoryType= await prismadb.memoryType.findMany()
  const memoryFrequency= await prismadb.memoryFrequency.findMany()

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          categories={categories}
          manufacturers={manufacturers}
          ramslots={ramslots}
          chipset={chipset}
          cpusupport={cpusupport}
          format={format}
          initialData={product}
        />
      </div>
    </div>
  );
}

export default ProductPage;
