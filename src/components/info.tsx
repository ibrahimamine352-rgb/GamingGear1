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
    cart.addItem({ ...data, number: 1 });
  };

  const unavailable = Boolean(data.comingSoon || data.outOfStock);

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">{data.name}</h1>

      <hr className="my-4 border-border" />
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold"></h3>
          <p className="text-foreground/70">
            {data.description}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div className="flex items-center flex-col text-center space-y-0 text-2xl my-2 mt-auto">
          {data?.dicountPrice > 0 && (
            <span className="line-through mt-3 text-foreground/50">
              <Currency value={data?.dicountPrice} />
            </span>
          )}
          <b className="my-2 text-3xl font-bold text-[#00e0ff]">
            <Currency value={data?.price} />
          </b>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-x-3">
        {!unavailable ? (
          <Button type="button" onClick={onAddToCart} aria-label="Add to cart">
            Add To Cart
            <ShoppingCart size={20} />
          </Button>
        ) : (
          <span className="bg-[hsl(var(--promo))] text-black font-semibold px-3 py-1 rounded-full">
            {data.comingSoon ? "COMING SOON" : "OUT OF STOCK"}
          </span>
        )}
      </div>
    </div>
  );
}

export default Info;
