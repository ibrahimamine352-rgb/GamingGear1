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

  const params = new URLSearchParams(searchParams);

  // ✅ APPLY GLOBAL FILTERS
  const { where, orderBy } = buildProductFilters(params);

  const products = await prismadb.product.findMany({
    where: {
      ...where,

      // 🔥 KEEP RELATION FILTER
      screens: {
        some: {},
      },
    },
    orderBy,
    include: {
      screens: true,
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