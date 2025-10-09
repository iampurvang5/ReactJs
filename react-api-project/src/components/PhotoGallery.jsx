import React, { useState } from 'react';
import { HiArrowCircleLeft } from "react-icons/hi"; //npm install react-icons
import { HiArrowCircleRight } from "react-icons/hi";

const PhotoGallery = ({ isDetailPage = false }) => {
  const [images, setImages] = useState([
    'https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8=', 
    'https://images.unsplash.com/photo-1526779259212-939e64788e3c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D', 
    'https://images.ctfassets.net/hrltx12pl8hq/7JnR6tVVwDyUM8Cbci3GtJ/bf74366cff2ba271471725d0b0ef418c/shutterstock_376532611-og.jpg?fit=fill&w=1200&h=630',
    'https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg?cs=srgb&dl=pexels-hsapir-1054655.jpg&fm=jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9YYh5Fk1u9VsWWr1MhkyQeOzeNbtnnMO96g&s',
    'https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-118143566.jpg',
    'https://png.pngtree.com/thumb_back/fh260/background/20240522/pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',
    'https://t4.ftcdn.net/jpg/02/56/10/07/360_F_256100731_qNLp6MQ3FjYtA3Freu9epjhsAj2cwU9c.jpg',
    'https://img.freepik.com/free-photo/beautiful-lake-mountains_395237-44.jpg?semt=ais_hybrid&w=740&q=80',
    'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630'
]);
  const [url, setUrl] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleLocalUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUrlAdd = () => {
    if (url) {
      setImages((prev) => [...prev, url]);
      setUrl('');
    }
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleNext = () => {
    if (!isTransitioning && images.length > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setSelectedImageIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 500);
    }
  };

  const handlePrev = () => {
    if (!isTransitioning && images.length > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
        setIsTransitioning(false);
      }, 500);
    }
  };

  const closeSlider = () => {
    setSelectedImageIndex(null);
  };

  const handleClear = () => {
    setImages([]);
    setSelectedImageIndex(null);
  };

  return (
    <div className={`w-full ${isDetailPage ? 'p-6 min-h-[500px] rounded-lg bg-gray-100' : 'p-2 h-48 overflow-auto bg-gray-100 rounded scrollbar-hide'}`}>
      {/* <h2 className="text-2xl font-bold mb-6 text-gray-800">Photo Gallery</h2> */}
      {isDetailPage && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleLocalUpload}
            className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter image URL"
              className="border-2 border-gray-300 p-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleUrlAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Add
            </button>
          </div>
          {images.length > 0 && (
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
            >
              Clear
            </button>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.length>0 ?images.map((src, index) => (
          <div
            key={index}
            className="cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-shadow"
            onClick={() => handleImageClick(index)}
          >
            <img src={src} alt="Gallery" className={`w-full object-cover ${isDetailPage ? 'h-40 ':'h-18'} `} />
          </div>
        )) : <p className="text-gray-500 col-span-full text-center">No images to display. Please upload or add image URLs.</p>}
      </div>
      {selectedImageIndex !== null && isDetailPage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={closeSlider}>
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-4 text-white text-4xl hover:text-gray-300 transition duration-300"
          >
            <HiArrowCircleLeft />
          </button>
          <img
            src={images[selectedImageIndex]}
            alt="Slider"
            className="max-w-[90vw] max-h-[90vh] object-contain transition-opacity duration-500 ease-in-out"
            style={{ opacity: isTransitioning ? 0 : 1 }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-4 text-white text-4xl hover:text-gray-300 transition duration-300"
          >
            <HiArrowCircleRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;