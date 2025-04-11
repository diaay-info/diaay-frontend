import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";

function TermsAndConditions() {
  return (
    <>
      <Header />
      <section
        id="terms-and-conditions"
        className="font-sans leading-relaxed px-4 py-10 md:px-10 lg:px-16 max-w-6xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl text-primary font-bold mb-4">
          Terms and Conditions
        </h1>
        <p className="mb-6">
          <strong>Effective Date:</strong> April 10, 2025
        </p>

        <p className="mb-6">
          Welcome to <strong>Diaay</strong>, a digital marketplace designed to
          connect buyers with independent vendors and empower partners to refer
          customers. Please read these Terms and Conditions carefully before
          using our platform. By accessing or using the website, you agree to
          these terms.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">1. Overview</h2>
        <p className="mb-3">Diaay serves as a marketplace for:</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Vendors to advertise products or services</li>
          <li className="mb-2">
            Customers to browse listings and connect directly with vendors
          </li>
          <li className="mb-2">
            Partners (Referrers) to promote vendors and earn referral
            commissions
          </li>
        </ul>
        <p className="mb-6">
          <strong>Important:</strong> Diaay does not process payments, does not
          facilitate delivery, and is not a party to any transaction between
          vendors and buyers.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          2. Roles & Responsibilities
        </h2>

        <h3 className="text-xl font-bold mt-6 mb-3">2.1 Vendors</h3>
        <p className="mb-3">Vendors are solely responsible for:</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Accuracy of product listings</li>
          <li className="mb-2">Providing valid contact information</li>
          <li className="mb-2">Pricing and stock availability</li>
          <li className="mb-2">Communication with customers</li>
          <li className="mb-2">Order fulfillment and delivery</li>
          <li className="mb-2">Complying with applicable laws</li>
        </ul>
        <p className="mb-6">
          Vendors agree to pay commissions to partners based on agreed referral
          terms and track referrals accurately.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">2.2 Buyers (Customers)</h3>
        <p className="mb-6">
          Customers interact directly with vendors for inquiries, negotiations,
          payment, and delivery. Diaay is not liable for product quality,
          delivery, or payment issues.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">
          2.3 Partners (Referrers)
        </h3>
        <p className="mb-3">
          Partners promote vendor products through unique referral links or
          codes.
        </p>
        <ul className="list-disc pl-6 mb-3">
          <li className="mb-2">
            Partners earn a commission per referred sale as agreed upon with the
            vendor.
          </li>
        </ul>
        <p className="mb-6">
          Diaay does not guarantee commission payment or enforce referral
          agreements; these are managed directly between partners and vendors.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">3. Platform Use</h2>
        <p className="mb-3">By using Diaay, you agree to:</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Use the platform only for lawful purposes</li>
          <li className="mb-2">Provide accurate and truthful information</li>
          <li className="mb-2">
            Refrain from misrepresenting products or impersonating others
          </li>
          <li className="mb-2">
            Not post or share offensive, fraudulent, or infringing content
          </li>
        </ul>
        <p className="mb-6">
          We may suspend or remove users who violate these terms without notice.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          4. Intellectual Property
        </h2>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            All content provided by Diaay (excluding vendor listings) is the
            property of Diaay and protected by copyright. You may not copy,
            modify, or redistribute our materials without permission.
          </li>
          <li className="mb-2">
            Vendors retain rights to their content but grant Diaay a license to
            display and promote their listings.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          5. Liability Disclaimer
        </h2>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            Diaay is not involved in any transactions and does not offer buyer
            protection, dispute resolution, or guarantees on vendor performance.
          </li>
          <li className="mb-2">
            Diaay is not responsible for the accuracy of listings, vendor
            behavior, delivery delays, or payment issues.
          </li>
          <li className="mb-2">
            Diaay is not liable for losses, damages, or dissatisfaction related
            to products or services.
          </li>
        </ul>
        <p className="mb-6">
          Users engage at their own risk and are encouraged to conduct due
          diligence.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          6. Referrals & Commissions
        </h2>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            All referral arrangements are strictly between the vendor and
            partner.
          </li>
          <li className="mb-2">
            Diaay does not mediate disputes regarding commission payments or
            referral tracking.
          </li>
          <li className="mb-2">
            Vendors are encouraged to maintain transparent and fair referral
            practices.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">7. Termination</h2>
        <p className="mb-6">
          We reserve the right to terminate access to any user—vendor, buyer, or
          partner—who violates these terms or uses the platform maliciously.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">8. Privacy</h2>
        <p className="mb-6">
          We respect your privacy. Please refer to our{" "}
          <Link
            to="/privacy-policy"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Privacy Policy
          </Link>{" "}
          for information about how we collect, use, and protect your data.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">9. Changes to Terms</h2>
        <p className="mb-6">
          We may revise these Terms periodically. Continued use of the platform
          after changes constitutes your acceptance of the revised terms.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact Us</h2>
        <p className="mb-3">
          For inquiries related to these Terms and Conditions:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            <strong>Email:</strong> info@diaay.com
          </li>
          <li className="mb-2">
            <strong>Address:</strong> Dakar, Sénégal — Karack en face école
            police
          </li>
        </ul>
      </section>
      <Footer />
    </>
  );
}

export default TermsAndConditions;
