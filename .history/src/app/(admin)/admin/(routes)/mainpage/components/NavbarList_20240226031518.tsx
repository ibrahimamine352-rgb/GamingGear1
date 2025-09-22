"use client"
import { Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation"; // Changed "next/navigation" to "next/router"
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { columns, BillboardColumn } from "./columns";
import { Category, navitem } from "@prisma/client"; // Removed "Cathegorilab" and "CathegoryCollection"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Dialog from "./dialog";
import { ButtonIcon } from "@radix-ui/react-icons";
import IconButton from "@/components/ui/icon-button";
import axios from "axios";
import { Navbar } from "./Navbar";
import prismadb from "@/lib/prismadb";

type LocalCathegorilab = {
  id: string, // Changed "String" to "string"
  index: number,
  catId: string, // Changed "String" to "string"
  Label: string, // Changed "String" to "string"
};

export type LocalCathegoryCollection = {
  id: string, // Changed "String" to "string"
  Label: string, // Changed "String" to "string"
  index: number,
  navitemId:string,
  CathegoryCollectiondata: LocalCathegorilab[];
};

interface NavbarCollection {
  data: LocalCathegoryCollection[];
  categories: Category[];
  navList:navitem[]
}

type SlidesColumn = {
  id: string,
  title: string;
  imageUrl: string;
  description: string;
  url: string;
  discount: number;
  createdAt: string;
  
};

export const NavbarList: React.FC<NavbarCollection> = ({
  data,
  categories,
  navList
}) => {
  const router = useRouter(); // Changed "useParams" to "useRouter"
  const [NavCollectons, setNavCollectons] = useState<LocalCathegoryCollection[]>(data);
  const [NavigatorValue, setNavigatorValue] = useState("");
  const addNavbarCollection = async () => {
    if (navList.length < 6) {
        try {
            
            const nav = {
    
                label           :"",
                type            :"label",
                link:"",
                CathegoryCollectionId :""
              };
              await axios.post(`/api/navitem`, { nav });
              toast.success("success");
              router.refresh();
        } catch (error) {
            toast.error("error");
        }
   
    } else {
      toast.error("max 6 items");
    }
  };

  const setCollectionInPrev = (index: number) => {
    const prev = NavCollectons[index - 1];
    let col = NavCollectons;
    col[index - 1] = col[index];
    col[index] = prev;
    setNavCollectons([...NavCollectons]);
    setNavigatorValue((index - 1).toString());
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentDialgId, setcurrentDialgId] = useState(0);

  const setCollectionInNext = (index: number) => {
    const prev = NavCollectons[index + 1];
    let col = NavCollectons;
    col[index + 1] = col[index];
    col[index] = prev;
    setNavCollectons([...NavCollectons]);
    setNavigatorValue((index + 1).toString());
  };

  const handleupdate = (data: Category[], index: number) => {
    console.log(data, index);
    const dataa: LocalCathegorilab[] = data.map((i, k) => {
      return {
        id: "",
        Label: i.name,
        index: k,
        catId: i.id,
      };
    });
    let newn = NavCollectons;

    const old = [...newn[index].CathegoryCollectiondata];
    newn[index].CathegoryCollectiondata = [...old, ...dataa];
    setNavCollectons([...newn]);
  };

  const removelabel = (index: number) => {
    let newn = NavCollectons;
    if (index - 1 == -1) {
      if (index < NavCollectons.length) {
        setNavigatorValue(index.toString());
      } else {
        setNavigatorValue(index.toString());
      }
    } else {
      if (index == 0) {
        if (index < NavCollectons.length) {
          setNavigatorValue(index.toString());
        }
      } else {
        setNavigatorValue((index - 1).toString());
      }
    }
    newn.splice(index, 1);
    setNavCollectons([...newn]);
  };

  const onSubmit = async () => {
    try {
      const data = NavCollectons.map((val, k) => {
        val.index = k; // Modify the val.index property to be equal to k
        return val; // Return the modified object
      });
      await axios.post(`/api/navbar`, { NavbarCollection: data }).finally(()=>{
   router.refresh();
      });

   
    } catch (error) {
      toast.error("error"); // Fixed toast message
    }
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <Heading title="Navbar" description="Manage Navbar for your store" />
         <a href="Mobile-menu"> Go to mobile menu</a>
          <Button onClick={() => addNavbarCollection()}>
            <Plus className="mr-2 h-4 w-4" /> Add New Nav Item
          </Button>
        </div>
        <Separator />
        {
            navList.map((i)=>(
                <>
                <Navbar item={i} categories={categories} data={data.filter((ii)=>ii.navitemId==i.id)}/>
                </>
            ))
        }
      </div>
    </>
  );
};
