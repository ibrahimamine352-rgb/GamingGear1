"use client";

import { useEffect, useState } from 'react';

import Container from '@/components/ui/container';
import useCart from '@/hooks/use-cart';

import Summary from './components/summary'
import CartItem from './components/cart-item';
import { Button } from '@/components/ui/button';
import PcCartItem from './components/pc-cart-item';
import PackCartItem from './components/pack-cart-item';
import React from 'react';
import { useLanguage } from "@/context/language-context";
import { UI_TEXT } from "@/i18n/ui-text";
export const revalidate = 0;

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();
  const { lang } = useLanguage();
  const ui = UI_TEXT[lang];
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8 rounded-2xl border border-border bg-card backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.02)] glass-card my-5">
          <h1 className="text-3xl font-bold text-foreground">{ui.cartEmptyTitle}</h1>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              {cart.items.length === 0 && <p className="text-foreground/70 text-lg">{ui.cartEmptySubtitle}</p>}
              {cart.items.length > 0 && <Button onClick={() => cart.removeAll()} className="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-black font-semibold hover:shadow-[0_0_20px_rgba(0,224,255,0.3)]">{ui.cartClearButton}</Button>}
              <ul className="space-y-6">
                {cart.items.map((item) => (
                  <React.Fragment key={'id' in item ? item.id : item.idd}>
                    {'packId' in item ? (
                      <PackCartItem data={item} />
                    ) : (
                      'id' in item ? (
                        <CartItem data={item} />
                      ) : (
                        <PcCartItem data={item} />
                      )
                    )}
                  </React.Fragment>
                ))}
              </ul>
            </div>
            <Summary />
          </div>
        </div>
      </Container>
    </div>
  )
};

export default CartPage;
