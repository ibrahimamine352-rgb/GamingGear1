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
      Mouse:true,
      additionalDetails:true
    }
  });
const SensorType =  await prismadb.sensorType.findMany({
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
          SensorType={SensorType}
         
          manufacturers={Manufacturer}        />
      </div>
    </div>
  );
}

export default ProductPage;
