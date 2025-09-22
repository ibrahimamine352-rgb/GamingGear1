import prismadb from "@/lib/prismadb";
import ProductForm from "./[productId]/components/product-form"; // <-- FIXED PATH
import { ProdCol } from "@/types";

const NewUnityScreenPackPage = async () => {
  const categories = await prismadb.category.findMany();

  // UNITY = Build-PC list
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

  // PACKS = CustomPack list
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

  // SCREENS
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
          initialData={null}          // creating new = no initial data
          categories={categories}
          packs={packs}
          unities={unities}
          screens={screens}
        />
      </div>
    </div>
  );
};

export default NewUnityScreenPackPage;
