import prismadb from "@/lib/prismadb";
import ProductForm from "./components/product-form"; // correct for [productId]/page.tsx
import { ProdCol } from "@/types";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId?: string };
}) => {
  const product = await prismadb.product.findUnique({
    where: { id: params.productId },
    include: {
      images: true,
      additionalDetails: true,
      FullPack: {
        include: {
          Screen: { include: { images: true } },
          Unity: { include: { images: true } },
          Pack: true,
        },
      },
    },
  });

  const categories = await prismadb.category.findMany();

  // UNITY (Build-PC list)
  const unitiesRaw = await prismadb.product.findMany({
    where: { isArchived: false, PreBuiltPcmodel: { isNot: null } }, // if 1:n -> { some: {} }
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });
  const unities: ProdCol[] = unitiesRaw.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    images: p.images,
    price: Number(p.price),
  }));

  // PACKS (CustomPack list)
  const packsRaw = await prismadb.product.findMany({
    where: { isArchived: false, PackProduct: { some: {} } },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });
  const packs: ProdCol[] = packsRaw.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    images: p.images,
    price: Number(p.price),
  }));

  // SCREENS (monitors)
  const screenRaw = await prismadb.product.findMany({
    where: { isArchived: false, screens: { some: {} } },
    include: { images: true, screens: true },
    orderBy: { createdAt: "desc" },
  });
  const screens: ProdCol[] = screenRaw.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    images: p.images,
    price: Number(p.price),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product as any} // keep simple to avoid TS shape mismatch
          categories={categories}
          packs={packs}
          unities={unities}
          screens={screens}
        />
      </div>
    </div>
  );
};

export default ProductPage;
