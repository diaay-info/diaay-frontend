import React from "react";

function Footer() {
  return (
    <footer className="p-8 bg-white mt-8 border-t">
      {/* Top Section */}
      <div className="flex flex-wrap lg:flex-nowrap justify-between gap-8">
        {/* Logo & Description */}
        <div className="w-full md:w-[50%] space-y-5">
          <h3 className="font-bold text-lg">LOGO</h3>
          <p className="text-sm text-gray-600">
            Experience stress-free living with our fully furnished,
            all-inclusive apartments, designed for students and professionals.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap lg:flex-nowrap gap-8 w-full md:w-[50%] justify-between">
          {/* Company Links */}
          <div className="space-y-4 w-[45%] md:w-auto">
            <h1 className="font-medium text-base">Company</h1>
            <p className="font-normal text-sm text-gray-400 cursor-pointer hover:text-black">
              About us
            </p>
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
              Privacy Policy
            </p>
            <p className="font-normal text-sm text-gray-400 cursor-pointer hover:text-black">
              Terms and Conditions
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-4 text-sm text-gray-600">
        © 2024 Company. All rights reserved.
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

        {/* Social Media Links */}
        <div className="w-full md:w-[40%] space-y-4">
          <h1 className="font-medium text-base">Follow us</h1>
          <div className="flex items-center gap-5 text-sm">
            <p className="cursor-pointer hover:text-black">Facebook</p>
            <p className="cursor-pointer hover:text-black">Twitter</p>
            <p className="cursor-pointer hover:text-black">Instagram</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
