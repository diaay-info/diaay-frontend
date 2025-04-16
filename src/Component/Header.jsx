import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GrFavorite } from "react-icons/gr";
import {
  FaBars,
  FaTimes,
  FaChevronDown,
  FaUserCircle,
  FaLanguage,
} from "react-icons/fa";

const Header = ({ favorites = [] }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is authenticated AND is a customer
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("userRole");
  const isCustomer = userRole === "customer";
  const showProfileIcon = isAuthenticated && isCustomer;
  const userName = localStorage.getItem("Name") || "Profile";

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleCategories = () => setCategoriesOpen(!categoriesOpen);
  const toggleProfileDropdown = () =>
    setProfileDropdownOpen(!profileDropdownOpen);

  // Add this to your component - a minimal translate script loader
  useEffect(() => {
    // Check if the script is already loaded
    if (!window.googleTranslateElementInit) {
      // Define the initialization function globally
      window.googleTranslateElementInit = function() {
        new window.google.translate.TranslateElement(
          { 
            pageLanguage: 'en',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          }, 
          'google_translate_element'
        );
      };
      
      // Helper function to load Google Translate script
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
    
    // No cleanup needed - we'll keep the function around since it doesn't hurt
    // and prevents the error when unmounting
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownOpen &&
        !event.target.closest(".profile-dropdown-container")
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownOpen]);

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

      {/* Mobile area with menu + translate */}
      <div className="md:hidden flex items-center space-x-3">
        {/* SIMPLIFIED: Single translate element for all devices */}
        <div id="google_translate_element" className="mobile-translator"></div>
        
        <button
          className="text-2xl"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6 text-sm">
        {/* Desktop translate is the same element now */}
        <div className="flex items-center mr-4">
          <FaLanguage className="text-gray-600 mr-2" />
          <div id="google_translate_element" className="desktop-translator"></div>
        </div>
        
        <Link to="/" className={isActive("/")}>
          Home
        </Link>
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
          <GrFavorite size={20} />
          <span className="ml-1">({favorites.length})</span>
        </Link>

        {showProfileIcon ? (
          <div className="relative profile-dropdown-container">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <FaUserCircle size={24} className="text-gray-600" />
              <span className="hidden lg:inline">{userName}</span>
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

      {/* Mobile Full-Screen Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center p-6 space-y-6 md:hidden">
          {/* Logo and Close Button */}
          <div className="w-full flex justify-between items-center">
            <Link to="/">
              <img src="/llogo.png" className="w-24" alt="Logo" />
            </Link>
            <button
              className="text-2xl"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
          </div>

          {/* Links */}
          <nav className="w-full flex flex-col space-y-8 text-xl">
            {showProfileIcon && (
              <Link
                to="/profile"
                className="flex items-center space-x-2"
                onClick={toggleMenu}
              >
                <FaUserCircle size={24} />
                <span>{userName}</span>
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
            <div>
              <button
                onClick={toggleCategories}
                className="flex items-center text-lg w-full focus:outline-none hover:text-primary transition"
              >
                Categories
                <FaChevronDown
                  className={`ml-2 transition-transform ${
                    categoriesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {categoriesOpen && (
                <ul className="mt-2 pl-4 w-full text-gray-600 space-y-2">
                  {[
                    "House",
                    "Vehicles",
                    "Real Estate",
                    "Fashion ",
                    "Health & Beauty",
                    "Other",
                    "Multimedia",
                    "Equipment & Appliances",
                  ].map((category, index) => (
                    <li key={index} className="hover:text-primary transition">
                      <Link
                        to={`/categories/${category
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        onClick={toggleMenu}
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Link
              to="/favorites"
              state={{ favorites }}
              className="flex items-center hover:text-primary transition"
              onClick={toggleMenu}
            >
              <GrFavorite size={20} className="mr-2" />
              <span>Favorites ({favorites.length})</span>
            </Link>

            {showProfileIcon ? (
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
      )}

      {/* Custom CSS for Google Translate */}
      <style>
        {`
          /* Basic Google Translate cleanup */
          .goog-te-gadget {
            font-size: 0 !important;
          }
          .goog-te-banner-frame, .goog-te-menu-frame {
            display: none !important;
          }
          body {
            top: 0 !important;
          }
          
          /* Hide "Translate" text and attribution */
          .goog-te-gadget span {
            display: none !important;
          }
          
          /* IMPORTANT: Force visibility of dropdown */
          .goog-te-combo {
            display: inline-block !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: static !important;
            border: 1px solid #d1d5db !important;
            border-radius: 4px !important;
            color: #374151 !important;
            background-color: white !important;
            cursor: pointer !important;
          }
          
          /* Desktop-specific styles */
          .desktop-translator .goog-te-combo {
            border-radius: 9999px !important;
            padding: 0.4rem 0.8rem !important;
            font-size: 0.875rem !important;
            max-width: 120px !important;
          }
          
          /* Mobile-specific styles */
          .mobile-translator .goog-te-combo {
            padding: 0.3rem 0.5rem !important;
            font-size: 0.75rem !important;
            width: 100px !important;
            height: auto !important;
          }
          
          /* Handle Google Translate frame */
          .skiptranslate {
            visibility: visible !important;
            opacity: 1 !important;
          }
        `}
      </style>
    </header>
  );
};

export default Header;