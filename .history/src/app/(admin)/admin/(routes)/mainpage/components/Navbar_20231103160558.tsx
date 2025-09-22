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
import { CathegoryCollection } from "@prisma/client";

interface NavbarCollection {
  data: CathegoryCollection[];
}

export const Navbar: React.FC<NavbarCollection> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();
console.log(data)
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Navbar" description="Manage Navbar for your store" />
        
      </div>
      <Separator />
     
    </>
  );
};
