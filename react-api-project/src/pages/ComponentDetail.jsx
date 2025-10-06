import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Counter from '../components/Counter'; // Adjust path based on your project structure
import CounterCode from '../components/Counter.jsx?raw';
import SliderComponent from '../components/SliderComponent';
import SliderComponentCode from '../components/SliderComponent.jsx?raw ';
import DataTable from '../components/DataTable';
import DataTableCode from '../components/DataTable.jsx?raw';
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import ProgressBar from '../components/ProgressBar';
import ProgressBarCode from '../components/ProgressBar.jsx?raw';
import SidebarComponent from '../components/SidebarComponent';
import PhotoGallery from '../components/PhotoGallery';
import PhotoGalleryCode from '../components/PhotoGallery.jsx?raw';
import Dashboard from '../components/Dashboard';
import DashboardCode from '../components/Dashboard.jsx?raw';
import { HiArrowCircleLeft } from "react-icons/hi";

const ComponentDetail = () => {
  const { id } = useParams();

  // Define components data (same as in ComponentsPage for consistency)
  const components = [
    { 
      id: 1, 
      title: 'Counter Component', 
      description: 'A simple counter with increment and decrement buttons', 
      component: <Counter isDetailPage={true} />,
      code: CounterCode
    },
    { id: 2, title: 'Slider Component', description: 'Slider Component Using Slick slider library', component: <SliderComponent isDetailPage={true}/>, code: SliderComponentCode },
    { id: 3, title: 'DataTable Component', description: 'Data table with sorting and pagination and search functionality', component: <DataTable isDetailPage={true}/>, code: DataTableCode },
    { id: 4, title: 'Dynamic Progree Bar', description: 'Dynamic progress bar with steps', component: <ProgressBar isDetailPage={true}/>, code: ProgressBarCode },
    {
      id: 5,
      title: "Photo Gallery",
      description: "Photo gallery with local upload and URL addition features",
      component: <PhotoGallery isDetailPage={true}/>,
      code: PhotoGalleryCode
    },
    {
      id: 6,
      title: "Dashboard",
      description: "Dashboards components with multiple chart options",
      component: <Dashboard isDetailPage={true}/>,
      code: DashboardCode
    },
    { id: 7, title: 'Component 7', description: 'Placeholder for future component', component: null, code: null },
    { id: 8, title: 'Component 8', description: 'Placeholder for future component', component: null, code: null },
    { id: 9, title: 'Component 9', description: 'Placeholder for future component', component: null, code: null },
  ];

  // Find the selected component
  const selectedComponent = components.find((comp) => comp.id === parseInt(id));

  if (!selectedComponent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Component Not Found</h1>
        <p className="text-lg mb-6">The component you are looking for does not exist.</p>
        <Link to="/components" className="text-blue-500 hover:underline">
          Back to Components
        </Link>
      </div>
    );
  }

  const handleCopy = () => {
    if (selectedComponent.code) {
      navigator.clipboard.writeText(selectedComponent.code);
      Swal.fire({
      icon: "success",
      title: "Copied!",
      text: "Code copied to clipboard!",
      timer: 1000,
      showConfirmButton: false
    });
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/components" className="mt-6 inline-block text-blue-500 hover:underline text-2xl">
            <HiArrowCircleLeft />
      </Link>
      <h1 className="text-3xl font-bold mb-4">{selectedComponent.title}</h1>
      <p className="text-lg mb-6">{selectedComponent.description}</p>
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
        {selectedComponent.component ? (
          <div className="min-h-[400px]">{selectedComponent.component}</div>
        ) : (
          <div className="min-h-[400px] bg-gray-100 flex items-center justify-center rounded">
            <span className="text-gray-500">Component goes here</span>
          </div>
        )}
      </div>
      {selectedComponent.code ? (
        <>
          <h2 className="text-2xl font-bold mt-8 mb-4">Source Code</h2>
          <div className="relative bg-gray-800 text-white p-4 rounded-lg overflow-auto max-h-[600px] scrollbar-hide">
            <pre><code>{selectedComponent.code}</code></pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Copy
            </button>
          </div>
        </>
      ) : (
        <p className="mt-8 text-lg text-gray-600">No source code available for this component yet.</p>
      )}
      
    </div>
  );
};

export default ComponentDetail;