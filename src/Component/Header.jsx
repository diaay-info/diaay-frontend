import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GrFavorite } from "react-icons/gr";
import {
  FaSearch,
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

  // Load Google Translate script
  useEffect(() => {
    let script;
    let timeout;

    const initializeTranslate = () => {
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,fr,es,de,it,pt,ar,zh-CN,ja,ru",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      } else {
        // Retry after a short delay if Google Translate isn't loaded yet
        timeout = setTimeout(initializeTranslate, 100);
      }
    };

    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = initializeTranslate;

      script = document.createElement("script");
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onerror = () => {
        console.error("Failed to load Google Translate script");
      };
      document.body.appendChild(script);
    }

    return () => {
      clearTimeout(timeout);
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      try {
        if (window.googleTranslateElementInit) {
          delete window.googleTranslateElementInit;
        }
      } catch (e) {
        console.warn("Could not clean up Google Translate", e);
      }
    };
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleCategories = () => setCategoriesOpen(!categoriesOpen);
  const toggleProfileDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);

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

      {/* Google Translate - Desktop */}
      <div className="hidden md:flex items-center mr-4">
        <div className="flex items-center">
          <FaLanguage className="text-gray-600 mr-2" />
          <div
            id="google_translate_element"
            className="translate-selector"
            style={{
              display: "inline-block",
              position: "relative",
              zIndex: 0,
            }}
          ></div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6 text-sm">
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
          <GrFavorite size={20} />({favorites.length})
        </Link>

        {showProfileIcon ? (
          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <FaUserCircle size={24} className="text-gray-600" />
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

      {/* Mobile Menu Button and Translator */}
      <div className="md:hidden flex items-center space-x-4">
        {/* Google Translate - Mobile */}
        <div className="flex items-center">
          <FaLanguage className="text-gray-600 mr-1" />
          <div
            id="google_translate_element"
            className="translate-selector-mobile"
            style={{
              display: "inline-block",
              position: "relative",
              zIndex: 0,
            }}
          ></div>
        </div>
        <button className="text-2xl" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

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
          {showProfileIcon && (
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
            className="flex text-lg w-full focus:outline-none hover:text-primary transition"
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
            to="/favourites"
            className="hover:text-primary transition"
            onClick={toggleMenu}
          >
            Favourites
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

      {/* Custom CSS for Google Translate */}
      <style>
        {`
          /* Desktop styles */
          .translate-selector .goog-te-combo {
            border: 1px solid #d1d5db;
            border-radius: 9999px;
            padding: 0.4rem 0.8rem;
            font-size: 0.875rem;
            color: #374151;
            background-color: white;
            cursor: pointer;
            min-width: 120px;
          }
          
          /* Mobile styles */
          .translate-selector-mobile .goog-te-combo {
            border: 1px solid #d1d5db;
            border-radius: 9999px;
            padding: 0.3rem 0.6rem;
            font-size: 0.75rem;
            color: #374151;
            background-color: white;
            cursor: pointer;
            min-width: 90px;
          }
          
          /* Common styles */
          .goog-te-gadget {
            font-size: 0 !important;
          }
          .goog-te-gadget-simple {
            background-color: transparent !important;
            border: none !important;
            padding: 0 !important;
          }
          .goog-te-menu-value span {
            display: none;
          }
          .goog-te-menu-value:before {
            content: "Language";
            color: #4b5563;
            font-size: 0.875rem;
          }
          .goog-te-menu-value img {
            margin-right: 4px;
          }
          .goog-te-banner-frame {
            display: none !important;
          }
          body {
            top: 0 !important;
          }
          
          /* Mobile specific adjustments */
          @media (max-width: 768px) {
            .goog-te-menu-value:before {
              content: "";
            }
            .translate-selector-mobile .goog-te-combo {
              padding: 0.25rem 0.5rem;
            }
          }
          
          /* Dropdown arrow styling */
          .goog-te-menu-value:after {
            content: "▼";
            font-size: 0.6em;
            margin-left: 4px;
            color: #6b7280;
          }
        `}
      </style>
    </header>
  );
};

export default Header;