import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import storeCode from '../store/store.js?raw';
import themeCode from '../store/themeSlice.js?raw';
import { FaFolder, FaFileCode, FaChevronDown, FaChevronRight } from 'react-icons/fa';


const ReduxImplementation = ({ theme }) => {
    
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  const copyToClipboard = (code, fileName) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success(`Copied ${fileName} to clipboard!`, {
        position: 'top-right',
        autoClose: 2000,
        theme: theme === 'dark' ? 'dark' : 'light',
      });
    }).catch((err) => {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy code.', {
        position: 'top-right',
        autoClose: 2000,
        theme: theme === 'dark' ? 'dark' : 'light',
      });
    });
  };

   const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  return (
    <div className="mt-12">
      <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
        Redux Implementation
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Description */}
        <div className={`${
          theme === 'dark' ? 'bg-transparent border-gray-600' : 'bg-transparent border-gray-200'
        } p-6`}>
          <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
            Theme Management with Redux
          </h3>
          <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Redux is used in this application to manage the theme state, enabling seamless switching between light and dark modes across all components. The implementation leverages Redux Toolkit, a modern approach to Redux that simplifies store setup and state management.
          </p>
          <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            The <code>store.js</code> file configures the Redux store with a single reducer for the theme state. The <code>theme.js</code> slice defines the theme state (initially set to 'light') and provides actions like <code>toggleTheme</code> and <code>setTheme</code> to update the mode. Components access the theme state using <code>useSelector</code> and dispatch actions with <code>useDispatch</code> to toggle or set the theme.
          </p>
          <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            This centralized state management ensures consistent theme updates across the application, with components like <code>DynamicDatatable</code> and <code>ComponentsPage</code> reacting to the theme state to apply appropriate styling (e.g., Tailwind CSS classes for dark/light modes).
          </p>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            The code on the right shows the Redux setup. Click the copy buttons to copy the code for <code>store.js</code> and <code>theme.js</code>.
          </p>
            <br/>
           {/* Folder Structure Accordion */}
          <div className="mt-auto">
            <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
              Folder Structure
            </h4>
            <div
              className={`${
                theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-200'
              } border rounded-lg`}
              role="region"
              aria-label="Folder structure"
            >
              <button
                onClick={toggleAccordion}
                className={`w-full flex items-center justify-between p-3 text-left ${
                  theme === 'dark' ? 'text-gray-100 hover:bg-gray-900' : 'text-gray-800 hover:bg-gray-50'
                } transition`}
                aria-expanded={isAccordionOpen}
                aria-controls="folder-structure-content"
              >
                <div className="flex items-center gap-2">
                  <FaFolder className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'} />
                  <span>store</span>
                </div>
                {isAccordionOpen ? (
                  <FaChevronDown className={theme === 'dark' ? 'text-gray-100' : 'text-gray-800'} />
                ) : (
                  <FaChevronRight className={theme === 'dark' ? 'text-gray-100' : 'text-gray-800'} />
                )}
              </button>
              {isAccordionOpen && (
                <div id="folder-structure-content" className="pl-6 pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FaFileCode className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>store.js</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaFileCode className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>themeSlice.js</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Code Display */}
        <div className="space-y-6">
          {/* store.js */}
          <div
            className={`${
              theme === 'dark' ? 'bg-transparent border-gray-600' : 'bg-transparent border-gray-200'
            }  p-6 transform hover:scale-105 transition duration-300 ease-in-out`}
            role="region"
            aria-label="store.js code"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                store.js
              </h3>
              <button
                onClick={() => copyToClipboard(storeCode, 'store.js')}
                className={`px-3 py-1 rounded text-sm font-semibold ${
                  theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
                } transition`}
                title="Copy store.js code"
                aria-label="Copy store.js code"
              >
                Copy
              </button>
            </div>
            <SyntaxHighlighter
              language="javascript"
              style={theme === 'dark' ? okaidia : okaidia}
              customStyle={{
                margin: 0,
                padding: '1rem',
                borderRadius: '0.5rem',
                fontSize: '14px',
                backgroundColor:'#364153',
              }}
            >
              {storeCode}
            </SyntaxHighlighter>
          </div>

          {/* theme.js */}
          <div
            className={`${
              theme === 'dark' ? 'bg-transparent border-gray-600' : 'bg-transparent border-gray-200'
            } p-6 transform hover:scale-105 transition duration-300 ease-in-out`}
            role="region"
            aria-label="theme.js code"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                themeSlice.js
              </h3>
              <button
                onClick={() => copyToClipboard(themeCode, 'theme.js')}
                className={`px-3 py-1 rounded text-sm font-semibold ${
                  theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
                } transition`}
                title="Copy theme.js code"
                aria-label="Copy theme.js code"
              >
                Copy
              </button>
            </div>
            <SyntaxHighlighter
              language="javascript"
              style={theme === 'dark' ? okaidia : okaidia}
              customStyle={{
                margin: 0,
                padding: '1rem',
                borderRadius: '0.5rem',
                fontSize: '14px',
                backgroundColor:'#364153',
              }}
            >
              {themeCode}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
};

ReduxImplementation.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
};

export default ReduxImplementation;