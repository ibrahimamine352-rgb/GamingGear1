"use client";

import { useEffect, useState } from 'react';

import Container from '@/components/ui/container';
import useCart from '@/hooks/use-cart';

import Summary from './components/summary'
import CartItem from './components/cart-item';
import { Button } from '@/components/ui/button';
import PcCartItem from './components/pc-cart-item';
import PackCartItem from './components/pack-cart-item';

export const revalidate = 0;

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="">
      <Container >
        <div className="px-4 py-16 sm:px-6 lg:px-8 bg-purple-300/60 dark:bg-purple-950/60 my-5 rounded-lg dark:text-white ">
          <h1 className="text-3xl font-bold text-black dark:text-white">Panier</h1>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              {cart.items.length === 0 && <p className="text-neutral-700 dark:text-neutral-300 ">Panier est Vide.</p>}
              {cart.items.length > 0 &&<Button onClick={()=>cart.removeAll()}>Vider Panier</Button>}
              <ul>
                {cart.items.map((item) => (
                  <>{
                    'packId'in item?<>
                      <PackCartItem key={item.idd} data={item} />
                           
                    </>:<>
                    {'id'in item?<>
                    <CartItem key={item.id} data={item} />
                    </>:<>
                    <PcCartItem key={item.idd} data={item} /></>

                    }
                   
                    </>
                  }
                  
                  </>
                  
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
