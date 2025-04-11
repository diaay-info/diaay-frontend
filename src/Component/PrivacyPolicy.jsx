import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function PrivacyPolicy() {
  return (
    <>
      <Header />
      <section className="font-sans leading-relaxed px-4 py-10 md:px-10 lg:px-16 max-w-6xl mx-auto">
        <h1 className="text-3xl text-primary md:text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4">
          <strong>Effective Date:</strong> April 10, 2025
        </p>
        
        <p className="mb-6">
          At <strong>Diaay</strong>, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our e-commerce platform.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
        <p className="mb-3">We may collect the following personal data when you use our services:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Full Name</li>
          <li className="mb-2">Email Address</li>
          <li className="mb-2">Phone Number</li>
        </ul>
        <p className="mb-6">
          We collect this information when you register, make a purchase, or contact us for support.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
        <p className="mb-3">We use your personal data to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Connect vendors, customers, and partners</li>
          <li className="mb-2">Respond to user inquiries and support needs</li>
          <li className="mb-2">Monitor and analyze site usage</li>
          <li className="mb-2">Prevent fraud and enforce terms</li>
          <li className="mb-2">Provide customer support</li>
          <li className="mb-2">Comply with legal obligations</li>
        </ul>
        <p className="mb-6">
          We do not use cookies or any third-party analytics tools.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Data Sharing and Disclosure</h2>
        <p className="mb-3">We do not sell your data. However, we may share information with:</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Vendors (when you initiate contact or a referral is made)</li>
          <li className="mb-2">Partners (regarding referral performance, if applicable)</li>
          <li className="mb-2">Service providers (e.g., hosting, analytics) under confidentiality agreements</li>
          <li className="mb-2">Law enforcement if required to comply with legal obligations</li>
        </ul>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Vendor &amp; Partner Responsibility</h2>
        <p className="mb-3">Vendors and partners are independently responsible for:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Managing and securing their own customer/referral data</li>
          <li className="mb-2">Complying with local data privacy laws</li>
          <li className="mb-2">Providing transparency about their data handling practices</li>
        </ul>
        <p className="mb-6">
          <strong>Diaay</strong> is not liable for how third parties (vendors or partners) use or store your information.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Protection and Security</h2>
        <p className="mb-6">
          We take appropriate technical and organizational measures to protect your data from unauthorized access, loss, or misuse.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">6. International Compliance</h2>
        <p className="mb-3">We comply with applicable data protection laws, including:</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">GDPR (General Data Protection Regulation)</li>
          <li className="mb-2">National and Independent Data Protection Authorities in Benin</li>
          <li className="mb-2">Relevant international data protection conventions</li>
        </ul>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Your Rights</h2>
        <p className="mb-3">As a user, you have the right to:</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Access your personal data</li>
          <li className="mb-2">Request correction or deletion</li>
          <li className="mb-2">Object to or restrict certain data processing</li>
          <li className="mb-2">Withdraw consent at any time (where applicable)</li>
          <li className="mb-2">Lodge a complaint with a data protection authority</li>
        </ul>
        <p className="mb-6">
          To exercise any of these rights, please contact us using the details below.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Children's Privacy</h2>
        <p className="mb-6">
          <strong>Diaay</strong> is not intended for users under the age of 18. We do not knowingly collect data from children.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">9. Policy Updates</h2>
        <p className="mb-6">
          We may update this Privacy Policy periodically. Changes will be posted on this page with an updated effective date. Continued use of the platform indicates your acceptance of any changes. The "Effective Date" above reflects the latest revision.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact Us</h2>
        <p className="mb-2">
          If you have any questions or requests regarding your personal data, please contact us:
        </p>
        <p className="mb-6">
          <strong>Email:</strong> contact@diaay.com<br />
          <strong>Address:</strong> Karack, en face école de police, Dakar, Sénégal
        </p>
      </section>
      <Footer />
    </>
  );
}

export default PrivacyPolicy;