import React from "react";



const LoadingOverlay: React.FC = () => {

    return <div 
          className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
        >
          {/* Modal Container */}
          <div 
            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <p className="text-gray-600 mb-6">Loading...</p>
          </div>
        </div>
}

export default LoadingOverlay