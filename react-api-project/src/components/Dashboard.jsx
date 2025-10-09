import React, { useState,useEffect  } from 'react';
import * as XLSX from 'xlsx'; //npm install xlsx
import {
  PieChart, Pie, Tooltip, ResponsiveContainer, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line,
  FunnelChart, Funnel,
  AreaChart, Area,
  ScatterChart, Scatter, ZAxis,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts'; //npm install recharts
import { useSelector } from 'react-redux';
const Dashboard = ({ isDetailPage = false,initialData = [] }) => {
	const theme = useSelector((state) => state.theme.mode);
	// Static sample data
	const defaultData = [
	{ category: 'Electronics', sales: 1000, revenue: 1000 },
	{ category: 'Clothing', sales: 800, revenue: 2000 },
	{ category: 'Books', sales: 600, revenue: 3000 },
	{ category: 'Toys', sales: 400, revenue: 4000 },
	{ category: 'Furniture', sales: 200, revenue: 5000 },
	];

	const [data, setData] = useState(initialData.length > 0 ? initialData : defaultData);
	const [selectedChart, setSelectedChart] = useState('All Charts');
	const [nameKey, setNameKey] = useState('category');
	const [dataKey, setDataKey] = useState('sales');
	const [columns, setColumns] = useState([]);


	useEffect(() => {
	if (data.length > 0) {
		const keys = Object.keys(data[0]);
		setColumns(keys);
		// Set initial defaults
		const firstNonNumeric = keys.find(key => typeof data[0][key] !== 'number') || keys[0];
		const firstNumeric = keys.find(key => typeof data[0][key] === 'number') || keys[1] || keys[0];
		setNameKey(firstNonNumeric);
		setDataKey(firstNumeric);
	}
	}, [data]);

	const handleExcelUpload = (e) => {
	const file = e.target.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = (event) => {
		const workbook = XLSX.read(event.target.result, { type: 'binary' });
		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];
		const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

		const headers = parsedData[0];
		const newData = parsedData.slice(1).map((row) => {
			const item = {};
			headers.forEach((header, i) => {
			item[header] = row[i];
			});
			return item;
		});
		setData(newData);
		};
		reader.readAsBinaryString(file);
	}
	};

	const chartOptions = [
	'All Charts',
	'Pie Chart',
	'Donut Chart',
	'Bar Chart',
	'Line Chart',
	'Funnel Chart',
	'Area Chart',
	'Scatter Chart',
	'Radar Chart',
	];

	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6347', '#6A5ACD', '#20B2AA', '#DAA520'];

	const renderPieChart = () => (
	<ResponsiveContainer width="100%" height={isDetailPage ? 300 : 200}>
		<PieChart>
		<Pie
			data={data}
			dataKey={dataKey}
			nameKey={nameKey}
			cx="50%"
			cy="50%"
			outerRadius={isDetailPage ? 80 : 50}
			fill="#b6d6eb"
			label
		>
			{data.map((entry, index) => (
			<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
			))}
		</Pie>
		<Tooltip />
		</PieChart>
	</ResponsiveContainer>
	);

	const renderDonutChart = () => (
	<ResponsiveContainer width="100%" height={isDetailPage ? 300 : 200}>
		<PieChart>
		<Pie
			data={data}
			dataKey={dataKey}
			nameKey={nameKey}
			cx="50%"
			cy="50%"
			innerRadius={isDetailPage ? 60 : 40}
			outerRadius={isDetailPage ? 80 : 50}
			fill="#b6d6eb"
			label
		>
			{data.map((entry, index) => (
			<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
			))}
		</Pie>
		<Tooltip />
		</PieChart>
	</ResponsiveContainer>
	);

	const renderBarChart = () => (
	<ResponsiveContainer width="100%" height={isDetailPage ? 300 : 200}>
		<BarChart data={data}>
		<CartesianGrid strokeDasharray="3 3" />
		<XAxis dataKey={nameKey} />
		<YAxis />
		<Tooltip />
		<Legend />
		<Bar dataKey={dataKey} fill="#b6d6eb" />
		</BarChart>
	</ResponsiveContainer>
	);

	const renderLineChart = () => (
	<ResponsiveContainer width="100%" height={isDetailPage ? 300 : 200}>
		<LineChart data={data}>
		<CartesianGrid strokeDasharray="3 3" />
		<XAxis dataKey={nameKey} />
		<YAxis />
		<Tooltip />
		<Legend />
		<Line type="monotone" dataKey={dataKey}  stroke="#b6d6eb" />
		</LineChart>
	</ResponsiveContainer>
	);

	const renderFunnelChart = () => (
	<ResponsiveContainer width="100%" height={isDetailPage ? 300 : 200}>
		<FunnelChart>
		<Funnel
			dataKey={dataKey}
			data={data}
			isAnimationActive
		>
			{data.map((entry, index) => (
			<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
			))}
		</Funnel>
		<Tooltip />
		</FunnelChart>
	</ResponsiveContainer>
	);

	const renderAreaChart = () => (
	<ResponsiveContainer width="100%" height={isDetailPage ? 300 : 200}>
		<AreaChart data={data}>
		<CartesianGrid strokeDasharray="3 3" />
		<XAxis dataKey={nameKey} />
		<YAxis />
		<Tooltip />
		<Legend />
		<Area type="monotone" dataKey={dataKey} stroke="#b6d6eb" fill="#b6d6eb" />
		</AreaChart>
	</ResponsiveContainer>
	);

	const renderScatterChart = () => (
	<ResponsiveContainer width="100%" height={isDetailPage ? 300 : 200}>
		<ScatterChart data={data}>
		<CartesianGrid strokeDasharray="3 3" />
		<XAxis type="category" dataKey={nameKey}  />
		<YAxis type="number" dataKey={dataKey}  />
		<Tooltip />
		<Legend />
		<Scatter name={dataKey} data={data} fill="#b6d6eb" />
		</ScatterChart>
	</ResponsiveContainer>
	);

	const renderRadarChart = () => (
	<ResponsiveContainer width="100%" height={isDetailPage ? 300 : 200}>
		<RadarChart data={data}>
		<PolarGrid />
		<PolarAngleAxis dataKey={nameKey} />
		<PolarRadiusAxis angle={30} domain={[0, Math.max(...data.map(item => item[dataKey] || 0))]} />
		<Tooltip />
		<Legend />
		<Radar name={dataKey} dataKey={dataKey} stroke="#b6d6eb" fill="#b6d6eb" fillOpacity={0.6} />
		</RadarChart>
	</ResponsiveContainer>
	);

	const renderChart = (chartType) => {
	switch (chartType) {
		case 'Pie Chart':
		return renderPieChart();
		case 'Donut Chart':
		return renderDonutChart();
		case 'Bar Chart':
		return renderBarChart();
		case 'Line Chart':
		return renderLineChart();
		case 'Funnel Chart':
		return renderFunnelChart();
		case 'Area Chart':
		return renderAreaChart();
		case 'Scatter Chart':
		return renderScatterChart();
		case 'Radar Chart':
		return renderRadarChart();
		default:
		return null;
	}
	};

	const renderAllCharts = () => (
	<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{chartOptions.slice(1).map((chartType) => (
		<div key={chartType} className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} p-4 rounded-lg shadow-md transition duration-1000 ease-in-out`}>
			<h3 className="text-lg font-semibold mb-2">{chartType}</h3>
			{renderChart(chartType)}
		</div>
		))}
	</div>
	);

	return (
	<div className={`w-full transition duration-1000 ease-in-out ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gray-100 text-gray-800'} ${isDetailPage ? 'p-6 min-h-[600px] rounded-lg' : 'p-2 h-48 overflow-auto rounded scrollbar-hide'}`}>
		{/* <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h2> */}
		{!isDetailPage && renderPieChart()} {/* Show compact Pie Chart in card view */}
		{isDetailPage && (
		<>
		<div className="mb-6 flex items-center gap-4">
			<label className={`font-medium ${theme === 'dark' ? 'text-gray-100':'text-gray-700'}`}>Insert Excel File:</label>
			<input type="file" accept=".xls,.xlsx" onChange={handleExcelUpload} className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
			
		</div>
			<div className="overflow-x-auto mb-6">
			<table className="w-full bg-white rounded-lg shadow-md">
				<thead>
				<tr className={`${theme==='dark'?'bg-gray-700 text-gray-100':'bg-blue-100 text-gray-700'} transition duration-1000 ease-in-out`}>
					{Object.keys(data[0] || {}).map((key) => (
					<th key={key} className="p-3 text-left font-semibold border-b-2 border-blue-200">
						{key}
					</th>
					))}
				</tr>
				</thead>
				<tbody>
				{data.map((row, index) => (
					<tr
					key={index}
					className={` transition duration-1000 ease-in-out ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-900' : 'bg-white hover:bg-gray-50'}`}
					>
					{Object.values(row).map((value, i) => (
						<td key={i} className="p-3 border-b border-gray-200">
						{typeof value === 'number' ? value.toLocaleString() : value}
						</td>
					))}
					</tr>
				))}
				</tbody>
			</table>
			</div>
			<div className="mb-6 flex items-center gap-4">
			<label className={`font-medium ${theme === 'dark' ? 'text-gray-100':'text-gray-700'}`}>Select Chart:</label>
			<select
				value={selectedChart}
				onChange={(e) => setSelectedChart(e.target.value)}
				className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				{chartOptions.map((option) => (
				<option key={option} value={option} className={`${theme === 'dark' ? 'text-gray-800':'text-gray-100'}`}>
					{option}
				</option>
				))}


			</select>
			<label className={`font-medium ${theme === 'dark' ? 'text-gray-100':'text-gray-700'}`}>Category Column:</label>
			<select
				value={nameKey}
				onChange={(e) => setNameKey(e.target.value)}
				className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				{columns.map((col) => typeof data[0][col] !== 'number'? (
				<option key={col} value={col} className={`${theme === 'dark' ? 'text-gray-800':'text-gray-100'}`}>
					{col}
				</option>
				):null)}
			</select>
			<label className="text-gray-700 font-medium">Value Column:</label>
			<select
				value={dataKey}
				onChange={(e) => setDataKey(e.target.value)}
				className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				{columns.map((col) => typeof data[0][col] === 'number'? (
				<option key={col} value={col} className={`${theme === 'dark' ? 'text-gray-800':'text-gray-100'}`}>
					{col}
				</option>
				):null)}
			</select>
			</div>
			{selectedChart === 'All Charts' ? renderAllCharts() : renderChart(selectedChart)}
		</>
		)}
	</div>
	);
};

export default Dashboard;