import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GrFavorite } from "react-icons/gr";
import {
  FaSearch,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaUserCircle,
} from "react-icons/fa";

const Header = ({ favorites = [] }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const userName = localStorage.getItem("Name") || "Profile";

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleCategories = () => setCategoriesOpen(!categoriesOpen);
  const toggleProfileDropdown = () =>
    setProfileDropdownOpen(!profileDropdownOpen);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-primary font-semibold"
      : "text-gray-700 hover:text-primary transition";

  return (
    <header className="p-4 flex justify-between items-center bg-white shadow-md sticky top-0 z-50">
      {/* Logo */}
      <Link to="/">
        <img src="/llogo.png" className="w-32" alt="Logo" />
      </Link>

      {/* Search Bar */}
      <div className="hidden md:flex relative items-center flex-grow max-w-lg mx-6">
        <FaSearch className="absolute left-4 text-gray-400" />
        <input
          type="text"
          placeholder="Find the product you want"
          className="border border-gray-300 rounded-full text-sm pl-10 pr-4 py-2 w-full focus:outline-none focus:ring focus:ring-primary"
        />
      </div>
      <div className="" id="google_translate_element"></div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6 text-sm">
        <Link to="/categories" className={isActive("/categories")}>
          Categories
        </Link>
        <Link to="/about" className={isActive("/about")}>
          About
        </Link>
        <Link
          to="/favorites"
          state={{ favorites }}
          className="text-gray-600 flex hover:text-primary"
        >
          <GrFavorite size={20} />({favorites.length})
        </Link>

        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <FaUserCircle size={24} className="text-gray-600" />
              <span className="text-gray-700">{userName}</span>
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/start"
              className="border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition"
            >
              Sell your item
            </Link>
            <Link to="/login">
              <button className="px-4 py-2 bg-primary text-white rounded-full hover:bg-purple-600 transition">
                Login
              </button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-2xl" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Full-Screen Menu */}
      <div
        className={`fixed inset-0 bg-white z-50 flex flex-col items-center p-6 space-y-6 transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 md:hidden`}
      >
        {/* Logo and Close Button */}
        <div className="w-full flex justify-between items-center">
          <Link to="/">
            <img src="/llogo.png" className="w-24" alt="Logo" />
          </Link>
          <button className="text-2xl" onClick={toggleMenu}>
            <FaTimes />
          </button>
        </div>

        {/* Links */}
        <nav className="w-full flex flex-col space-y-8 text-xl">
          {isAuthenticated && (
            <Link
              to="/profile"
              className="flex items-center space-x-2"
              onClick={toggleMenu}
            >
              <FaUserCircle size={24} />
              <span>My Profile</span>
            </Link>
          )}

          <Link
            to="/"
            className={`block ${isActive("/")}`}
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`block ${isActive("/about")}`}
            onClick={toggleMenu}
          >
            About
          </Link>
          <button
            onClick={toggleCategories}
            className="flex  text-lg w-full focus:outline-none hover:text-primary transition"
          >
            Categories
            <FaChevronDown
              className={`ml-2 transition-transform ${
                categoriesOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {categoriesOpen && (
            <ul className="w-full text-gray-600 space-y-2">
              {[
                "House",
                "Vehicles",
                "Real Estate",
                "Fashion & Beauty",
                "Multimedia",
                "Equipment & Appliances",
              ].map((category, index) => (
                <li key={index} className="hover:text-primary transition">
                  {category}
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/favourite"
            className="hover:text-primary transition"
            onClick={toggleMenu}
          >
            Favourites
          </Link>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="block w-full border border-gray-300 bg-primary text-white rounded-md py-2 text-center hover:bg-purple-600 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="block w-full border border-gray-300 bg-primary text-white rounded-md py-2 text-center hover:bg-purple-600 transition"
                onClick={toggleMenu}
              >
                Login
              </Link>
              <Link
                to="/start"
                className="block w-full border border-gray-300 rounded-md py-2 text-center hover:bg-gray-100 transition"
                onClick={toggleMenu}
              >
                Sell your item
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
