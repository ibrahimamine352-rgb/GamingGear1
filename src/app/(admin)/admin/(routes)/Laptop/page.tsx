import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { buildProductFilters } from "@/lib/filters";

import { ProductsClient } from "./components/client";
import { ProductColumn } from "./components/columns";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {

  // ✅ convert to URLSearchParams
  const params = new URLSearchParams(searchParams);

  // ✅ FIX: use categoryId (NOT category)
  params.set("categoryId", "654cc805-9f61-42bb-8720-0844ea85f677");

  // ✅ USE GLOBAL FILTER SYSTEM
  const { where, orderBy } = buildProductFilters(params);

  const products = await prismadb.product.findMany({
    where,
    orderBy,
    include: {
      images: true,
      category: true,
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    comingSoon: item.comingSoon,
    outOfStock: item.outOfStock,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
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