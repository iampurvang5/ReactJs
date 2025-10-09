import React, { useState, useEffect,useRef } from 'react';
import { useSelector } from 'react-redux';

const ClockComponent = ({ isDetailPage = false }) => {
	const [mode, setMode] = useState('clock'); // 'clock', 'stopwatch', 'timer'
	const [currentTime, setCurrentTime] = useState(new Date());
	const [stopwatchTime, setStopwatchTime] = useState(0); // In seconds
	const [timerTime, setTimerTime] = useState(0); // In seconds
	const [timerInput, setTimerInput] = useState({ minutes: '', seconds: '' }); // For timer setup
	const [isRunning, setIsRunning] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const theme = useSelector((state) => state.theme.mode);
	useEffect(() => {
	let interval;
	if (mode === 'clock') {
		interval = setInterval(() => {
		setCurrentTime(new Date());
		}, 1000);
	} else if (mode === 'stopwatch' && isRunning) {
		interval = setInterval(() => {
		setStopwatchTime((prev) => prev + 0.1); // Increment by 100ms
		}, 100); // Update every 100ms for milliseconds
	} else if (mode === 'timer' && isRunning && timerTime > 0) {
		interval = setInterval(() => {
		setTimerTime((prev) => (prev > 1 ? prev - 0.1 : 0)); // Decrement by 100ms
		}, 100);
	}
	return () => clearInterval(interval);
	}, [mode, isRunning, timerTime]);

	const handleStartStop = () => {
	setIsRunning(!isRunning);
	};

	const handleReset = () => {
	if (mode === 'stopwatch') {
		setStopwatchTime(0);
	} else if (mode === 'timer') {
		setTimerTime(0);
	}
	setIsRunning(false);
	};

	const handleTimerSet = () => {
	const minutesInSeconds = parseInt(timerInput.minutes, 10) * 60 || 0;
	const seconds = parseInt(timerInput.seconds, 10) || 0;
	setTimerTime(minutesInSeconds + seconds);
	setTimerInput({ minutes: '', seconds: '' });
	setIsRunning(false);
	};

	const formatTime = (seconds) => {
	const totalSeconds = Math.floor(seconds);
	const ms = Math.floor((seconds % 1) * 10); // Normalize to 1-9 (for 100ms increments)
	const hrs = Math.floor(totalSeconds / 3600);
	const mins = Math.floor((totalSeconds % 3600) / 60);
	const secs = totalSeconds % 60;
	return { hrs: hrs % 24, mins, secs, ms };
	};

	const getTimeValues = () => {
	if (mode === 'clock') {
		return {
		hrs: currentTime.getHours() % 12 || 12, // 12-hour format
		mins: currentTime.getMinutes(),
		secs: currentTime.getSeconds(),
		ms: 0, // Not applicable for clock
		};
	} else if (mode === 'stopwatch') {
		return formatTime(stopwatchTime);
	} else if (mode === 'timer') {
		return formatTime(timerTime);
	}
	};

	const { hrs, mins, secs, ms } = getTimeValues();

	const Circle = ({ value, max, color, label }) => {
	const radius = isDetailPage?50:30;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - (value / (max || 60)) * circumference; // Adjust max for ms

	return (
		<div className="flex flex-col items-center">
		<svg className="w-32 h-32" viewBox="0 0 120 120" >
			<circle
			cx="60"
			cy="60"
			r={radius}
			fill="none"
			stroke={theme === 'dark' ? '#444' : '#e5e5e5'}
			strokeWidth="10"
			
			/>
			<circle
			cx="60"
			cy="60"
			r={radius}
			fill="none"
			stroke={color}
			strokeWidth="10"
			strokeDasharray={circumference}
			strokeDashoffset={strokeDashoffset}
			transform="rotate(-90 60 60)"
			// className="circle-fill"
			style={{
			transition: 'stroke-dashoffset 0.8s ease-in-out', // Smooth fill animation
			}}
			/>
			<text x="60" y="60" textAnchor="middle" dy="0.3em" fontSize="20" fill={theme === 'dark' ? '#fff' : '#000'}>
			{label === 'Milliseconds' ? ms.toString() : value.toString().padStart(2, '0')}
			</text>
		</svg>
		<span className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
		</div>
	);
	};

	return (
	<div className={`w-full bg-gray-100 ${isDetailPage ? 'p-6 min-h-[500px] rounded-lg shadow-lg' : 'p-2 h-48 bg-gray-100 rounded flex flex-col justify-center items-center'} ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
		<div className="flex justify-between items-center mb-4">
		{isDetailPage && (
		<>
			<h2 className="text-2xl font-bold">Clock Component</h2>
			{/* <button
			onClick={() => setIsDarkMode(!isDarkMode)}
			className={`px-4 py-2 rounded-full ${isDarkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-700 text-white'} hover:opacity-90 transition duration-300`}
			>
			{isDarkMode ? 'Light Mode' : 'Dark Mode'}
			</button> */}
		</>)}
		</div>
		<div className="flex justify-around mb-4">
		{mode !== 'clock' && hrs > 0 ?( <Circle value={hrs} max={12} color="#FF0000" label="Hours" />):mode==='clock'?( <Circle value={hrs} max={12} color="#FF0000" label="Hours" />):null}
		<Circle value={mins} max={60} color="#ffbb28" label="Minutes" />
		<Circle value={secs} max={60} color="#00c49f" label="Seconds" />
		{(mode === 'stopwatch' || mode === 'timer') && <Circle value={ms} max={10} color="#ff8042" label="Milliseconds" />}
		</div>
		{isDetailPage && (
		<div className="flex flex-col items-center gap-2">
			<select
			value={mode}
			onChange={(e) => {
				setMode(e.target.value);
				setIsRunning(false);
				setStopwatchTime(0);
				setTimerTime(0);
			}}
			className={`border-2 p-2 rounded-lg focus:outline-none focus:ring-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white focus:ring-purple-500' : 'border-gray-300 bg-white text-gray-800 focus:ring-blue-500'}`}
			>
			<option value="clock">Clock</option>
			<option value="stopwatch">Stopwatch</option>
			<option value="timer">Timer</option>
			</select>
			{mode === 'timer' && (
			<div className="flex gap-2">
				<input
				type="number"
				value={timerInput.minutes}
				onChange={(e) => setTimerInput({ ...timerInput, minutes: e.target.value })}
				placeholder="Minutes"
				className={`border-2 p-2 rounded-lg w-32 focus:outline-none focus:ring-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white focus:ring-purple-500' : 'border-gray-300 bg-white text-gray-800 focus:ring-blue-500'}`}
				/>
				<input
				type="number"
				value={timerInput.seconds}
				onChange={(e) => setTimerInput({ ...timerInput, seconds: e.target.value })}
				placeholder="Seconds"
				className={`border-2 p-2 rounded-lg w-32 focus:outline-none focus:ring-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white focus:ring-purple-500' : 'border-gray-300 bg-white text-gray-800 focus:ring-blue-500'}`}
				/>
				<button
				onClick={handleTimerSet}
				className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
				>
				Set Timer
				</button>
			</div>
			)}
			{(mode === 'stopwatch' || mode === 'timer') && (
			<div className="flex gap-2">
				<button
				onClick={handleStartStop}
				className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
				>
				{isRunning ? 'Pause' : 'Start'}
				</button>
				<button
				onClick={handleReset}
				className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
				>
				Reset
				</button>
			</div>
			)}
			{mode === 'timer' && timerTime === 0 && isRunning && (
			<p className="text-red-500 font-bold">Time's up!</p>
			)}
		</div>
		)}
	</div>
	);
};

export default ClockComponent;