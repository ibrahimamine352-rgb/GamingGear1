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
      Laptop:true,
      additionalDetails:true
    }
  });
const LapSystem  = await prismadb.lapSystem.findMany({
});

const LapProcesseur = await prismadb.lapProcesseur.findMany({
});

const LapProcesseurRe = await prismadb.lapProcesseurRe.findMany({
});

const LapGraphiccard = await prismadb.lapGraphiccard.findMany({
});

const LapGraphiccardRef = await prismadb.lapGraphiccardRef.findMany({
});

const LapScreenSize = await prismadb.lapScreenSize.findMany({
});

const LapScreenType = await prismadb.lapScreenType.findMany({
});

const LapHardisk = await prismadb.lapHardisk.findMany({
});

const Lapmemory = await prismadb.lapmemory.findMany({
});

const Lapnetwork = await prismadb.lapnetwork.findMany({
});

const LapSound = await prismadb.lapSound.findMany({
});

const LapCamera = await prismadb.lapCamera.findMany({
});

const LapRefreshRate = await prismadb.lapRefreshRate.findMany({
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
          LapSystem={LapSystem}
          LapProcesseur={LapProcesseur}
          LapProcesseurRe={LapProcesseurRe}
          LapGraphiccard={LapGraphiccard}
          LapGraphiccardRef={LapGraphiccardRef}
          LapScreenSize={LapScreenSize}
          LapScreenType={LapScreenType}
          LapHardisk={LapHardisk}
          Lapmemory={Lapmemory}
          Lapnetwork={Lapnetwork}
          LapSound={LapSound}
          LapCamera={LapCamera}
          LapRefreshRate={LapRefreshRate} 
          manufacturers={Manufacturer}        />
      </div>
    </div>
  );
}

export default ProductPage;
