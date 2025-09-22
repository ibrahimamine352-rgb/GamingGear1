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
const keyboarbrand =  await prismadb.keyboarbrand.findMany({
});
const keyboarFormat= await prismadb.keyboarFormat.findMany({
});
const keyboarButtonsNumber= await prismadb.keyboarButtonsNumber.findMany({
});
const keyboarTouchType= await prismadb.keyboarTouchType.findMany({
});
const Manufacturer = await prismadb.manufacturer.findMany({
});

  const categories = await prismadb.category.findMany({
  });
 
  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          categories={categories}
          initialData={product}
          LapSystem={LapSystem}
          LapProcesseur={LapProcesseur}
          LapProcesseurRe={LapProcesseurRe}
          LapGraphiccard={LapGraphiccard}
          LapGraphiccardRef={LapGraphiccardRef}
          LapScreenSize={LapScreenSize}
          LapScreenType={LapScreenType}
          LapHardisk={LapHardisk}
          Lapmemory={Lapmemory}
          Lapnetwork={Lapnetwork}
          LapSound={LapSound}
          LapCamera={LapCamera}
          LapRefreshRate={LapRefreshRate} 
          manufacturers={Manufacturer}        />
      </div>
    </div>
  );
}

export default ProductPage;
