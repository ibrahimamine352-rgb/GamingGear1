import { Product } from '@prisma/client';
import axios from 'axios';
import { useState, useEffect } from 'react';

interface Item {
  id: number;
  name: string;
  price: number;
  option1: boolean; // Add more properties as needed
  option2: boolean;
  // Add more properties as needed
}

const SearchComponent = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Product[]>([]);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [checkboxFilters, setCheckboxFilters] = useState({
    option1: false,
    option2: false,
    // Add more options as needed
  });

  useEffect(() => {
    // Simulate API call to fetch data
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace the API endpoint with your actual endpoint
        const response = await  axios.get('/api/motherboard/component', {
            params: {
              storeId: '',
              page: 1,
              units: 10,
              q: '',
            },
          });
        const result = await response.data;
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
    const filtered = data.filter((item) => parseInt(item.price.toString()) <= parseInt(priceFilter, 10));

    setFilteredData(filtered);
  };

  const handleCheckboxFilter = (option: keyof typeof checkboxFilters) => {
    setCheckboxFilters({
      ...checkboxFilters,
      [option]: !checkboxFilters[option],
    });

    // Filter data based on checkbox filters
    const filtered = data.filter((item) =>
      checkboxFilters.option1 ? item.stock : true &&
      checkboxFilters.option2 ? item.description : true
      // Add more conditions for additional checkbox filters
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
        <option value="10">$10</option>
        <option value="20">$20</option>
        <option value="30">$30</option>
        {/* Add more price options as needed */}
      </select>

      <label>
        <input
          type="checkbox"
          checked={checkboxFilters.option1}
          onChange={() => handleCheckboxFilter('option1')}
        />
        Option 1
      </label>

      <label>
        <input
          type="checkbox"
          checked={checkboxFilters.option2}
          onChange={() => handleCheckboxFilter('option2')}
        />
        Option 2
      </label>

      {loading && <p>Loading...</p>}

      {!loading && filteredData.length === 0 && <p>No results found.</p>}

      {!loading && filteredData.length > 0 && (
        <ul>
          {filteredData.map((item) => (
            <li key={item.id}>{item.name} - ${item.price.toString()}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchComponent;
