import { useState, useEffect } from 'react';
import PriceFilter from '../price-filter';

interface Item {
  id: number;
  name: string;
  price: number;
  options: string[]; // Assuming options is an array of strings, adjust as needed
  // Add more properties as needed
}

const SearchComponent = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Item[]>([]);
  const [filteredData, setFilteredData] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
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

    setFilteredData(filtered);
  };

  const handlePriceFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const priceFilter = e.target.value;
    setPriceFilter(priceFilter);

    // Filter data based on price
    const filtered = data.filter((item) => item.price <= parseInt(priceFilter, 10));

    setFilteredData(filtered);
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
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <select value={priceFilter} onChange={handlePriceFilter}>
        <option value="">Select Price</option>
        <option value="20">$20</option>
        <option value="30">$30</option>
      </select>
      <div className='w-100'>
        <h1>Prix</h1>
        <PriceFilter />
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
