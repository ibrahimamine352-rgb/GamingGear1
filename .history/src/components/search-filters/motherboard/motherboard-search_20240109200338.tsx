import { useState, useEffect } from 'react';
import PriceFilter from '../price-filter';
import { Product } from '@prisma/client';
import { Button } from '@/components/ui/button';



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

  useEffect(() => {
    // Simulate API call to fetch data
    const fetchData = async ( ) => {
      try {
        setLoading(true);
        // Replace the API endpoint with your actual endpoint
        const response = await fetch(`/api/motherboard/component?q=${searchTerm}`);
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
      if(  item.price.toNumber())
      if( item.price.toNumber() >= priceFilter[0]&&item.price.toNumber() <= priceFilter[1])
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
      />


      <div className='w-full'>
     

        <PriceFilter setLoading={setLoading} value={priceFilter} handlePriceFilter={setPriceFilter} />
      </div>  
   

      {/* Checkbox filters as an array */}
      <Button className='w-full my-3' onClick={()=>{
       
       
       
              setLoading(true)
            }} >Filter</Button>

    
    </div>
  );
};

export default SearchComponent;
