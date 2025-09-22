import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { ProductsClient } from "./components/client";
import { ProductColumn } from "./components/columns";

const ProductsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const products = await prismadb.compatibiltyProfile.findMany({
  
    include: { 
      cases: true,
      CPUs:true,
      disks:true,
      GPUs:true,
      motherboards:true,
      powersupplys:true,
      RAMs:true,
      
   
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
console.log(products)
  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    category:"",
    isArchived:false,
    price:"0"
    , isFeatured:false,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
