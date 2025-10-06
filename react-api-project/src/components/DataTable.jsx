import React, { useState, useMemo } from 'react';
import { HiChevronLeft } from "react-icons/hi";
import { HiChevronRight } from "react-icons/hi";
import { HiChevronDoubleRight } from "react-icons/hi";
import { HiChevronDoubleLeft } from "react-icons/hi";

const DataTable = ({ isDetailPage = false }) => {
  // Static sample data - you can replace with your own data
  const [data] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 28, city: 'New York', department: 'Engineering', salary: 75000 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 34, city: 'Los Angeles', department: 'Marketing', salary: 65000 },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', age: 42, city: 'Chicago', department: 'Sales', salary: 80000 },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', age: 29, city: 'Houston', department: 'HR', salary: 55000 },
    { id: 5, name: 'David Brown', email: 'david@example.com', age: 37, city: 'Phoenix', department: 'Engineering', salary: 72000 },
    { id: 6, name: 'Emily Davis', email: 'emily@example.com', age: 31, city: 'Philadelphia', department: 'Marketing', salary: 68000 },
    { id: 7, name: 'Chris Anderson', email: 'chris@example.com', age: 45, city: 'San Antonio', department: 'Sales', salary: 85000 },
    { id: 8, name: 'Lisa Martinez', email: 'lisa@example.com', age: 26, city: 'San Diego', department: 'HR', salary: 52000 },
    { id: 9, name: 'Robert Taylor', email: 'robert@example.com', age: 39, city: 'Dallas', department: 'Engineering', salary: 78000 },
    { id: 10, name: 'Amanda Garcia', email: 'amanda@example.com', age: 33, city: 'San Jose', department: 'Marketing', salary: 67000 },
    { id: 11, name: 'James Rodriguez', email: 'james@example.com', age: 41, city: 'Austin', department: 'Sales', salary: 82000 },
    { id: 12, name: 'Jessica Lee', email: 'jessica@example.com', age: 27, city: 'Jacksonville', department: 'HR', salary: 54000 },
    { id: 13, name: 'Daniel White', email: 'daniel@example.com', age: 36, city: 'Fort Worth', department: 'Engineering', salary: 74000 },
    { id: 14, name: 'Michelle Harris', email: 'michelle@example.com', age: 30, city: 'Columbus', department: 'Marketing', salary: 66000 },
    { id: 15, name: 'Kevin Martin', email: 'kevin@example.com', age: 44, city: 'Charlotte', department: 'Sales', salary: 87000 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(isDetailPage ? 10 : 4); // Show fewer rows in card view
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    let sortableData = [...filteredData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // Column configuration
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'age', label: 'Age', sortable: true },
    { key: 'city', label: 'City', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'salary', label: 'Salary', sortable: true, formatter: (value) => `$${value.toLocaleString()}`  },//formatter: (value) => `$${value.toLocaleString()}` 
  ];

  // Handle sorting
  const handleSort = (key) => {
    
    if (!key.sortable) return;
    setSortConfig((prevConfig) => {
      if (prevConfig.key !== key.key) {
        return { key: key.key, direction: 'asc' };
      }
      return {
        key: key.key,
        direction: prevConfig.direction === 'asc' ? 'desc' : 'asc',
      };
    });
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Download Excel functionality
  const downloadExcel = () => {
    const headers = columns.map(col => col.label).join(',');
    const csvContent = [
      headers,
      ...sortedData.map(row => 
        columns.map(col => 
        //   col.formatter ? col.formatter(row[col.key]) : 
          row[col.key]
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `data-table-${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`container mx-auto bg-gray-100 rounded ${isDetailPage ? 'px-4 py-8 min-h-[600px]' : 'px-2 py-4 h-48 overflow-auto'}`}>
      {/* Controls: Search and Download (hidden in card view) */}
      {isDetailPage && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Employee Data Table</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={downloadExcel}
            className="mt-4 md:mt-0 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Excel</span>
            -
          </button>
        </div>
      )}

      {/* Table */}
      <div className={`bg-white rounded-lg shadow ${isDetailPage ? '' : 'overflow-hidden'}`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => isDetailPage && handleSort(column)} // Disable sorting in card view
                  className={`px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    isDetailPage && column.sortable ? 'cursor-pointer hover:bg-gray-100' : 'cursor-default'
                  } ${isDetailPage ? '' : 'text-[10px]'}`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {isDetailPage && sortConfig.key === column.key && (
                      <svg
                        className={`w-3 h-3 ${
                          sortConfig.direction === 'asc' ? 'text-green-500' : 'text-red-500'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {sortConfig.direction === 'asc' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        )}
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-3 py-2 whitespace-nowrap text-sm text-gray-900 ${isDetailPage ? '' : 'text-[10px]'}`}
                    >
                      {column.formatter ? column.formatter(row[column.key]) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-3 py-4 text-center text-gray-500 text-sm">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (shown only in detail view) */}
      {isDetailPage && totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-700 mb-4 sm:mb-0">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <HiChevronDoubleLeft />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
             <HiChevronLeft />

            </button>
            <div className="flex space-x-1">
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-50 transition-colors'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <HiChevronRight />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <HiChevronDoubleRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;