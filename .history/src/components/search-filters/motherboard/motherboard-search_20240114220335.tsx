import { useState, useEffect } from 'react';
import PriceFilter from '../price-filter';
import { Product } from "@/types";
import { Button } from '@/components/ui/button';
import { fetchData } from 'next-auth/client/_utils';



interface SearchComponentProps {
  setProducts: (values: Product[]) => void;
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
const SearchComponent: React.FC<SearchComponentProps>  = ({fetchData,searchTerm,setSearchTerm,setProducts,setLoading,setTotalPages,setCurrentPage,totalPages,currentPage}) => {

  const [data, setData] = useState<Product[]>([]);
  const [filteredData, setFilteredData] = useState<Product[]>([]);

  const [priceFilter, setPriceFilter] = useState< number[]>([0, 5000]);
  const [checkboxFilters, setCheckboxFilters] = useState<string[]>([]);
 
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    // Filter data based on search term
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filtered1 = filtered.filter((item) => {
      if(  item.price)
      if( item.price >= priceFilter[0]&&item.price <= priceFilter[1])
      return item
     });

    setFilteredData(filtered1);
    setLoading(false)
    setProducts(filtered1 )
  };


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
