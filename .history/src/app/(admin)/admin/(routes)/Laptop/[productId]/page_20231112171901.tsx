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
      Laptop:true,
      additionalDetails:true
    }
  });

  const categories = await prismadb.category.findMany({
  });
 
  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          categories={categories} 
          initialData={product}
           LapSystem={[]} 
           LapProcesseur={[]} 
           LapProcesseurRe={[]} 
           LapGraphiccard={[]} 
           LapGraphiccardRef={[]} 
           LapScreenSize={[]} 
           LapScreenType={[]} 
           LapHardisk={[]}
           Lapmemory={[]} 
           Lapnetwork={[]}
           LapSound={[]}
           LapCamera={[]} 
           LapRefreshRate={[]}         
        />
      </div>
    </div>
  );
}

export default ProductPage;
