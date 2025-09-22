"use client";

const axios = require("axios");
import { Copy, Edit, MoreHorizontal, Printer, OrbitIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { OrderColumn } from "./columns";
import { OrderStausAlertModal } from "@/components/modals/order-statu";

interface CellActionProps {
  data: OrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpenm] = useState(false);
  const [opend, setOpenmd] = useState(false);
  const router = useRouter();
  const params = useParams();
  const setOpen = (par: boolean) => {
    setOpenm(par);
    setOpenmd(false)
    if (par === false) {
      try {
      
        if (par == false) {
          setOpenm(false)
          setOpenmd(false)
          setTimeout(() => {
            document.body.style.pointerEvents = ''; // Enable pointer events after the delay
    
          }, 1000); // 2000 milliseconds (2 seconds) delay
         
      
        }else{
          setOpenm(true)
          setOpenmd(false)
        }
      } catch (error) {
        
      }
    }
  };
  const [status, setstatu] = useState(data.isPaid);
  const [archive, setarchive] = useState(data.archivee);
 
  const onConfirm = async () => {
    try {
      setLoading(true);
      // Use fetch for PATCH request
      await fetch(`/api/checkout/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status,archive }),
      });
      toast.success('Order updated successfully.');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Product ID copied to clipboard.');
  }

  return (
    <> 
      <OrderStausAlertModal 
        isOpen={open} 
        statu={status}
        Archive={archive}
        setArchive={setarchive}
        setstatu={setstatu}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onCopy(data.id)}
          >
            <Copy className="mr-2 h-4 w-4" /> Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/orders/${data.id}`)}
          >
            <Printer className="mr-2 h-4 w-4" /> Imprimer
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
          >
            <OrbitIcon className="mr-2 h-4 w-4" /> chnger Statu
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};


