import React from "react";
import { useSelector } from 'react-redux';

const Footer = () => {
	const theme = useSelector((state) => state.theme.mode);
	return (
	<footer className={`bg-${theme === 'dark' ? 'gray-700' : 'gray-800'} text-white py-4`}>
		<div className="container mx-auto text-center">
		<p>&copy; {new Date().getFullYear()} React App. All rights reserved.</p>
		</div>
	</footer>
	);
};

export default Footer;
