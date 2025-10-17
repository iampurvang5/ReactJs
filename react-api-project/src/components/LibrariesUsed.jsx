import React from 'react';
import PropTypes from 'prop-types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LibrariesUsed = ({ theme }) => {
  const libraries = [
    {
      name: 'primereact',
      command: 'npm install primereact',
      description: 'UI components for DynamicDatatable',
    },
    {
      name: 'primeicons',
      command: 'npm install primeicons',
      description: 'Icon library for PrimeReact components',
    },
    {
      name: 'styled-components',
      command: 'npm install styled-components',
      description: 'CSS-in-JS for styled components',
    },
    {
      name: 'sweetalert2',
      command: 'npm install sweetalert2',
      description: 'Modals for DynamicDatatable actions',
    },
    {
      name: 'xlsx',
      command: 'npm install xlsx',
      description: 'Excel file parsing for DynamicDatatable',
    },
    {
      name: 'react-icons',
      command: 'npm install react-icons',
      description: 'Icons for pagination and UI elements',
    },
    {
      name: 'react-slick',
      command: 'npm install react-slick',
      description: 'Carousel for SliderComponent',
    },
    {
      name: 'recharts',
      command: 'npm install recharts',
      description: 'Charting library for Dashboard',
    },
    {
      name: 'react-toastify',
      command: 'npm install react-toastify',
      description: 'Toast notifications for copy feedback',
    },
  ];

  const copyToClipboard = (command) => {
    navigator.clipboard.writeText(command).then(() => {
      toast.success('Command copied to clipboard!', {
        position: 'top-right',
        autoClose: 2000,
        theme: theme === 'dark' ? 'dark' : 'light',
      });
    }).catch((err) => {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy command.', {
        position: 'top-right',
        autoClose: 2000,
        theme: theme === 'dark' ? 'dark' : 'light',
      });
    });
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
          Libraries Used
        </h2>
      </div>
      <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
        Below are the libraries used by the components in this showcase. Click the copy button to copy the installation command.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {libraries.map((lib) => (
          <div
            key={lib.name}
            className={`${
              theme === 'dark' ? 'bg-gray-700 border border-gray-600 hover:bg-gray-900' : 'bg-white border border-gray-200 hover:bg-gray-50'
            } rounded-lg shadow-md p-6 transform hover:scale-105 transition duration-300 ease-in-out`}
            role="region"
            aria-label={`Library: ${lib.name}`}
          >
            <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
              {lib.name}
            </h3>
            <p className={`mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {lib.description}
            </p>
            <div className="flex items-center gap-2">
              <code
                className={`flex-1 p-2 rounded bg-gray-100 dark:bg-gray-800 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-200'
                }`}
              >
                {lib.command}
              </code>
              <button
                onClick={() => copyToClipboard(lib.command)}
                className={`px-3 py-1 rounded text-sm font-semibold ${
                  theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-700 text-white hover:bg-gray-600'
                } transition`}
                title="Copy command"
                aria-label={`Copy ${lib.name} installation command`}
              >
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

LibrariesUsed.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
};

export default LibrariesUsed;