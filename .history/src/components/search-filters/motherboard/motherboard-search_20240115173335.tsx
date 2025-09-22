import { useState, useEffect } from 'react';
import PriceFilter from '../price-filter';
import { Product } from "@/types";
import { Button } from '@/components/ui/button';
import { fetchData } from 'next-auth/client/_utils';



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



  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e)=>setSearchTerm(e.target.value)}
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
