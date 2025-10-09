import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Counter = ({ isDetailPage }) => {
	const theme = useSelector((state) => state.theme.mode);
	const [count, setCount] = useState(0);

	return (
	<div className={`flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gray-100 text-gray-800'} rounded ${isDetailPage ? 'min-h-[400px]' : 'h-full'}`}>
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