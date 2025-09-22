"use client";

import { Plus, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

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
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
 
import { columns, BillboardColumn } from "./columns";
import { Category, Cathegorilab, CathegoryCollection } from "@prisma/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Dialog from "./dialog";
import { ButtonIcon } from "@radix-ui/react-icons";
import IconButton from "@/components/ui/icon-button";
type LocalCathegorilab = {
    id  :            String  ,        
   index  :         number ,
   catId :          String , 
   Label  :         String
  }
  type LocalCathegoryCollection={
    id       :       String        
    Label     :      String
    index      :     number 
    CathegoryCollectiondata :LocalCathegorilab[]
  }
  interface NavbarCollection {
    data: LocalCathegoryCollection[];
    categories:Category[]
  }
   type SlidesColumn = {
    id: string
    title: string;
    imageUrl: string;
    description: string;
    url: string;
    discount:number;
    createdAt: string;
  }

export const Navbar: React.FC<NavbarCollection> = ({
  data,
  categories
}) => {
  const params = useParams();
  const router = useRouter();
  const [NavCollectons,setNavCollectons]=useState<LocalCathegoryCollection[]>(data)
  const [NavigatorValue,setNavigatorValue]=useState("")
  const addNavbarCollection=()=>{
    if(
        NavCollectons.length<6
    ){
        const newn ={
            id       :       ""    ,    
            Label     :    "Label "+ (NavCollectons.length+1).toString(),
            index      :     0 ,
            CathegoryCollectiondata :[]
        }
        setNavCollectons([...NavCollectons,newn])
        setNavigatorValue(NavCollectons.length.toString())
    }else{
        toast.error("max 6 Labels");
    }

   
  }
const setCollectionInPrev=(index:number)=>{
const prev=NavCollectons[index-1]
let col=NavCollectons
col[index-1]=col[index]
col[index]=prev
setNavCollectons([...NavCollectons])
setNavigatorValue((index-1).toString())

}

const [dialogOpen,setDialogOpen]=useState(false)
const [currentDialgId,setcurrentDialgId]=useState(0)

const setCollectionInNext=(index:number)=>{
    const prev=NavCollectons[index+1]
    let col=NavCollectons
    col[index+1]=col[index]
    col[index]=prev
    setNavCollectons([...NavCollectons])
    setNavigatorValue((index+1).toString())
    }
    const handleupdate=(data:Category[],index:number)=>{
        console.log(data,index)
        const dataa:LocalCathegorilab[]=data.map((i,k)=>{
return {
    id       :       ""    ,    
    Label     :    i.name,
    index      :     k,
    catId :          i.id , 

}
        })
        let newn = NavCollectons;
  
  const old = [...newn[index].CathegoryCollectiondata];
       newn[index].CathegoryCollectiondata=[...old,...dataa]
        setNavCollectons([...newn])
    }
const removelabel=(index:number)=>{

}

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Navbar" description="Manage Navbar for your store" />
        <Button onClick={() => addNavbarCollection()}>
          <Plus className="mr-2 h-4 w-4" /> Add New Nav Label
        </Button>
      </div>
      <Separator />
      <Tabs value={NavigatorValue} className="w-full">
      <TabsList className="grid w-full grid-cols-6">
  {NavCollectons.map((collection, index) => (
    <TabsTrigger onClickCapture={()=>setNavigatorValue(index.toString())} value={index.toString()} className="flex justify-between align-middle p-0 h-8">
     <Button  onClick={()=>setCollectionInPrev(index)} disabled={NavCollectons.length === 1 || index===0}   variant={"ghost"}  className="flex justify-center align-middle hover:bg-slate-400 w-3 h-5 py-2 pb-2 mx-3">{"<"}</Button> <div className="my-4">
     {collection.Label.length === 0 ? `Label ${index + 1}` : collection.Label}
     </div>
   
     <Button onClick={()=>setCollectionInNext(index)} variant={"ghost"} disabled={NavCollectons.length === 1|| index===NavCollectons.length-1} className="flex justify-center align-middle hover:bg-slate-400 w-3 h-5 py-2 pb-2 mx-3">{">"}</Button></TabsTrigger>
  ))}
</TabsList>
   {
            NavCollectons.map(
                (i,k)=>(<>
               
        <TabsContent value={k.toString()}>
        <Card>
          <CardHeader>
            <CardTitle className="flex align-middle" > {
                i.Label.length==0?<>  <div> Label {(k+1).toString()}</div> </>:<><div>{ i.Label}</div></>
            }<IconButton className="bg-red-500 rounded-md ml-3 "  icon={<Trash size={20} className="text-white" />}
            ></IconButton></CardTitle>
            <CardDescription>
             Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Label Name</Label>
              <Input id="name"  onChange={(e)=>{
                let col=NavCollectons
                col[k].Label=e.target.value
                setNavCollectons([...col])
                console.log(NavCollectons)
              }}  />
            </div>
            {
                i.CathegoryCollectiondata.map((lab)=>(<>
                lab
                </>))
            }
            <div className="space-y-1">
                <Button onClick={()=>{setDialogOpen(true);setcurrentDialgId(k)}} >add Labels</Button>
             </div>
               
          </CardContent>
          <CardFooter>
        
          </CardFooter>
        </Card>
      </TabsContent>
      </>)
            )         
             
        } 
    <Dialog data={categories} id={currentDialgId} handlechange={(i,g)=>{handleupdate(i,g)}} onClose={()=>{setDialogOpen(false)}} openDialg={dialogOpen} prodList={[]}/>

          
         </Tabs>    <Button>Save changes</Button>
    </>
  );
};
