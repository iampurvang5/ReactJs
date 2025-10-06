import React, { useState } from 'react';
import Slider from "react-slick";


const SliderComponent = ({isDetailPage}) => {
   const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    speed: 10000,
    autoplaySpeed: 500,
    cssEase: "linear",
  };
  return (
    <div className={`slider-container p-4 bg-gray-100 rounded ${isDetailPage ? 'min-h-[400px]' : 'h-48'}`}>
      <Slider {...settings}>
        <div className='mr-2 p-2'>
          <img src="https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8=" alt="Slide 1" className={`w-full object-cover rounded-lg shadow-md ${isDetailPage ? 'h-64' : 'h-26'}`} />
        </div>
        <div className='mr-2 p-2'>
          <img src="https://images.unsplash.com/photo-1526779259212-939e64788e3c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D" alt="Slide 1" className={`w-full object-cover rounded-lg shadow-md ${isDetailPage ? 'h-64' : 'h-26'}`} />
        </div>
        <div className='mr-2 p-2'>
          <img src="https://images.ctfassets.net/hrltx12pl8hq/7JnR6tVVwDyUM8Cbci3GtJ/bf74366cff2ba271471725d0b0ef418c/shutterstock_376532611-og.jpg?fit=fill&w=1200&h=630" alt="Slide 1" className={`w-full object-cover rounded-lg shadow-md ${isDetailPage ? 'h-64' : 'h-26'}`} />
        </div>
        <div className='mr-2 p-2'>
          <img src="https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg?cs=srgb&dl=pexels-hsapir-1054655.jpg&fm=jpg" alt="Slide 1" className={`w-full object-cover rounded-lg shadow-md ${isDetailPage ? 'h-64' : 'h-26'}`} />
        </div>
        <div className='mr-2 p-2'>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9YYh5Fk1u9VsWWr1MhkyQeOzeNbtnnMO96g&s" alt="Slide 1" className={`w-full object-cover rounded-lg shadow-md ${isDetailPage ? 'h-64' : 'h-26'}`} />
        </div>
        <div className='mr-2 p-2'>
          <img src="https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-118143566.jpg" alt="Slide 1" className={`w-full object-cover rounded-lg shadow-md ${isDetailPage ? 'h-64' : 'h-26'}`} />
        </div>
        <div className='mr-2 p-2'>
          <img src="https://png.pngtree.com/thumb_back/fh260/background/20240522/pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg" alt="Slide 1" className={`w-full object-cover rounded-lg shadow-md ${isDetailPage ? 'h-64' : 'h-26'}`} />
        </div>
        <div className='mr-2 p-2'>
          <img src="https://t4.ftcdn.net/jpg/02/56/10/07/360_F_256100731_qNLp6MQ3FjYtA3Freu9epjhsAj2cwU9c.jpg" alt="Slide 1" className={`w-full object-cover rounded-lg shadow-md ${isDetailPage ? 'h-64' : 'h-26'}`} />
        </div>
        <div className='mr-2 p-2'>
          <img src="https://img.freepik.com/free-photo/beautiful-lake-mountains_395237-44.jpg?semt=ais_hybrid&w=740&q=80" alt="Slide 1" className={`w-full object-cover rounded-lg shadow-md ${isDetailPage ? 'h-64' : 'h-26'}`} />
        </div>
      </Slider>
    </div>
  );
};

export default SliderComponent;