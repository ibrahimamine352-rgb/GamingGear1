import prismadb from "@/lib/prismadb";

import { CustomPackTemplate } from "../CustomPackTemplate";

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
      PackProduct: {
        include: {
          Clavier: true,
          Mouse: true,
          MousePad: true,
          Mic: true,
          Headset: true,
          Camera: true,
          Screen: true,
          Speaker: true,
          Manette: true,
          Chair: true,
        }
      },
      additionalDetails: true
    }
  });

  const categories = await prismadb.category.findMany({});
  const manufacturers = await prismadb.manufacturer.findMany({});

  // Fetch all components for selection
  const keyboards = await prismadb.product.findMany({ where: { category: { name: 'Keyboard' }, isArchived: false } });
  const mice = await prismadb.product.findMany({ where: { category: { name: 'Mouse' }, isArchived: false } });
  const mousePads = await prismadb.product.findMany({ where: { category: { name: 'Mousepad' }, isArchived: false } });
  const mics = await prismadb.product.findMany({ where: { category: { name: 'Mic' }, isArchived: false } });
  const headsets = await prismadb.product.findMany({ where: { category: { name: 'Headset' }, isArchived: false } });
  const cameras = await prismadb.product.findMany({ where: { category: { name: 'Camera' }, isArchived: false } });
  const screens = await prismadb.product.findMany({ where: { category: { name: 'Screen' }, isArchived: false } });
  const speakers = await prismadb.product.findMany({ where: { category: { name: 'Speaker' }, isArchived: false } });
  const controllers = await prismadb.product.findMany({ where: { category: { name: 'Manette' }, isArchived: false } });
  const chairs = await prismadb.product.findMany({ where: { category: { name: 'Gaming Chair' }, isArchived: false } }); // Verify category name for Chair

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CustomPackTemplate
          categories={categories}
          initialData={product as any}
          manufacturers={manufacturers}

          keyboards={keyboards}
          mice={mice}
          mousePads={mousePads}
          mics={mics}
          headsets={headsets}
          cameras={cameras}
          screens={screens}
          speakers={speakers}
          controllers={controllers}
          chairs={chairs}
        />
      </div>
    </div>
  );
}

export default ProductPage;
