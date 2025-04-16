import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="p-8 bg-gray-100 border-t">
      {/* Top Section */}
      <div className="flex flex-wrap lg:flex-nowrap justify-between gap-8">
        {/* Logo & Description */}
        <div className="w-full md:w-[50%] space-y-5">
          <Link to="/">
            <img src="/llogo.png" className="w-32" alt="Logo" />
          </Link>{" "}
          <p className="text-xl font-bold ">Your Go-To Online Marketplace!</p>
          <p className="text-sm text-gray-600">
            {" "}
            At Diaay, we make shopping simple, secure, and enjoyable. Whether
            you're looking for the latest trends, everyday essentials, or unique
            finds, we've got something for everyone. Browse, shop, and have your
            favorites delivered right to you — all in just a few clicks.
          </p>
          <p>Happy Shopping!</p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap lg:flex-nowrap gap-8 w-full md:w-[50%] justify-between">
          {/* Company Links */}
          <div className="space-y-4 w-[45%] md:w-auto">
            <h1 className="font-medium text-base">Company</h1>
            <Link
              to="/about"
              className="font-normal text-sm text-gray-400 cursor-pointer hover:text-black"
            >
              About us
            </Link>

            <p className="font-normal text-sm text-gray-400 cursor-pointer hover:text-black">
              How it works
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 w-[45%] md:w-auto">
            <h1 className="font-medium text-base">Quick Links</h1>
            <p className="font-normal text-sm text-gray-400 cursor-pointer hover:text-black">
              Post Ad
            </p>
            <p className="font-normal text-sm text-gray-400 cursor-pointer hover:text-black">
              Referral
            </p>
            <p className="font-normal text-sm text-gray-400 cursor-pointer hover:text-black">
              FAQ
            </p>
            <p className="font-normal text-sm text-gray-400 cursor-pointer hover:text-black">
              Blog
            </p>
          </div>

          {/* Legal Links */}
          <div className="space-y-4 w-[45%] md:w-auto">
            <h1 className="font-medium text-base">Legal</h1>
            <p className="font-normal text-sm text-gray-400 cursor-pointer hover:text-black">
              <Link to="/privacy-policy">Privacy Policy</Link>
            </p>
            <p className="font-normal text-sm text-gray-400 cursor-pointer hover:text-black">
              <Link to="/rules">Terms and Conditions</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-4 text-sm text-gray-600">
        © 2025 Company. All rights reserved.
      </div>
      <hr className="my-4" />

      {/* Bottom Section */}
      <div className="flex flex-wrap lg:flex-nowrap justify-between items-center gap-6 mt-8">
        {/* Subscription Section */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-[60%]">
          <input
            type="text"
            placeholder="Enter your email address"
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-[70%] focus:outline-none focus:ring focus:ring-primary"
          />
          <button className="text-sm px-4 py-2 bg-primary text-white rounded-3xl hover:bg-purple-600 w-full md:w-[25%]">
            Subscribe
          </button>
        </div>

        {/* Social Media Links with React Icons */}
        <div className="w-full md:w-[40%] space-y-4">
          <h1 className="font-medium text-base">Follow us</h1>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-gray-400 text-blue-600 transition-colors">
              <FaFacebook size={24} />
            </a>
            <a href="#" className="hover:text-gray-400 text-blue-400 transition-colors">
              <FaTwitter size={24} />
            </a>
            <a href="#" className="hover:text-gray-400 text-pink-600 transition-colors">
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Powered By Section */}
      <div className="flex items-center justify-center mt-6">
        <p className="text-sm text-gray-600 mr-2">Powered by</p>
        <img src="/powered.jpeg" alt="Powered by logo" className="h-10" />
      </div>
    </footer>
  );
}

export default Footer;