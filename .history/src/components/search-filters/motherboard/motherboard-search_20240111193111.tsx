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
  
}
const SearchComponent: React.FC<SearchComponentProps>  = ({setProducts,setLoading,setTotalPages,setCurrentPage,totalPages,currentPage}) => {

  const [data, setData] = useState<Product[]>([]);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState< number[]>([0, 5000]);
  const [checkboxFilters, setCheckboxFilters] = useState<string[]>([]);
  const fetchData = async ( ) => {
    try {
      setLoading(true);
      // Replace the API endpoint with your actual endpoint
      const response = await fetch(`/api/motherboard/component?q=${searchTerm}&page=${currentPage}&units=8`);
      const result = await response.json();
      setData(result);
      setFilteredData(result); // Initialize filtered data with all data
      setProducts(result )
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Simulate API call to fetch data
   

    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    // Filter data based on search term
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filtered1 = filtered.filter((item) => {
      if(  item.price)
      if( item.price >= priceFilter[0]&&item.price.toNumber() <= priceFilter[1])
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
