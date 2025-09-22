import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { persist, createJSONStorage } from 'zustand/middleware';

import { AlertTriangle } from 'lucide-react';
import { Product } from '@/types';

export type PCCustom = {
  idd:string
  Title:string
  price:number
  reduction:number
  motherboard: Product;
  processor: Product;
  gpu?: Product;
  ram: Product[];
  disk: Product;
  disk2?: Product|undefined;
  power: Product;
  case: Product;
  screen?: Product|undefined;
  cooling?: Product|undefined;
  
}
export type PackCustom = {
  idd:string
  Title:string
  price:number
  reduction:number
  packId:String;
packTitle:String;
packImage:String;
  defaultKeyboard?: Product|undefined,
  defaultMouse?: Product|undefined,
  defaultMousePad?: Product|undefined,
  defaultMics?: Product|undefined,
  defaultHeadset?: Product|undefined,
  defaultCamera?: Product|undefined,
  defaultScreen?: Product|undefined,
  DefaultSpeaker?: Product|undefined,
  DefaultManette?: Product|undefined,
  DefaultChair?: Product|undefined
  
}
// Define a union type that includes both Product and PCCustom
export type CartItem = (Product | PCCustom|PackCustom)&{
 
  number:number
};

interface CartStore {
  items: CartItem[];
  addItem: (data: CartItem) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>((set, get) => ({
    items: [],
    addItem: (data: CartItem) => {
      // Check if data is a Product

      if ('id' in data) {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) =>'id' in item && item.id === data.id);

        if (existingItem) {
          return toast('Item already in cart.');
        } 

        set({ items: [...get().items, data] });
        toast.success('Item added to cart.');
      }else{
        console.log(  get().items)
        set({ items: [...get().items, data] });
      
        toast.success('Item added to cart.');
      }
    },
    removeItem: (id: string) => {
      set({ items: [...get().items.filter((item) => (('idd' in item && item.idd !== id)||('id' in item && item.id !== id)))] });
   
      toast.success('Item removed from cart.');
    },
    removeAll: () => set({ items: [] }),
  }), {
    name: 'cart-storage',
    storage: createJSONStorage(() => localStorage),
  })
);

export default useCart;
