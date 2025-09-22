import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { BillboardClient } from "./components/client";
import { Navbar } from "./components/Navbar";
import { NavbarList } from "./components/NavbarList";

type LocalCathegorilab = {
  id: string,
  index: number,
  catId: string,
  Label: string,
};

export type LocalCathegoryCollection = {
  id: string,
  Label: string,
  index: number,
  navitemId:string,
  CathegoryCollectiondata: LocalCathegorilab[],
};

interface NavbarCollection {
  data: LocalCathegoryCollection[];
}

type SlidesColumn = {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  url: string;
  discount: number;
  createdAt: string;
};

const BillboardsPage = async ({
  params,
}: {
  params: { storeId: string };
}) => {
  const billboards = await prismadb.slide.findMany({});
  const NavbarCollection = await prismadb.cathegoryCollection.findMany({
    where:{interface:{equals:'Mobile'}},
    include: {
      catgories: true,
    },
    orderBy: { index: "asc" },
  });

  const NavbarCollections: LocalCathegoryCollection[] = NavbarCollection.map((i) => ({
    id: i.id,
    navitemId:i.navitemId,
    CathegoryCollectiondata: i.catgories.map((val) => ({
      id: val.id,
      index: parseInt(val.index.toString()),
      catId: val.catId,
      Label: val.Label,
    })),
    Label: i.Label,
    index: parseInt(i.index.toString()),
  }));

  const formattedBillboards: SlidesColumn[] = billboards.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl,
    url: item.url,
    discount: item.discount,
    createdAt: format(new Date(item.createdAt), 'MMMM do, yyyy'), // Wrap item.createdAt with new Date()
  }));

  const categories = await prismadb.category.findMany();
  const navList= await prismadb.navitem.findMany(
    {
      
      where:{interface:{equals:'Mobile'}},
      orderBy: { createdAt: "asc" },
    } 
  )
  return (
    <div className="flex-col">
      <div  className="flex-1 space-y-4 p-8 pt-6">
        <NavbarList navList={navList}  categories={categories} data={NavbarCollections} />
      
      </div>
    </div>
  );
};

export default BillboardsPage;
