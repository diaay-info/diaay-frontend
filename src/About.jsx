import React from "react";
import Header from "./Component/Header";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import Footer from "./Component/Footer";

const About = () => {
  return (
    <div>
      <Header />
      <main className="m-5 md:m-10 space-y-10">
        {/* Who We Are Section */}
        <div className="bg-primary rounded-md text-white text-center py-8 px-6 md:py-10 md:px-40 space-y-4">
          <h1 className="font-medium text-xl md:text-2xl">Who We Are</h1>
          <p className="text-sm md:text-base">
            Welcome to our Marketing and Advertising Platform! We are a digital
            marketplace designed to connect vendors and partners, enabling
            vendors to advertise their products and services while partners earn
            commissions through referrals. Our mission is to provide a seamless
            platform for advertising and earning opportunities.
          </p>
        </div>

        {/* Platform Features Section */}
        <div className="py-8 px-5 border border-gray-300 rounded-md space-y-4">
          <h1 className="text-lg md:text-xl font-medium">
            Our platform serves as a hub for:
          </h1>
          <hr />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4 w-full md:w-1/2">
              <h2 className="font-medium text-base">Vendors</h2>
              <p className="font-normal text-sm">
                Easily advertise products and services using our credit-based
                system.
              </p>
            </div>
            <div className="space-y-4 w-full md:w-1/2">
              <h2 className="font-medium text-base">Partners</h2>
              <p className="font-normal text-sm">
                Earn a % commission by referring new customers.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="py-8 px-5 border border-gray-300 rounded-md space-y-4">
          <h1 className="text-lg md:text-xl font-medium">Why Choose Us?</h1>
          <hr />
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <p className="font-normal text-sm w-full md:w-1/2">
              Our mission is to empower vendors and partners with tools to grow
              their reach and income seamlessly.
            </p>
            <ul className="list-disc space-y-2 w-full md:w-1/2">
              <li>Free ads for vendors (first 5 ads).</li>
              <li>Affordable credit system for advertisements.</li>
              <li>
                Reliable referral system with transparent earnings for partners.
              </li>
              <li>Secure payment options via Wave and Orange Money.</li>
              <li>Dedicated admin support for ad validation and inquiries.</li>
            </ul>
          </div>
        </div>

        {/* Call-to-Action Section */}
        <div className="flex justify-center items-center text-center">
          <div className="bg-black rounded-md text-white p-6 md:p-8 max-w-lg">
            <p className="font-medium text-lg md:text-xl mb-6">
              Discover how our features can help you advertise and start earning
              with referrals.
            </p>
            <Link to="/start">
              <div className="flex w-[15rem] mx-auto items-center justify-center gap-4 p-3 rounded-3xl bg-primary cursor-pointer">
                <p className="font-medium">Start Now</p>
                <div className="bg-white text-primary rounded-full p-2">
                  <FaLongArrowAltRight />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Contact Section */}
        <div className="py-10 px-5 border border-gray-300 rounded-md space-y-8">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            {/* Contact Information */}
            <div className="space-y-6 md:w-1/2">
              <div className="space-y-2">
                <h1 className="text-lg md:text-xl font-medium">Contact Us</h1>
                <p>Email, call, or complete the form to contact us:</p>
                <p className="text-sm">info@diaay.com</p>
                <p className="text-sm">+221 779 359 683</p>
              </div>
              <div className="space-y-2">
                <h1 className="text-lg md:text-xl font-medium">Our Location</h1>
                <p className="text-sm">Diaay Company</p>
                <p className="text-sm">Senegal, Cotonou</p>
                <p className="text-sm">
                  Dakar Senegal, Karack en face ecole police.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="w-full md:w-1/2">
              <div className="bg-white rounded-lg p-6 border border-gray-300">
                <div className="text-center mb-6">
                  <h2 className="text-lg md:text-2xl font-bold text-gray-800">
                    Get in Touch
                  </h2>
                  <p className="text-sm text-gray-600">
                    You can reach us anytime.
                  </p>
                </div>
                <form
                  className="space-y-4"
                  action="mailto:info@diaay.com"
                  method="post"
                  encType="text/plain"
                >
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <textarea
                    rows="4"
                    name="message"
                    placeholder="Your Message"
                    className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Submit 
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
