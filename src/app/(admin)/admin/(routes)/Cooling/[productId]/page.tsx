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
      cooling:true,
      additionalDetails:true
    }
  });
 
  const categories = await prismadb.category.findMany({
  });
  const coolingMark = await prismadb.coolingMark.findMany()
  const coolingType= await prismadb.coolingType.findMany()
  const fansNumber= await prismadb.fansNumber.findMany()
  const cPUSupport= await prismadb.cPUSupport.findMany()

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          categories={categories}

          initialData={product} 
          coolingMark={coolingMark} 
          coolingType={coolingType} 
          fansNumber={fansNumber} 
          cPUSupport={cPUSupport}        />
      </div>
    </div>
  ); 
}

export default ProductPage;
