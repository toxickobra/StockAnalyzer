import React, { useEffect, useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import SaveScreenPopup from '../components/SaveScreenPopup';

function QueryResult() {
  const location = useLocation();

  // Extract the query parameter from the URL
  const query = new URLSearchParams(location.search).get('query') || '';

  // Clean the query string by decoding and removing unwanted characters
  const cleanQuery = decodeURIComponent(query).replace(/%0D%0A/g, ' ').trim();

  const [stockData, setStockData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [sortConfig, setSortConfig] = useState({
    key: 'Market Capitalization (B)', // Default sorting column
    direction: 'ascending',
  });

  const [isModalOpen, setIsModalOpen] = useState(false); // For controlling the popup modal visibility

  const [savedScreens, setSavedScreens] = useState([]);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    // Load the saved screens from local storage
    const saved = JSON.parse(localStorage.getItem('savedScreens')) || [];
    setSavedScreens(saved);

    // Get the current path
    setCurrentPath(location.pathname + location.search);

    // Load the Excel data
    fetch('/yourfile.xlsx')
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setStockData(jsonData);
      })
      .catch((error) => {
        console.error('Error loading the Excel file:', error);
      });
  }, [location]);

  const applyQuery = (data, query) => {
    const conditions = query.split('AND').map((cond) => cond.trim());

    return data.filter((item) => {
      return conditions.every((cond) => {
        const match = cond.match(/(.*?)\s*([><=]+)\s*(.*)/);
        if (!match) return false;

        const field = match[1].trim();
        const operator = match[2].trim();
        const value = parseFloat(match[3].trim());
        const itemValue = parseFloat(item[field]);

        if (isNaN(itemValue)) return false;

        switch (operator) {
          case '>':
            return itemValue > value;
          case '<':
            return itemValue < value;
          case '>=':
            return itemValue >= value;
          case '<=':
            return itemValue <= value;
          case '==':
            return itemValue === value;
          default:
            return false;
        }
      });
    });
  };

  useEffect(() => {
    const filtered = applyQuery(stockData, cleanQuery);
    setFilteredData(filtered);
  }, [stockData, cleanQuery]);

  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  const handleSort = (column) => {
    setSortConfig((prev) => ({
      key: column,
      direction: prev.key === column && prev.direction === 'ascending' ? 'descending' : 'ascending',
    }));
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStocks = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSaveScreen = () => {

    setIsModalOpen(true); // Open the modal when Save Screen button is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal when clicking on close button
  };

  const handleSaveModal = () => {
    setIsModalOpen(false); // Close the modal when clicking on save button
  };

  const handleDeleteScreen = () => {
    const updatedScreens = savedScreens.filter(screen => screen.link !== currentPath);
    localStorage.setItem('savedScreens', JSON.stringify(updatedScreens));
    setSavedScreens(updatedScreens);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4">Query Results</h2>
        <div className='gap-5 flex'>
          {savedScreens.some(screen => screen.link === currentPath) && (
            <button
              className='border p-2 rounded-lg'
              onClick={handleDeleteScreen}
            >
              Delete Screen
            </button>
          )}
          <button
            className="SaveScreen bg-[#625afc] text-white font-semibold px-5 py-2 rounded-md text-[1rem]"
            onClick={handleSaveScreen}
          >
            Save Screen
          </button>
        </div>
      </div>
      <p>Total Stocks: {sortedData.length}</p>

      {sortedData.length > 0 && (
        <div className="overflow-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">S.No.</th>
                <th className="px-4 py-2 text-left">Ticker</th>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort('Market Capitalization (B)')}
                >
                  Market Cap (B)
                  {sortConfig.key === 'Market Capitalization (B)' &&
                    (sortConfig.direction === 'ascending' ? <FaArrowUp /> : <FaArrowDown />)}
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort('P/E Ratio')}
                >
                  P/E Ratio
                  {sortConfig.key === 'P/E Ratio' &&
                    (sortConfig.direction === 'ascending' ? <FaArrowUp /> : <FaArrowDown />)}
                </th>
                {/* Add other columns here */}
              </tr>
            </thead>
            <tbody>
              {currentStocks.map((stock, index) => (
                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{indexOfFirstItem + index + 1}</td>
                  <td className="px-4 py-2">{stock.Ticker}</td>
                  <td className="px-4 py-2">{stock['Market Capitalization (B)']}</td>
                  <td className="px-4 py-2">{stock['P/E Ratio']}</td>
                  {/* Add other data columns here */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-gray-200 p-2 rounded"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="bg-gray-200 px-4 py-2 rounded"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Save Screen Popup */}
      {isModalOpen && (
        <SaveScreenPopup
          onCancel={handleCloseModal}
          onSave={handleSaveModal}
        />
      )}
    </div>
  );
}

export default QueryResult;
