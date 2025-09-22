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
  const pCcaseBrand = await prismadb.pCcaseBrand.findMany()
  const pCcaseCaseformat= await prismadb.pCcaseCaseformat.findMany()
  const pCcaseNumberofFansPreinstalled= await prismadb.pCcaseNumberofFansPreinstalled.findMany()
  const pCcaseRGBType= await prismadb.pCcaseRGBType.findMany()

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          categories={categories}

          initialData={product} 
          pCcaseBrand={pCcaseBrand} 
          pCcaseCaseformat={pCcaseCaseformat} 
          pCcaseNumberofFansPreinstalled={pCcaseNumberofFansPreinstalled} 
          pCcaseRGBType={pCcaseRGBType}        />
      </div>
    </div>
  ); 
}

export default ProductPage;
