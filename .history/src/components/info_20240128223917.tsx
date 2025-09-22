"use client";

import { ShoppingCart } from "lucide-react";

import Currency  from "@/components/ui/currency";
import { Product } from "@/types";
import useCart from "@/hooks/use-cart";
import { Button } from "./ui/button";

interface InfoProps {
  data: Product
};

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart();

  const onAddToCart = () => {
    
    cart.addItem({...data,number:1});
  }

  return ( 
    <div>
      <h1 className="text-3xl font-bold ">{data.name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl flex">
      <span className="line-through">  <Currency value={data?.dicountPrice} /> </span> <span><Currency value={data?.price} /> </span>
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold "></h3>
          <p>
            {data.description}
          </p>
         
        </div>
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button onClick={onAddToCart} className="flex items-center gap-x-2">
          Add To Cart
          <ShoppingCart size={20} />
        </Button>
      </div>
    </div>
  );
}
 
export default Info;
