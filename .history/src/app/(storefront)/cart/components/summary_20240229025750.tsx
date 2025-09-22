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
      className="mt-16 rounded-lg bg-purple-100/80 dark:bg-purple-950/80 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">
        Order summary
      </h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t dark:border-gray-700 border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900 dark:text-white">Order total</div>
         <Currency value={totalPrice} />
        </div>
      </div>
      <Adressdetails data={items} totalPrice={totalPrice}/>

    </div>
  );
}
 
export default Summary;
