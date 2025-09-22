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
  item:navitem
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

export const Navbar: React.FC<NavbarCollection> = ({
  data,
  categories,
  item
}) => {
  const router = useRouter(); // Changed "useParams" to "useRouter"
  const [NavCollectons, setNavCollectons] = useState<LocalCathegoryCollection[]>(data);
  const [NavigatorValue, setNavigatorValue] = useState("");
  const addNavbarCollection = () => {
    if (NavCollectons.length < 6) {
      const newn = {
        id: "",
        Label: "Change this ",
        index: 0,
        navitemId:item.id,
        CathegoryCollectiondata: []
      };

      setNavCollectons([...NavCollectons, newn]);
      setNavigatorValue(NavCollectons.length.toString());
    } else {
      toast.error("max 6 Labels");
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
      await axios.patch(`/api/navitem/${item.id}`, { name:header, NavbarCollection: data });
      router.refresh(); // Changed router.refresh() to router.push("/") to navigate to the home page
      toast.success("updated successfully"); // Fixed toast message
    } catch (error) {
      toast.error("error"); // Fixed toast message
    }
  };

  const deletee= async()=>{
     
    try {
      const data = NavCollectons.map((val, k) => {
        val.index = k; // Modify the val.index property to be equal to k
        return val; // Return the modified object
      });
      await axios.delete(`/api/navitem/${item.id}`);
   // Changed router.refresh() to router.push("/") to navigate to the home page
      toast.success("updated successfully"); // Fixed toast message
      router.refresh();
    } catch (error) {
      toast.error("error"); // Fixed toast message
    }
  }
  const[header,setHeader]=useState(item.label.length>0?item.label:"No Titel")
  const[haschanged,sethaschanged]=useState(false)
  const changedd=(val:string)=>{
    sethaschanged(true)
    setHeader(val)
  }
  console.log(item)
  console.log(NavCollectons)
  return (
    <>
      <div>
        <div className="pt-10 flex items-center justify-between">
        <IconButton
                        onClick={() => deletee()}
                        className="bg-red-500 rounded-md ml-3"
                        icon={<Trash size={20} className="text-white" />}
                      ></IconButton>   <Heading title={header} description="Manage Navbar for your store" /> 
     
          <Button onClick={() => addNavbarCollection()}>
            <Plus className="mr-2 h-4 w-4" /> Add New Nav Label
          </Button>
        </div>
        <Separator />
        <Label>Navbar Label </Label>
        <Input type="text" onChange={(e)=>changedd(e.target.value)}/>
        <Tabs value={NavigatorValue} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            {NavCollectons.map((collection, index) => (
             <>
             {collection.navitemId.toString()==item.id.toString()?
                <TabsTrigger
                key={index}
                  onClickCapture={() => setNavigatorValue(index.toString())}
                  value={index.toString()}
                  className="flex justify-between align-middle p-0 h-8"
                >
                  <Button
                    onClick={() => setCollectionInPrev(index)}
                    disabled={NavCollectons.length === 1 || index === 0}
                    variant={"ghost"}
                    className="flex justify-center align-middle hover:bg-slate-400 w-3 h-5 py-2 pb-2 mx-3"
                  >
                    {"<"}
                  </Button>
                  <div className="my-4">
                    {collection.Label.length === 0
                      ? `Label ${index + 1}`
                      : collection.Label}
                  </div>
                  <Button
                    onClick={() => setCollectionInNext(index)}
                    variant={"ghost"}
                    disabled={NavCollectons.length === 1 || index === NavCollectons.length - 1}
                    className="flex justify-center align-middle hover:bg-slate-400 w-3 h-5 py-2 pb-2 mx-3"
                  >
                    {">"}
                  </Button>
                </TabsTrigger>:<></>
             }
           </>
            ))}
          </TabsList>
          {NavCollectons.map((i, k) => (
            <TabsContent value={k.toString()} key={k}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex align-middle">
                    <div className="flex align-middle">
                      {i.Label.length === 0 ? (
                        <>
                          <div> Label {(k + 1).toString()}</div>
                        </>
                      ) : (
                        <div className="my-auto">{i.Label}</div>
                      )}
                      <IconButton
                        onClick={() => removelabel(k)}
                        className="bg-red-500 rounded-md ml-3"
                        icon={<Trash size={20} className="text-white" />}
                      ></IconButton>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Click save when you&apos;re done.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">Label Name</Label>
                    <Input
                      id="name"
                      onChange={(e) => {
                        let col = NavCollectons;
                        col[k].Label = e.target.value;
                        setNavCollectons([...col]);
                        console.log(NavCollectons);
                      }}
                    />
                  </div>
                  {i.CathegoryCollectiondata.map((lab, index) => (
                    <div className="grid grid-cols-2 w-96 align-middle" key={index}>
                      <div className="my-auto text-large flex-wrap min-w-max"> {lab.Label}</div>
                      {index==0 ?<></>:<Button  variant={"default"} className="w-16 p-0 bg-slate-600"><svg fill="currentColor" height="20px" width="20px" version="1.1" id="Layer_1" 	 viewBox="0 0 330 330" >
                    <path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394
                      l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393
                      C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"/>
                    </svg></Button >}
                      
                      {index+1==i.CathegoryCollectiondata.length?<></>:
                        <Button variant={"default"}  className="w-16 p-0 bg-slate-600">
                        <svg fill="currentColor" height="20px" width="20px" version="1.1" id="Layer_1"  
     viewBox="0 0 330 330">
  <path id="XMLID_225_" d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
    c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
    s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"/>
  </svg>
                        </Button>

                      }
                    
                    </div>
                  ))}
                  <div className="space-y-1">
                    <Button onClick={() => {
                      setDialogOpen(true);
                      setcurrentDialgId(k);
                    }}>add Labels</Button>
                  </div>
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            </TabsContent>
          ))}
          <Dialog data={categories} id={currentDialgId} handlechange={(i, g) => { handleupdate(i, g) }} onClose={() => { setDialogOpen(false) }} openDialg={dialogOpen} prodList={[]} />
        </Tabs>
        <Button onClick={() => onSubmit()}>Save changes</Button>
      </div>
    </>
  );
};
