"use client";

import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Adressdetails from "./adress-details";

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  useEffect(() => {
    if (searchParams.get('success')) {
      toast.success('Payment completed.');
      removeAll();
    }

    if (searchParams.get('canceled')) {
      toast.error('Something went wrong.');
    }
  }, [searchParams, removeAll]);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price)
  }, 0);

  const onCheckout = async () => {
    const response = await axios.post(`/api/checkout`, {
      productIds: items.map((item) => {if("id"in item)return item.id}),
      pc: items.map((item) => {if("idd"in item)return item.idd})
    });
    
    window.location = response.data.url;
  }
  
  return (
    <div
      className="mt-16 rounded-2xl border border-border bg-card backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.02)] glass-card px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 className="text-lg font-medium text-foreground">
        Order Summary
      </h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="text-base font-medium text-foreground">Total</div>
          <div className="text-2xl font-bold text-[hsl(var(--accent))]">
            <Currency value={totalPrice} />
          </div>
        </div>
      </div>
      <Adressdetails data={items} totalPrice={totalPrice} />
    </div>
  );
}
 
export default Summary;
