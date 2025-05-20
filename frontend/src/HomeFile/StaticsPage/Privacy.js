import React from 'react';
import Header from '../../CoreFile/Header';
import Footer from '../../CoreFile/Footer';
import { PrivacyHeroSection } from './PrivacyHeroSection';

export const Privacy = () => {
  return (
    <>
      <Header />
      <PrivacyHeroSection/>

 <div className="bg-gray-50 text-gray-900 px-4 py-12">
  <div className="max-w-6xl mx-auto">
    <h1 className="text-4xl font-bold mb-6 text-center text-yellow-600">
      Privacy Policy
    </h1>
    <p className="text-center max-w-3xl mx-auto text-lg mb-6">
      At R2R Globle, your privacy is our priority. This policy outlines how we collect,
      use, protect, and handle your personal data when you interact with our platform.
    </p>

    {/* Your Data, Your Trust Intro + Full Policy */}
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-10">
      <h2 className="text-2xl font-semibold text-yellow-600 mb-4">🔐 Your Data, Your Trust</h2>
      <p className="mb-4">
        We understand the importance of safeguarding your personal and financial details. Our privacy practices
        are built on industry standards to ensure confidentiality and compliance. By using our platform, you
        consent to the collection and use of your information as described in this policy.
      </p>

      {/* A. Information We Collect */}
      <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">A. Information We Collect</h3>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        <li>Personal details like name, email address, phone number, and country of residence.</li>
        <li>Financial information during investment transactions.</li>
        <li>Device and browser data collected through cookies and tracking tools.</li>
        <li>Any communications or inquiries submitted via our contact forms.</li>
      </ul>

      {/* B. How We Use Your Data */}
      <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">B. How We Use Your Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        <li>To create and manage your investor account securely.</li>
        <li>To process transactions and send investment-related updates.</li>
        <li>To improve our platform performance and user experience.</li>
        <li>To respond to your inquiries and provide customer support.</li>
      </ul>

      {/* C. Data Protection Measures */}
      <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">C. Data Protection Measures</h3>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        <li>We use SSL encryption to secure all personal and financial data.</li>
        <li>Access to sensitive information is restricted to authorized personnel only.</li>
        <li>Regular system audits and security updates are performed.</li>
        <li>We never sell, rent, or trade your data with third parties.</li>
      </ul>

      {/* D. Your Rights & Choices */}
      <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">D. Your Rights & Choices</h3>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        <li>You can request access to or correction of your personal data.</li>
        <li>You may opt out of marketing emails anytime through unsubscribe links.</li>
        <li>You have the right to request data deletion, subject to legal obligations.</li>
        <li>You can control cookie preferences through your browser settings.</li>
      </ul>
    </div>



    {/* Final Statement */}
    <div className="mt-12 text-center">
      <p className="text-base text-gray-700">
        By using R2R Globle, you agree to the terms of this Privacy Policy and our commitment to protecting your personal data. We may update this policy periodically, and any changes will be posted on this page.
      </p>
    </div>
  </div>
</div>



      <Footer />
    </>
  );
};
