import React, { useEffect, useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';

function QueryResult() {
  const location = useLocation();
  const query = location.state?.query || '';
  const [stockData, setStockData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [sortConfig, setSortConfig] = useState({
    key: 'Market Capitalization (B)', // Default sorting column
    direction: 'ascending',
  });

  useEffect(() => {
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
  }, []);

  const applyQuery = (data, query) => {
    const conditions = query.split(' AND ').map((cond) => cond.trim());
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
            return true;
        }
      });
    });
  };

  useEffect(() => {
    const filtered = applyQuery(stockData, query);
    setFilteredData(filtered);
  }, [stockData, query]);

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

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Query Results</h2>
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
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort('ROE (%)')}
                >
                  ROE (%)
                  {sortConfig.key === 'ROE (%)' &&
                    (sortConfig.direction === 'ascending' ? <FaArrowUp /> : <FaArrowDown />)}
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort('Debt-to-Equity Ratio')}
                >
                  Debt-to-Equity
                  {sortConfig.key === 'Debt-to-Equity Ratio' &&
                    (sortConfig.direction === 'ascending' ? <FaArrowUp /> : <FaArrowDown />)}
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort('Dividend Yield (%)')}
                >
                  Dividend Yield (%)
                  {sortConfig.key === 'Dividend Yield (%)' &&
                    (sortConfig.direction === 'ascending' ? <FaArrowUp /> : <FaArrowDown />)}
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort('Revenue Growth (%)')}
                >
                  Revenue Growth (%)
                  {sortConfig.key === 'Revenue Growth (%)' &&
                    (sortConfig.direction === 'ascending' ? <FaArrowUp /> : <FaArrowDown />)}
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort('EPS Growth (%)')}
                >
                  EPS Growth (%)
                  {sortConfig.key === 'EPS Growth (%)' &&
                    (sortConfig.direction === 'ascending' ? <FaArrowUp /> : <FaArrowDown />)}
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort('Current Ratio')}
                >
                  Current Ratio
                  {sortConfig.key === 'Current Ratio' &&
                    (sortConfig.direction === 'ascending' ? <FaArrowUp /> : <FaArrowDown />)}
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort('Gross Margin (%)')}
                >
                  Gross Margin (%)
                  {sortConfig.key === 'Gross Margin (%)' &&
                    (sortConfig.direction === 'ascending' ? <FaArrowUp /> : <FaArrowDown />)}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentStocks.map((stock, index) => (
                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{indexOfFirstItem + index + 1}</td>
                  <td className="px-4 py-2">{stock.Ticker}</td>
                  <td className="px-4 py-2">{stock['Market Capitalization (B)']}</td>
                  <td className="px-4 py-2">{stock['P/E Ratio']}</td>
                  <td className="px-4 py-2">{stock['ROE (%)']}</td>
                  <td className="px-4 py-2">{stock['Debt-to-Equity Ratio']}</td>
                  <td className="px-4 py-2">{stock['Dividend Yield (%)']}</td>
                  <td className="px-4 py-2">{stock['Revenue Growth (%)']}</td>
                  <td className="px-4 py-2">{stock['EPS Growth (%)']}</td>
                  <td className="px-4 py-2">{stock['Current Ratio']}</td>
                  <td className="px-4 py-2">{stock['Gross Margin (%)']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-3 py-1 mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default QueryResult;
