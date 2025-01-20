import React, { useState } from 'react'
import BasicNavbar from '../../components/layout/BasicNavbar'

const HomePage:React.FC = () => {
  const [showVideo, setShowVideo] = useState(false);

  const handleVideoModal = () => {
    setShowVideo(!showVideo);
  };
  return (
    
    <div>
      <BasicNavbar />
      <div>
      <div className="relative w-full h-screen">
  <img
    src="\src\assets\images\shutterstock_1029674362-860x574.png" 
    alt="Hero"
    className="w-full h-full object-cover"
  />

  <div className="absolute inset-0 flex items-center justify-center lg:justify-start px-4 lg:px-12 bg-black bg-opacity-30">
    <div className="text-center lg:text-left max-w-lg space-y-6 text-white">
      <h1 className="text-4xl font-bold leading-tight">
        <span className="text-green-500">Knowledge</span> at your fingertips
      </h1>
      <p className="text-gray-200">
        Unlock your potential with top-notch resources and expert guidance to
        elevate your learning experience.
      </p>
      <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
        <button className="px-6 py-3 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700">
          Join for free
        </button>
          
        </div>
        <div>
        <button
          className="flex items-center text-blue-400 font-medium space-x-2 hover:underline"
        >
          <span className="w-10 h-10 flex items-center justify-center rounded-full border border-blue-400">
            ▶
          </span>
          <span>Watch how it works</span>
        </button>
      </div>
    </div>
  </div>
</div>

        {/* Success Section */}
        <div className="bg-white py-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Our Success</h2>
            <p className="text-gray-600">
              Ornare id fames interdum porttitor nulla turpis etiam. Diam vitae
              sollicitudin at nec nam et pharetra gravida.
            </p>
          </div>
          <div className="container mx-auto grid grid-cols-2 lg:grid-cols-5 gap-6 text-center mt-8">
            {/* Stats */}
            <div>
              <h3 className="text-2xl font-bold text-blue-600">15K+</h3>
              <p className="text-gray-600">Students</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-blue-600">75%</h3>
              <p className="text-gray-600">Total success</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-blue-600">35</h3>
              <p className="text-gray-600">Main questions</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-blue-600">26</h3>
              <p className="text-gray-600">Chief experts</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-blue-600">16</h3>
              <p className="text-gray-600">Years of experience</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>  
    
  )
}

export default HomePage
