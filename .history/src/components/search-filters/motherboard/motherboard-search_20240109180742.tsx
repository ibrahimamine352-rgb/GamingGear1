import { useState, useEffect } from 'react';
import PriceFilter from '../price-filter';
import { Product } from '@prisma/client';

interface Item {
  id: number;
  name: string;
  price: number;
  options: string[]; // Assuming options is an array of strings, adjust as needed
  // Add more properties as needed
}

interface SearchComponentProps {
  setProducts: (values: Product[]) => void;
}
const SearchComponent: React.FC<SearchComponentProps>  = ({setProducts}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Item[]>([]);
  const [filteredData, setFilteredData] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState< number[]>([0, 5000]);
  const [checkboxFilters, setCheckboxFilters] = useState<string[]>([]);

  useEffect(() => {
    // Simulate API call to fetch data
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace the API endpoint with your actual endpoint
        const response = await fetch('/api/motherboard/component');
        const result = await response.json();
        setData(result);
        setFilteredData(result); // Initialize filtered data with all data
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
    const filtered1 = filtered.filter((item) => item.price >= priceFilter[0]&&item.price <= priceFilter[1]);

    setFilteredData(filtered1);
    setLoading(false)
  };

  const handlePriceFilter = (e: number[]) => {
    const priceFilter = e;

    setPriceFilter(e)
    // Filter data based on price
    const filtered = data.filter((item) => item.price >= priceFilter[0]&&item.price <= priceFilter[1]);

    setFilteredData(filtered);
    setLoading(false)
  };

  const handleCheckboxFilter = (option: string) => {
    const updatedFilters = checkboxFilters.includes(option)
      ? checkboxFilters.filter((filter) => filter !== option)
      : [...checkboxFilters, option];

    setCheckboxFilters(updatedFilters);

    // Filter data based on checkbox filters
    const filtered = data.filter((item) =>
      checkboxFilters.every((filter) => item.options.includes(filter))
    );

    setFilteredData(filtered);
    setLoading(false)
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
      />


      <div className='w-full'>
     

        <PriceFilter setLoading={setLoading} value={priceFilter} handlePriceFilter={handlePriceFilter} />
      </div>  
   

      {/* Checkbox filters as an array */}
      <div>
        {['Option 1', 'Option 2', 'Option 3'].map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              checked={checkboxFilters.includes(option)}
              onChange={() => handleCheckboxFilter(option)}
            />
            {option}
          </label>
        ))}
      </div>

      {loading && <p>Loading...</p>}

      {!loading && filteredData.length === 0 && <p>No results found.</p>}

      {!loading && filteredData.length > 0 && (
        <ul>
          {filteredData.map((item) => (
            <li key={item.id}>{item.name} - ${item.price}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchComponent;
