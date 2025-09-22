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
      Headset:true,
      additionalDetails:true
    }
  });
const HeadsetModel =  await prismadb.headsetModel.findMany({
});
const HeadsetSonSurround= await prismadb.headsetSonSurround.findMany({
});
const HeadsetInterfaceAvecOrdinateur= await prismadb.headsetInterfaceAvecOrdinateur.findMany({
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
          keyboarButtonsNumber={keyboarButtonsNumber}
          keyboarFormat={keyboarFormat}
          keyboarTouchType={keyboarTouchType}
          keyboarbrand={keyboarbrand}
          manufacturers={Manufacturer}        />
      </div>
    </div>
  );
}

export default ProductPage;
