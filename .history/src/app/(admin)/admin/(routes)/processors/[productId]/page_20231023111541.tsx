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
  const processorModels = await prismadb.processorModel.findMany()
  const supportduprocesseurs= await prismadb.supportduprocesseur.findMany()
  const chipset= await prismadb.motherboardChipset.findMany()
  const cpusupport= await prismadb.cPUSupport.findMany()
  const guarantee= await prismadb.guarantee.findMany()
  const format= await prismadb.motherboardFormat.findMany()
  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          categories={categories}
          processorModels={processorModels}
          supportduprocesseurss={supportduprocesseurs}
          initialData={product}
        />
      </div>
    </div>
  );
}

export default ProductPage;
