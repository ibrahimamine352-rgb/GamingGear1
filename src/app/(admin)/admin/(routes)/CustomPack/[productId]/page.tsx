import prismadb from "@/lib/prismadb";
import { ProductForm, ProductForForm, PackForForm } from "./components/product-form";
import { ProdCol } from "@/types";
import { Prisma } from "@prisma/client";

/* -------------------------------------------------
   Prisma payload
-------------------------------------------------- */
const productWithEverything = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: {
    images: true,
    additionalDetails: true,
    PackProduct: {
      include: {
        Camera: { include: { images: true } },
        Clavier: { include: { images: true } },
        Headset: { include: { images: true } },
        Mic: { include: { images: true } },
        Mouse: { include: { images: true } },
        MousePad: { include: { images: true } },
        Screen: { include: { images: true } },
        Chair: { include: { images: true } },
        Manette: { include: { images: true } },
        Speaker: { include: { images: true } },
      },
    },
  },
});

type ProductWithEverything = Prisma.ProductGetPayload<typeof productWithEverything>;

/* -------------------------------------------------
   Helpers
-------------------------------------------------- */
const mapProductsToProdCol = (
  items: Array<{ id: string; name: string; description: string; images: any[]; price: any }>
): ProdCol[] =>
  items.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    images: item.images,
    price: Number(item.price),
  }));

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const product: ProductWithEverything | null = await prismadb.product.findUnique({
    where: { id: params.productId },
    ...productWithEverything,
  });

  const categories = await prismadb.category.findMany();

  // picker lists
  const keyboards = mapProductsToProdCol(
    await prismadb.product.findMany({ where: { keyboard: { some: {} } }, include: { images: true } })
  );
  const Mouses = mapProductsToProdCol(
    await prismadb.product.findMany({ where: { Mouse: { some: {} } }, include: { images: true } })
  );
  const Mousepads = mapProductsToProdCol(
    await prismadb.product.findMany({ where: { Mousepad: { some: {} } }, include: { images: true } })
  );
  const Mics = mapProductsToProdCol(
    await prismadb.product.findMany({ where: { Mic: { some: {} } }, include: { images: true } })
  );
  const Headsets = mapProductsToProdCol(
    await prismadb.product.findMany({ where: { Headset: { some: {} } }, include: { images: true } })
  );
  const Cameras = mapProductsToProdCol(
    await prismadb.product.findMany({ where: { Camera: { some: {} } }, include: { images: true } })
  );
  const screens = mapProductsToProdCol(
    await prismadb.product.findMany({ where: { screens: { some: {} } }, include: { images: true } })
  );
  const Hautparleurs = mapProductsToProdCol(
    await prismadb.product.findMany({ where: { Hautparleur: { some: {} } }, include: { images: true } })
  );
  const Manettes = mapProductsToProdCol(
    await prismadb.product.findMany({ where: { Manette: { some: {} } }, include: { images: true } })
  );
  const Chaisegamings = mapProductsToProdCol(
    await prismadb.product.findMany({ where: { Chaisegaming: { some: {} } }, include: { images: true } })
  );

  // Prisma -> DTO
  const initialData: ProductForForm | null = product
    ? {
        id: product.id,
        name: product.name,
        categoryId: product.categoryId,
        description: product.description,

        images: product.images.map((i) => ({ url: i.url })),

        price: Number(product.price),
        dicountPrice: Number(product.dicountPrice),
        stock: Number(product.stock),

        isFeatured: Boolean(product.isFeatured),
        isArchived: Boolean(product.isArchived),
        comingSoon: Boolean(product.comingSoon),
        outOfStock: Boolean(product.outOfStock),

        additionalDetails: product.additionalDetails.map((d) => ({
          name: d.name,
          value: d.value,
        })),

        PackProduct: product.PackProduct.map(
          (p): PackForForm => ({
            id: p.id,

            Camera: mapProductsToProdCol(p.Camera),
            Clavier: mapProductsToProdCol(p.Clavier),
            Headset: mapProductsToProdCol(p.Headset),
            Mic: mapProductsToProdCol(p.Mic),
            Mouse: mapProductsToProdCol(p.Mouse),
            MousePad: mapProductsToProdCol(p.MousePad),
            Screen: mapProductsToProdCol(p.Screen),
            Chair: mapProductsToProdCol(p.Chair),
            Manette: mapProductsToProdCol(p.Manette),
            Speaker: mapProductsToProdCol(p.Speaker),

            DefaultClavier: p.DefaultClavier ?? "",
            DefaultMouse: p.DefaultMouse ?? "",
            DefaultMousePad: p.DefaultMousePad ?? "",
            DefaultMic: p.DefaultMic ?? "",
            DefaultHeadset: p.DefaultHeadset ?? "",
            DefaultCamera: p.DefaultCamera ?? "",
            DefaultScreen: p.DefaultScreen ?? "",
            DefaultSpeaker: p.DefaultSpeaker ?? "",
            DefaultManette: p.DefaultManette ?? "",
            DefaultChair: p.DefaultChair ?? "",

            discountOnPack: Number(p.discountOnPack),
          })
        ),
      }
    : null;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={initialData}
          categories={categories}
          keyboards={keyboards}
          Mouses={Mouses}
          Mousepads={Mousepads}
          Mics={Mics}
          Headsets={Headsets}
          Cameras={Cameras}
          screens={screens}
          Hautparleurs={Hautparleurs}
          Manettes={Manettes}
          Chaisegamings={Chaisegamings}
        />
      </div>
    </div>
  );
};

export default ProductPage;
