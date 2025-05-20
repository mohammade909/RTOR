import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';

export default function DirectMembersTable() {
  // Sample financial/trading data
  const initialData = [
    { id: 1, symbol: "AAPL", name: "Apple Inc.", price: 174.79, change: 1.25, changePercent: 0.72, volume: "64.35M", marketCap: "2.74T" },
    { id: 2, symbol: "MSFT", name: "Microsoft Corp.", price: 386.64, change: -3.15, changePercent: -0.81, volume: "28.19M", marketCap: "2.87T" },
    { id: 3, symbol: "GOOGL", name: "Alphabet Inc.", price: 165.27, change: 2.34, changePercent: 1.44, volume: "19.23M", marketCap: "2.06T" },
    { id: 4, symbol: "AMZN", name: "Amazon.com Inc.", price: 178.87, change: -1.18, changePercent: -0.66, volume: "31.48M", marketCap: "1.86T" },
    { id: 5, symbol: "NVDA", name: "NVIDIA Corp.", price: 106.12, change: 3.78, changePercent: 3.69, volume: "52.76M", marketCap: "2.61T" },
    { id: 6, symbol: "TSLA", name: "Tesla Inc.", price: 215.35, change: -4.23, changePercent: -1.93, volume: "94.36M", marketCap: "685.47B" },
    { id: 7, symbol: "META", name: "Meta Platforms Inc.", price: 487.98, change: 6.54, changePercent: 1.36, volume: "17.85M", marketCap: "1.24T" },
    { id: 8, symbol: "BRK.B", name: "Berkshire Hathaway", price: 407.31, change: 0.08, changePercent: 0.02, volume: "3.47M", marketCap: "887.56B" },
    { id: 9, symbol: "JPM", name: "JPMorgan Chase & Co.", price: 198.46, change: -1.87, changePercent: -0.93, volume: "8.76M", marketCap: "571.23B" },
    { id: 10, symbol: "V", name: "Visa Inc.", price: 276.45, change: 2.15, changePercent: 0.78, volume: "5.98M", marketCap: "564.38B" },
    { id: 11, symbol: "JNJ", name: "Johnson & Johnson", price: 151.67, change: -0.45, changePercent: -0.30, volume: "6.23M", marketCap: "365.25B" },
    { id: 12, symbol: "WMT", name: "Walmart Inc.", price: 67.94, change: 0.87, changePercent: 1.30, volume: "10.45M", marketCap: "547.12B" },
    { id: 13, symbol: "PG", name: "Procter & Gamble", price: 165.73, change: 0.35, changePercent: 0.21, volume: "4.76M", marketCap: "390.54B" },
    { id: 14, symbol: "MA", name: "Mastercard Inc.", price: 457.32, change: 3.68, changePercent: 0.81, volume: "2.34M", marketCap: "427.63B" },
    { id: 15, symbol: "UNH", name: "UnitedHealth Group", price: 526.19, change: -2.34, changePercent: -0.44, volume: "3.12M", marketCap: "484.71B" }
  ];

  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'marketCap', direction: 'descending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [changeFilter, setChangeFilter] = useState('All');
  
  // Sort function
  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting, filtering and search
  useEffect(() => {
    let result = [...data];
    
    // Apply change filter
    if (changeFilter === 'Positive') {
      result = result.filter(item => item.changePercent > 0);
    } else if (changeFilter === 'Negative') {
      result = result.filter(item => item.changePercent < 0);
    }
    
    // Apply search
    if (searchTerm) {
      result = result.filter(item => 
        item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      // Convert string numbers like "2.74T" to numeric values for proper sorting
      const getValue = (item, key) => {
        const value = item[key];
        if (typeof value === 'string' && value.includes('T')) {
          return parseFloat(value.replace('T', '')) * 1000;
        }
        if (typeof value === 'string' && value.includes('B')) {
          return parseFloat(value.replace('B', ''));
        }
        if (typeof value === 'string' && value.includes('M')) {
          return parseFloat(value.replace('M', '')) / 1000;
        }
        return value;
      };
      
      const aValue = getValue(a, sortConfig.key);
      const bValue = getValue(b, sortConfig.key);
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredData(result);
    if (result.length > 0 && currentPage > Math.ceil(result.length / itemsPerPage)) {
      setCurrentPage(1);
    }
  }, [searchTerm, sortConfig, changeFilter, data, currentPage, itemsPerPage]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Dark themed header with stats */}
      <div className="bg-gray-900 text-white p-4 rounded-t-lg border-b border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Market Overview</h2>
          <div className="flex space-x-6">
            <div>
              <div className="text-xs text-gray-400">S&P 500</div>
              <div className="flex items-center">
                <span className="font-semibold">5,137.08</span>
                <span className="text-green-500 ml-2 text-xs">+0.41%</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400">NASDAQ</div>
              <div className="flex items-center">
                <span className="font-semibold">16,284.38</span>
                <span className="text-green-500 ml-2 text-xs">+0.73%</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400">DOW</div>
              <div className="flex items-center">
                <span className="font-semibold">38,672.45</span>
                <span className="text-red-500 ml-2 text-xs">-0.13%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                placeholder="Search symbol or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter dropdown */}
            <div className="flex items-center">
              <div className="relative">
                <select 
                  value={changeFilter}
                  onChange={(e) => setChangeFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="All">All Changes</option>
                  <option value="Positive">Gainers</option>
                  <option value="Negative">Losers</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SlidersHorizontal size={14} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-gray-400">
            {filteredData.length} securities
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto bg-gray-900 rounded-b-lg shadow-xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-gray-300 border-b border-gray-700">
              <th 
                className="text-xs font-semibold uppercase px-6 py-3 text-left cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => sortData('symbol')}
              >
                <div className="flex items-center space-x-1">
                  <span>Symbol</span>
                  {sortConfig.key === 'symbol' && (
                    sortConfig.direction === 'ascending' 
                      ? <ArrowUp size={14} className="text-blue-400" /> 
                      : <ArrowDown size={14} className="text-blue-400" />
                  )}
                </div>
              </th>
              <th 
                className="text-xs font-semibold uppercase px-6 py-3 text-left cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => sortData('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {sortConfig.key === 'name' && (
                    sortConfig.direction === 'ascending' 
                      ? <ArrowUp size={14} className="text-blue-400" /> 
                      : <ArrowDown size={14} className="text-blue-400" />
                  )}
                </div>
              </th>
              <th 
                className="text-xs font-semibold uppercase px-6 py-3 text-right cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => sortData('price')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Price</span>
                  {sortConfig.key === 'price' && (
                    sortConfig.direction === 'ascending' 
                      ? <ArrowUp size={14} className="text-blue-400" /> 
                      : <ArrowDown size={14} className="text-blue-400" />
                  )}
                </div>
              </th>
              <th 
                className="text-xs font-semibold uppercase px-6 py-3 text-right cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => sortData('change')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Change</span>
                  {sortConfig.key === 'change' && (
                    sortConfig.direction === 'ascending' 
                      ? <ArrowUp size={14} className="text-blue-400" /> 
                      : <ArrowDown size={14} className="text-blue-400" />
                  )}
                </div>
              </th>
              <th 
                className="text-xs font-semibold uppercase px-6 py-3 text-right cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => sortData('changePercent')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>% Change</span>
                  {sortConfig.key === 'changePercent' && (
                    sortConfig.direction === 'ascending' 
                      ? <ArrowUp size={14} className="text-blue-400" /> 
                      : <ArrowDown size={14} className="text-blue-400" />
                  )}
                </div>
              </th>
              <th 
                className="text-xs font-semibold uppercase px-6 py-3 text-right cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => sortData('volume')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Volume</span>
                  {sortConfig.key === 'volume' && (
                    sortConfig.direction === 'ascending' 
                      ? <ArrowUp size={14} className="text-blue-400" /> 
                      : <ArrowDown size={14} className="text-blue-400" />
                  )}
                </div>
              </th>
              <th 
                className="text-xs font-semibold uppercase px-6 py-3 text-right cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => sortData('marketCap')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Market Cap</span>
                  {sortConfig.key === 'marketCap' && (
                    sortConfig.direction === 'ascending' 
                      ? <ArrowUp size={14} className="text-blue-400" /> 
                      : <ArrowDown size={14} className="text-blue-400" />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {currentItems.map((item) => (
              <tr 
                key={item.id} 
                className="border-b text-left border-gray-800 text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 font-medium text-blue-400">{item.symbol}</td>
                <td className="px-6 py-4 text-gray-200">{item.name}</td>
                <td className="px-6 py-4 text-right font-mono">${item.price.toFixed(2)}</td>
                <td className={`px-6 py-4 text-right font-mono ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                </td>
                <td className={`px-6 py-4 text-right font-mono ${item.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                </td>
                <td className="px-6 py-4 text-right font-mono text-gray-400">{item.volume}</td>
                <td className="px-6 py-4 text-right font-mono text-gray-200">{item.marketCap}</td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No securities found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between px-2">
        <div className="text-xs text-gray-500">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length}
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-md ${
              currentPage === 1 
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-blue-400'
            }`}
          >
            <ChevronLeft size={18} />
          </button>
          
          {/* Page numbers */}
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${
                    currentPage === pageNum 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-blue-400'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`p-2 rounded-md ${
              currentPage === totalPages || totalPages === 0 
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-blue-400'
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}