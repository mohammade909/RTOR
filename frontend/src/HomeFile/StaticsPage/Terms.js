import React from 'react';
import Header from '../../CoreFile/Header';
import Footer from '../../CoreFile/Footer';
import { TermsHeroSection } from './TermsHeroSection';

export const Terms = () => {
  return (
    <>
      <Header />
      
<TermsHeroSection/>

      {/* Main Content */}
      <div className="bg-white text-gray-800 px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <div className="p-8 bg-gray-50 rounded-lg border-l-4 border-yellow-600 shadow-sm">
              <h2 className="text-2xl font-bold text-yellow-700 mb-4">Our Commitment to Fair Use</h2>
              <p className="text-lg">
                R2R Globle aims to maintain a transparent, compliant, and trustworthy environment for all users. 
                These Terms & Conditions outline the rules that govern the use of our website, services, and 
                investment opportunities. We reserve the right to update these terms at any time, with or without notice.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            {/* User Responsibilities */}
            <div className="bg-gradient-to-br from-yellow-50 to-indigo-50 rounded-xl overflow-hidden shadow-md transform transition hover:scale-[1.01]">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-yellow-800">User Responsibilities</h2>
                </div>
                <ol className="space-y-4 text-gray-700">
                  <li className="flex">
                    <span className="font-bold mr-2">1.</span>
                    <span>Users must provide accurate personal and financial information during registration.</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-2">2.</span>
                    <span>Users are responsible for keeping their login credentials secure.</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-2">3.</span>
                    <span>Investment decisions should be made based on personal financial analysis.</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-2">4.</span>
                    <span>Users must comply with all applicable laws and platform policies.</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Investment Terms */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl overflow-hidden shadow-md transform transition hover:scale-[1.01]">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-indigo-800">Investment Terms</h2>
                </div>
                <ol className="space-y-4 text-gray-700">
                  <li className="flex">
                    <span className="font-bold mr-2">1.</span>
                    <span>All investments are subject to terms stated at the time of purchase.</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-2">2.</span>
                    <span>ROI percentages are based on real hotel performance and may vary.</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-2">3.</span>
                    <span>Users receive earnings as per the platform's payout schedule.</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-2">4.</span>
                    <span>Investments may carry risks, and past performance does not guarantee future results.</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl overflow-hidden shadow-md transform transition hover:scale-[1.01]">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-blue-800">Intellectual Property</h2>
                </div>
                <ol className="space-y-4 text-gray-700">
                  <li className="flex">
                    <span className="font-bold mr-2">1.</span>
                    <span>All content, graphics, and technology on R2R Globle are property of the company.</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-2">2.</span>
                    <span>Users may not copy, distribute, or republish any material without permission.</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-2">3.</span>
                    <span>Trademarks and logos are protected by international copyright laws.</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-2">4.</span>
                    <span>Any misuse of intellectual property may result in legal action.</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="bg-gradient-to-br from-teal-50 to-yellow-50 rounded-xl overflow-hidden shadow-md transform transition hover:scale-[1.01]">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-teal-800">Limitation of Liability</h2>
                </div>
                <ol className="space-y-4 text-gray-700">
                  <li className="flex">
                    <span className="font-bold mr-2">1.</span>
                    <span>R2R Globle is not liable for any indirect or consequential financial losses.</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-2">2.</span>
                    <span>We do not guarantee uninterrupted access to the platform at all times.</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-2">3.</span>
                    <span>Users invest at their own discretion and risk.</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-2">4.</span>
                    <span>In case of disputes, our decision will be final as per company policy.</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Agreement Footer */}
          <div className="text-center max-w-3xl mx-auto p-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-lg font-medium mb-6">
              By continuing to use R2R Globle, you confirm that you have read, understood, and agreed to these Terms & Conditions.
            </p>
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg transition">
              I Agree to the Terms
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Terms;