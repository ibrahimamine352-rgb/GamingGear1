"use client";

import Image from "next/image";
import { MouseEventHandler } from "react";
import { Expand, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

import Currency from "@/components/ui/currency";
import IconButton from "@/components/ui/icon-button";
import usePreviewModal from "@/hooks/use-preview-modal";
import useCart, { CartItem } from "@/hooks/use-cart";
import { Product } from "@/types";

export interface ProductCard {
  data: Product
}

const ProductCard: React.FC<ProductCard> = ({
  data
}) => {
  const previewModal = usePreviewModal();
  const cart = useCart();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/product/${data?.id}`);
  };

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    previewModal.onOpen(data);
  };

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    const data1: CartItem = { ...data, number: 1 }
    cart.addItem(data1);
  };

  return (
    <div 
      onClick={handleClick} 
      className="glass-card group cursor-pointer rounded-xl p-3 hover:border-[hsl(var(--accent))]/40 hover:shadow-[0_0_30px_rgba(56,189,248,0.20)] transition-all duration-300"
    >
      {/* Image & actions */}
      {data.dicountPrice > 0 && (
        <div className="w-full flex justify-end">
          <div className="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-[hsl(var(--promo))] font-bold px-3 py-1 rounded-full text-sm transform rotate-[25deg] z-20 -mt-3 ml-auto">
            SALE
          </div>
        </div>
      )}
      
      <div className="flex flex-col h-full justify-between">
                        <div className="md:aspect-square aspect-[4/3] rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-border/10 relative overflow-hidden">
          <Image
            src={data.images?.[0]?.url}
            alt=""
            fill
            className="md:aspect-square aspect-[4/3] object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
          />
          <div className="hidden md:block opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
  <div className="flex gap-x-6 justify-center">
    <IconButton
      onClick={onPreview}
      icon={<Expand size={20} className="text-foreground" />}
    />
    <IconButton
      onClick={onAddToCart}
      icon={<ShoppingCart size={20} className="text-foreground" />}
    />
  </div>
</div>

        </div>
        
        {/* Description */}
        <div>
          <p className="font-semibold md:text-lg text-[15px] text-foreground line-clamp-2">{data.name}</p>
          <p className="text-sm text-foreground/70 mt-2">{data.category?.name}</p>
        </div>
        
        {/* Price & Review */}
        <div className="flex items-center flex-col text-centerspace-y-3 md:space-y-4 text-lg my-2 mt-auto">
          {data?.dicountPrice > 0 && (
            <span className="line-through mt-3 text-foreground/50">
              <Currency value={data?.dicountPrice} />
            </span>
          )}
                          <b className="mt-2 flex items-center flex-col text-center space-y-0 text-lg mt-auto">
            <Currency value={data?.price} />
          </b>
          {data?.dicountPrice > 0 && (
            <div className="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-[hsl(var(--promo))] text-xs font-bold px-2 py-1 rounded-full mt-1">
              {Math.round(((data.dicountPrice - data.price) / data.dicountPrice) * 100)}% OFF
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
