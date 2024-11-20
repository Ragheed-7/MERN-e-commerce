import React, { useState } from "react";
import iconCart from '../assets/images/iconCart.png';
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
      {/* Header Top */}
      <header className="flex justify-between items-center p-5 px-10 bg-gray-300">
        <h1 className="text-xl font-semibold">Logo</h1>
        <div
          className="w-10 h-10 bg-gray-100 rounded-full flex justify-center items-center relative"
        >
          <img src={iconCart} alt="Cart Icon" className="w-6" />
          <span
            className="absolute top-2/3 right-1/2 bg-red-500 text-white text-sm w-5 h-5 rounded-full flex justify-center items-center"
          >
            0
          </span>
        </div>
      </header>

      {/* Header Bottom */}
      <header className="flex gap-4 items-center h-10 px-10 bg-gray-400">
        <button
          className="flex justify-center items-center hover:border hover:bg-gray-200 hover:border-solid rounded-sm hover:border-white"
          onClick={toggleMenu}
        >
          <h1 className="p-2" aria-label="Toggle Menu">
            {isOpen ? <FaTimes /> : <FaBars />}
          </h1>
          <h2>All</h2>
        </button>
        <button
          className="hover:border hover:bg-gray-200 hover:border-solid rounded-sm p-1 hover:border-white"
          onClick={toggleForm}
        >
          Sell
        </button>
      </header>

      {/* Modal for Add Product Form */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
        >
          <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={toggleForm}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
            {/* AddProduct Form */}
            <AddProduct />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
