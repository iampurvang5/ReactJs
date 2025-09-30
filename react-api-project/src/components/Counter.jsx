import React, { useState } from 'react';

const Counter = ({ isDetailPage }) => {
  const [count, setCount] = useState(0);

  return (
    <div className={`flex flex-col items-center justify-center bg-gray-100 rounded ${isDetailPage ? 'min-h-[400px]' : 'h-full'}`}>
      <h3 className="text-lg font-medium mb-4">Counter</h3>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          -
        </button>
        <span className="text-xl font-bold">{count}</span>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Counter;