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
      Chaisegaming:true,
      additionalDetails:true
    }
  });
const RgbType =  await prismadb.rgbType.findMany({
});
const Sonsurround= await prismadb.sonsurround.findMany({
});

const Manufacturer = await prismadb.manufacturer.findMany({
});

  const categories = await prismadb.category.findMany({
  });
 console.log(product)
  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          categories={categories}
          initialData={product}
          RgbType={RgbType}
       
          manufacturers={Manufacturer}        />
      </div>
    </div>
  );
}

export default ProductPage;
