import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import AddProduct from "./AddProduct"; // Import the AddProduct component

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false); // State to toggle modal

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <>
      <header className="bg-blue-500 text-white shadow-md">
        {/* Top Header */}
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-xl font-semibold">Welcome!</h1>
        </div>

        

        {/* Bottom Header */}
        <div className="flex items-center justify-between px-6 py-2 bg-blue-400">
          <button
            className="flex items-center text-white font-medium hover:text-gray-200 focus:outline-none"
            onClick={toggleMenu}
          >

            {isOpen ? <FaTimes className="mr-2" /> : <FaBars className="mr-2" />}
            <span>{isOpen ? "Close Menu" : "Open Menu"}</span>
          </button>
          
             <div className="flex justify-between items-center px-6 py-4">
      <input
        type="text"
        className="w-full text-black px-4 py-2 rounded-lg bg-gray-100 border-gray-300 focus:outline-none focus:border-blue-300"
        placeholder="Search products..."
                
      />
    </div>
          <button
            className="px-4 py-2 bg-white text-blue-500 font-medium rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            onClick={toggleForm}
          >
            Add Product
          </button>
       
        </div>
        
      </header>

      {/* Add Product Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-2xl p-8 rounded-lg shadow-lg relative">
            <button
              onClick={toggleForm}
              className="absolute top-8 right-1 text-red-500 hover:text-red-800 focus:outline-none"
            >
              ✕
            </button>
            <AddProduct />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

