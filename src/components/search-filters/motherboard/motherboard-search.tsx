import { useState, useEffect } from 'react';
import PriceFilter from '../price-filter';
import { Product } from "@/types";
import { Button } from '@/components/ui/button';
import { fetchData } from 'next-auth/client/_utils';

import { useLanguage } from "@/context/language-context";
import { UI_TEXT } from "@/i18n/ui-text";

interface SearchComponentProps {
 
  setLoading: (values: boolean) => void;
  setTotalPages: (values: number) => void;
  totalPages:number
  setCurrentPage: (values: number) => void;
  currentPage:number
  searchTerm:string
  setSearchTerm: (value:string) => void;
  fetchData:() => void;
  priceFilter:number[]
  setPriceFilter:(value:number[])=>void

}
const SearchComponent: React.FC<SearchComponentProps>  = ({priceFilter,setPriceFilter,fetchData,searchTerm,setSearchTerm,setLoading,setTotalPages,setCurrentPage,totalPages,currentPage}) => {
  const { lang } = useLanguage();
  const ui = UI_TEXT[lang];


  return (
    <div>
      <input
        type="text"
        placeholder={ui.searchPlaceholder}

        value={searchTerm}
        onChange={(e)=>setSearchTerm(e.target.value)}
                        className="
    w-full rounded-xl p-3
    bg-transparent
    border-2 border-[hsl(var(--promo))]
    text-foreground placeholder:text-muted-foreground
    focus:outline-none
    focus:border-[hsl(var(--promo))]
    focus:shadow-[0_0_10px_hsl(var(--promo)/0.30)]
    transition-all duration-300
  "
        onKeyDown={ (e) => {
          console.log(e)
          if (e.key === 'Enter') {
            // Handle "Enter" key press
            setCurrentPage(0);
            setLoading(true);
            fetchData();
          }
        }}
      />


      <div className='w-full'>
     

        <PriceFilter setLoading={setLoading} value={priceFilter} handlePriceFilter={setPriceFilter} />
      </div>  
   

  

    
    </div>
  );
};

export default SearchComponent;
