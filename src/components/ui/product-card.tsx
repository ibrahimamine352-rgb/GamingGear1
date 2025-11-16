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
  data: Product;
}

const ProductCard: React.FC<ProductCard> = ({ data }) => {
  const previewModal = usePreviewModal();
  const cart = useCart();
  const router = useRouter();

  const handleClick = () => router.push(`/product/${data?.id}`);

  const onPreview: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    previewModal.onOpen(data);
  };

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    const data1: CartItem = { ...data, number: 1 };
    cart.addItem(data1);
  };

  // --- Availability & badge logic ---
  const comingSoon = Boolean((data as any)?.comingSoon);
  const outOfStock = Boolean((data as any)?.outOfStock);
  const unavailable = comingSoon || outOfStock;

  const hasDiscount = Number(data?.dicountPrice) > 0;
  const showSale = !unavailable && hasDiscount;

  // One ribbon in SALE position (top-right). Priority: ComingSoon > OutOfStock > Sale
  let ribbonText: string | null = null;
  if (comingSoon) ribbonText = "COMING SOON";
  else if (outOfStock) ribbonText = "OUT OF STOCK";
  else if (showSale) ribbonText = "SALE";

  // Safe % OFF calc
  const discountPct =
    showSale && Number(data?.dicountPrice) > 0
      ? Math.max(
          0,
          Math.round(
            ((Number(data.dicountPrice) - Number(data.price)) /
              Number(data.dicountPrice)) *
              100
          )
        )
      : 0;

  const imgSrc = data?.images?.[0]?.url || "/placeholder.png";

  return (
    <div
      onClick={handleClick}
      className="glass-card group cursor-pointer rounded-xl p-3 hover:border-[hsl(var(--accent))]/40 hover:shadow-[0_0_30px_rgba(56,189,248,0.20)] transition-all duration-300"
    >
      {/* Image & actions */}
      <div className="flex flex-col h-full justify-between">
        <div className="relative md:aspect-square aspect-[4/3] rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-border/10">
          {/* Ribbon in the same place as your SALE tag */}
          {ribbonText && (
            <div className="absolute top-2 right-2 z-20 rotate-[25deg]">
              <div
                className="font-bold px-3 py-1 rounded-full text-sm bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-[hsl(var(--promo))]"
              >
                {ribbonText}
              </div>
            </div>
          )}
    <div className="absolute inset-0 overflow-hidden rounded-xl">

          <Image
            src={imgSrc}
            alt={data?.name || "product image"}
            fill
            className="md:aspect-square aspect-[4/3] object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          {/* Actions (hide Add to cart when unavailable) */}
          <div className="hidden md:block opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
            <div className="flex gap-x-6 justify-center">
              <IconButton
                onClick={onPreview}
                icon={<Expand size={20} className="text-foreground" />}
              />
              {!unavailable && (
                <IconButton
                  onClick={onAddToCart}
                  icon={<ShoppingCart size={20} className="text-foreground" />}
                />
              )}
                          </div>

            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="font-semibold md:text-lg text-[15px] text-foreground line-clamp-2">
            {data.name}
          </p>
          <p className="text-sm text-foreground/70 mt-2">{data.category?.name}</p>
        </div>

        {/* Price & Discount */}
        <div className="flex items-center flex-col text-centerspace-y-3 md:space-y-4 text-lg my-2 mt-auto">
          {showSale && (
            <span className="line-through mt-3 text-foreground/50">
              <Currency value={data?.dicountPrice} />
            </span>
          )}
          <b className="mt-2 flex items-center flex-col text-center space-y-0 text-lg mt-auto">
            <Currency value={data?.price} />
          </b>
          {showSale && (
            <div className="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-[hsl(var(--promo))] text-xs font-bold px-2 py-1 rounded-full mt-1">
              {discountPct}% OFF
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
