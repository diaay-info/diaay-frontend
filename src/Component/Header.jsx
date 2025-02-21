import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GrFavorite } from "react-icons/gr";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-white font-medium text-text shadow-md">
        {/* Logo */}
        <Link to="/">
        <img src="/llogo.png" className="w-[8rem]"/>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex relative items-center space-x-4 flex-grow ml-40">
          <FaSearch className="absolute left-7 text-gray-300" />
          <input
            type="text"
            placeholder="Find the product you want"
            className="border border-gray-300 rounded-md text-sm pl-10 pr-3 py-2 w-full max-w-md focus:outline-none focus:ring focus:ring-primary"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 text-sm">
          <Link to="/categories" className="hover:underline">
            Categories
          </Link>
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/favourite" className="hover:underline">
            <GrFavorite />
          </Link>
          <Link
            to="/start"
            className="hover:underline border border-gray-300 rounded-3xl px-4 py-2"
          >
            Sell your item
          </Link>
          <Link to="/start">
            <button className="text-sm px-4 py-2 bg-primary text-white rounded-3xl hover:bg-purple-600">
              Get Started
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      {/* Mobile Full-Screen Overlay Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col p-8">
          {/* Close Icon */}
          <button
            className="self-end text-2xl mb-4 focus:outline-none"
            onClick={toggleMenu}
          >
            <FaTimes />
          </button>

          {/* Mobile Search Bar */}
          <div className="relative mb-6">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              placeholder="Find the product you want"
              className="border border-gray-300 rounded-md text-sm pl-10 pr-3 py-2 w-full focus:outline-none focus:ring focus:ring-primary"
            />
          </div>

          {/* Links */}
          <nav className="space-y-6 text-sm">
            <Link to="/categories" className="block hover:underline">
              Categories
            </Link>
            <Link to="/about" className="block hover:underline">
              About
            </Link>
            <Link to="/favourite" className="block hover:underline">
              Favourites
            </Link>
            <Link
              to="/start"
              className="block hover:underline border border-gray-300 rounded-md py-2 text-center"
            >
              Sell your item
            </Link>
            <Link to="/start">
              <button className="block w-full px-6 py-2 bg-primary text-white rounded-3xl hover:bg-purple-600">
                Get Started
              </button>
            </Link>
          </nav>

          {/* Categories Section */}
          <div className="mt-8">
            <h2 className="font-bold mb-4">Categories</h2>
            <ul className="space-y-6 text-sm">
              {[
                "House",
                "Vehicles",
                "Real Estate",
                "Fashion & Beauty",
                "Multimedia",
                "Equipment & Appliances",
              ].map((category, index) => (
                <li key={index} className="hover:underline text-gray-600">
                  {category}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div>
        <hr />
      </div>
    </div>
  );
};

export default Header;
