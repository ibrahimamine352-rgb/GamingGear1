"use client";

import { Plus } from "lucide-react";
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
import { Cathegorilab, CathegoryCollection } from "@prisma/client";
import { useState } from "react";
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
  data
}) => {
  const params = useParams();
  const router = useRouter();
  const [NavCollectons,setNavCollectons]=useState<LocalCathegoryCollection[]>(data)
  const addNavbarCollection=()=>{
    const newn ={
        id       :       ""    ,    
        Label     :      "",
        index      :     0 ,
        CathegoryCollectiondata :[]
    }
    setNavCollectons([...NavCollectons,newn])

  }
console.log(data)
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Navbar" description="Manage Navbar for your store" />
        <Button onClick={() => addNavbarCollection()}>
          <Plus className="mr-2 h-4 w-4" /> Add New Nav Label
        </Button>
      </div>
      <Separator />
      <Tabs defaultValue="account" className="w-[400px]">
      {
            NavCollectons.map(
                ()=>(<>
               
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="@peduarte" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>

                
                </>)
            )
        }    </Tabs>
    </>
  );
};
