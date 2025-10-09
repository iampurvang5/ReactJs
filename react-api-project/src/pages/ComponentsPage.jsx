import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Counter from '../components/Counter'; // Adjust path based on your project structure
import SliderComponent from '../components/SliderComponent';
import DataTable from '../components/DataTable';
import ProgressBar from '../components/ProgressBar';
import SidebarComponent from '../components/SidebarComponent';
import PhotoGallery from '../components/PhotoGallery';
import Dashboard from '../components/Dashboard';
import Chatbot from '../components/Chatbot';
import ClockComponent from '../components/ClockComponent';

const ComponentsPage = () => {
  // Placeholder data for cards; you can add more or modify later
  const cards = [
    {
      id: 1,
      title: "Counter Component",
      description: "A simple counter with increment and decrement buttons",
      component: <Counter isDetailPage={false} />,
    },
    {
      id: 2,
      title: "Slider Component",
      description: "Slider component using slick slider library",
      component: <SliderComponent isDetailPage={false} />,
    },
    {
      id: 3,
      title: "DataTable Component",
      description: "A Table with sorting and pagination and search features",
      component: <DataTable/>,
    },
    {
      id: 4,
      title: "Dynamic Progree Bar",
      description: "Dynamic progress bar with steps",
      component: <ProgressBar />,
    },
    {
      id: 5,
      title: "Photo Gallery",
      description: "Photo gallery with local upload and URL addition features",
      component: <PhotoGallery/>,
    },
    {
      id: 6,
      title: "Dashboard",
      description: "Dashboards components with multiple chart options",
      component: <Dashboard/>,
    },
    {
      id: 7,
      title: "Chatbot",
      description: "chatbot component with basic interaction",
      component: <Chatbot/>,
    },
    {
      id: 8,
      title: "Clock Component",
      description: "A simple digital clock displaying current time",
      component: <ClockComponent/>,
    },
    {
      id: 9,
      title: "Component 9",
      description: "Placeholder for future component",
      component: null,
    },
    {
      id: 10,
      title: "Component 6",
      description: "Placeholder for future component",
      component: null,
    },
    {
      id: 11,
      title: "Component 7",
      description: "Placeholder for future component",
      component: null,
    },
    {
      id: 12,
      title: "Component 8",
      description: "Placeholder for future component",
      component: null,
    },
    {
      id: 13,
      title: "Component 9",
      description: "Placeholder for future component",
      component: null,
    },
  ];

  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(cards.length / itemsPerPage);

  // Calculate the cards to display on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedCards = cards.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Components Showcase</h1>
      <p className="text-lg mb-6">
        Click a card to view the component in detail.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCards.map((card) => (
          <Link to={`/components/${card.id}`} key={card.id} className="bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow hover:bg-gray-50">
            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
            <p className="text-gray-600 mb-4">{card.description}</p>
            {card.component ? (
              <div className="h-48">{card.component}</div>
            ) : (
              <div className="h-48 bg-gray-100 flex items-center justify-center rounded">
                <span className="text-gray-500">Component goes here</span>
              </div>
            )}
          </Link>
        ))}
      </div>
      {/* Pagination controls (only shown if more than 1 page) */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-500 disabled:bg-gray-300 transition"
          >
            Previous
          </button>
          <span className="text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-500 disabled:bg-gray-300 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ComponentsPage;