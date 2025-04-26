import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GrFavorite } from "react-icons/gr";
import {
  FaBars,
  FaTimes,
  FaChevronDown,
  FaUserCircle,
  FaGlobe,
} from "react-icons/fa";

const Header = ({ favorites = [] }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("English");
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const languageDropdownRef = useRef(null);
  const mobileLanguageDropdownRef = useRef(null);
  const translateInitialized = useRef(false);
  const autoDetectDone = useRef(false);

  // Check if user is authenticated AND is a customer
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("userRole");
  const isCustomer = userRole === "customer";
  const showProfileIcon = isAuthenticated && isCustomer;
  const userName = localStorage.getItem("Name") || "Profile";

  // Available languages
  const languages = [
    { code: "", name: "English" },
    { code: "ar", name: "Arabic" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "es", name: "Spanish" },
    { code: "zh-CN", name: "Chinese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "it", name: "Italian" },
  ];

  // Auto detect user's language based on browser settings
  useEffect(() => {
    // Skip if we've already detected or if there's a language cookie
    if (autoDetectDone.current) return;

    const detectUserLanguage = () => {
      // First check if user already has a language cookie set
      const cookieLang = document.cookie
        .split("; ")
        .find((row) => row.startsWith("googtrans="))
        ?.split("=")[1];

      if (cookieLang) {
        console.log("User already has language preference set via cookie");
        autoDetectDone.current = true;
        return;
      }

      // Get browser languages
      const browserLangs = navigator.languages || [
        navigator.language || navigator.userLanguage || "en",
      ];

      console.log("Browser languages:", browserLangs);

      // Map between browser language codes and our supported languages
      const languageMap = {
        en: "", // English
        ar: "ar", // Arabic
        fr: "fr", // French
        de: "de", // German
        es: "es", // Spanish
        zh: "zh-CN", // Chinese
        ru: "ru", // Russian
        ja: "ja", // Japanese
        ko: "ko", // Korean
        it: "it", // Italian
      };

      // Find the first matching language
      for (const browserLang of browserLangs) {
        // Extract the primary language code (e.g. 'en-US' -> 'en')
        const primaryLang = browserLang.split("-")[0].toLowerCase();

        if (languageMap[primaryLang]) {
          console.log(`Auto-detected language: ${primaryLang}`);
          changeLanguage(languageMap[primaryLang]);
          autoDetectDone.current = true;
          return;
        }
      }

      // If no match, default to English
      console.log("No language match, defaulting to English");
      autoDetectDone.current = true;
    };

    // Wait a bit to make sure the Google Translate is initialized
    const timer = setTimeout(detectUserLanguage, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Initialize Google Translate script
  useEffect(() => {
    if (translateInitialized.current) return;

    // Create a hidden div to hold Google Translate element
    if (!document.getElementById("google_translate_element")) {
      const translateDiv = document.createElement("div");
      translateDiv.id = "google_translate_element";
      translateDiv.style.cssText = "position:absolute; top:-1000px;";
      document.body.appendChild(translateDiv);
    }

    // Initialize Google Translate
    const initializeTranslate = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "ar,fr,de,es,zh-CN,ru,ja,ko,it",
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
        translateInitialized.current = true;
      }
    };

    // Define initialization function
    window.googleTranslateElementInit = initializeTranslate;

    // Load Google Translate script if not already loaded
    if (!document.querySelector('script[src*="translate_a/element.js"]')) {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // If script already exists, try to initialize
      initializeTranslate();
    }

    // Remove Google Translate top bar
    const removeTopBar = () => {
      const bar = document.querySelector(".skiptranslate");
      if (bar) {
        bar.style.display = "none";
      }

      // Fix for body top margin issue
      if (document.body.style.top) {
        document.body.style.top = "";
      }
    };

    // Check periodically and remove
    const interval = setInterval(removeTopBar, 300);
    setTimeout(() => clearInterval(interval), 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Direct way to change language
  const changeLanguage = (languageCode) => {
    console.log(`Changing language to: ${languageCode}`);

    // Update the displayed language first
    const language = languages.find((lang) => lang.code === languageCode);
    if (language) {
      setCurrentLanguage(language.name);
    }

    // Close the dropdown
    setLanguageDropdownOpen(false);

    // Method 1: Using iframe injection (most reliable)
    const langCode = languageCode || "en"; // Default to English

    // Create an iframe to set cookies and trigger language change
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.onload = function () {
      // Set cookie in iframe
      try {
        iframe.contentWindow.document.cookie = `googtrans=/en/${langCode}`;
        iframe.contentWindow.location.reload();

        // Also set in parent
        document.cookie = `googtrans=/en/${langCode}`;

        // Force reload to apply changes
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } catch (e) {
        console.error("Language change failed", e);
      } finally {
        // Clean up
        setTimeout(() => document.body.removeChild(iframe), 200);
      }
    };

    // Append and load
    document.body.appendChild(iframe);
    iframe.src = window.location.href;
  };

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target) &&
        mobileLanguageDropdownRef.current &&
        !mobileLanguageDropdownRef.current.contains(event.target)
      ) {
        setLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleCategories = () => setCategoriesOpen(!categoriesOpen);
  const toggleProfileDropdown = () =>
    setProfileDropdownOpen(!profileDropdownOpen);
  const toggleLanguageDropdown = () =>
    setLanguageDropdownOpen(!languageDropdownOpen);

  // Close profile dropdown when clicking outside
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

  // Detect current language on load
  useEffect(() => {
    // Try to get language from cookie
    const getCookieLanguage = () => {
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("googtrans="))
        ?.split("=")[1];

      if (cookieValue) {
        const langCode = cookieValue.split("/")[2];
        const language = languages.find((lang) => lang.code === langCode);
        if (language) {
          setCurrentLanguage(language.name);
        }
      }
    };

    // Check for language cookie on load and periodically
    getCookieLanguage();
    const interval = setInterval(getCookieLanguage, 2000);

    return () => clearInterval(interval);
  }, [languages]);

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
        {/* Custom language dropdown for mobile */}
        <div className="relative" ref={mobileLanguageDropdownRef}>
          <button
            onClick={toggleLanguageDropdown}
            className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs"
          >
            <FaGlobe className="text-gray-600 mr-1" size={14} />
            <span className="truncate max-w-16">{currentLanguage}</span>
          </button>

          {languageDropdownOpen && (
            <div className="absolute left-0 mt-1 z-50 bg-white border border-gray-200 rounded shadow-lg py-1 w-24">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className="w-full text-left px-3 py-1 text-xs hover:bg-gray-100"
                  onClick={() => {
                    console.log(`Mobile language selected: ${lang.name}`);
                    changeLanguage(lang.code);
                  }}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>

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
        {/* Custom language dropdown for desktop */}
        <div className="relative" ref={languageDropdownRef}>
          <button
            onClick={toggleLanguageDropdown}
            className="flex items-center space-x-1 border border-gray-300 rounded-full px-3 py-1.5 hover:bg-gray-50"
          >
            <FaGlobe className="text-gray-600" />
            <span>{currentLanguage}</span>
            <FaChevronDown
              className={`text-xs transition-transform ${
                languageDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {languageDropdownOpen && (
            <div className="absolute right-0 mt-1 z-50 bg-white border border-gray-200 rounded shadow-lg py-1 w-32">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100"
                  onClick={() => {
                    console.log(`Desktop language selected: ${lang.name}`);
                    changeLanguage(lang.code);
                  }}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <Link to="/" className={isActive("/")}>
          Home Page
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
            <Link
              to="/categories"
              className={`block ${isActive("/categories")}`}
              onClick={toggleMenu}
            >
              Category
            </Link>
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

      {/* Fix Google Translate top bar */}
      <style>
        {`
          /* Hide Google translate elements while keeping functionality */
          #google_translate_element {
            position: absolute;
            top: -9999px;
            left: -9999px;
            height: 0;
            overflow: hidden;
          }
          
          /* Hide Google translate bar */
          .goog-te-banner-frame {
            display: none !important;
          }
          
          /* Fix positioning */
          body {
            top: 0 !important;
            position: static !important;
          }
          
          /* Hide attribution */
          .goog-logo-link, .goog-te-gadget span {
            display: none !important;
          }
          
          /* If you want to completely hide Google styling */
          .VIpgJd-ZVi9od-ORHb-OEVmcd,
          .VIpgJd-ZVi9od-l4eHX-hSRGPd,
          .skiptranslate {
            display: none !important;
          }
          
          /* Restore visibility of translated content */
          .goog-text-highlight {
            background-color: transparent !important;
            box-shadow: none !important;
          }
        `}
      </style>
    </header>
  );
};

export default Header;
