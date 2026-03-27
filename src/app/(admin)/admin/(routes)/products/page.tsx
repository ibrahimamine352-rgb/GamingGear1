import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { ProductsClient } from "./components/client";
import { ProductColumn } from "./components/columns";

// ✅ IMPORT FILTER BUILDER
import { buildProductFilters } from "@/lib/filters";

const ProductsPage = async ({
  params,
  searchParams, // ✅ ADD THIS
}: {
  params: { storeId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {

  // ✅ CONVERT searchParams
  const urlParams = new URLSearchParams(searchParams as any);

  // ✅ GET DYNAMIC FILTERS
  const { where, orderBy } = buildProductFilters(urlParams);

  // ✅ MERGED QUERY
  const products = await prismadb.product.findMany({
    where: {
      ...where, // 🔥 dynamic filters

      // 🔒 your existing constraints (kept)
      motherboard: { none: {} },
      memories: { none: {} },
      storages: { none: {} },
      cpus: { none: {} },
      cases: { none: {} },
      gpus: { none: {} },
      powersupplies: { none: {} },
    },
    include: {
      category: true,
    },
    orderBy, // 🔥 dynamic sorting
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    comingSoon: item.comingSoon,
    outOfStock: item.outOfStock,
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