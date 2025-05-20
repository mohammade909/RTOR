 import { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

export default function SignupTerms() {
  const [accepted, setAccepted] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (sectionId) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
    }
  };

  const termsData = [
    {
      id: 1,
      title: "Eligibility",
      content: "You must be at least 18 years old and legally able to enter into contracts to create an account and invest on R2R Globle."
    },
    {
      id: 2,
      title: "Account Information",
      content: "You agree to provide accurate and complete information during sign-up. You are responsible for keeping your login details safe and confidential."
    },
    {
      id: 3,
      title: " Use of Platform",
      content: "You may use R2R Globle only for lawful purposes and to explore or make investments in hotel projects offered on the platform."
    },
    {
      id: 4,
      title: "Investment Risk",
      content: "All investments involve some level of risk. R2R Globle does not guarantee returns or capital protection. Please invest responsibly."
    },
    {
      id: 5,
      title: "Account Security",
      content: "You are responsible for all activity under your account. If you suspect any unauthorized use, you must inform us immediately."
    },
    {
      id: 6,
      title: "Privacy",
      content: "Your personal data will be protected and used according to our Privacy Policy. We do not sell or share your information with third parties without your permission."
    },
    {
      id: 7,
      title: "Termination",
      content: "We reserve the right to suspend or delete your account if you violate these terms or misuse the platform in any way."
    },
    {
      id: 8,
      title: "Acceptance",
      content: "By signing up, you confirm that you have read, understood, and agree to these Terms and Conditions."
    },

  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 my-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-900">R2R Globle – Terms and Conditions for Sign-Up
</h1>
        <p className="text-gray-600 mt-2">
          By signing up on R2R Globle, you agree to the following terms and conditions. Please read them carefully before creating your account. 
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-8">
        <div className="flex items-center text-indigo-800 mb-2">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span className="font-medium">Please review all terms carefully before proceeding</span>
        </div>
        <p className="text-sm text-gray-600">
          By accepting these terms, you acknowledge that you have read, understood, and agreed to all conditions outlined in this agreement.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {termsData.map((term) => (
          <div 
            key={term.id} 
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button 
              className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
              onClick={() => toggleSection(term.id)}
            >
              <div className="flex items-center">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-800 text-sm mr-3">
                  {term.id}
                </span>
                <span className="font-medium">{term.title}</span>
              </div>
              {expandedSection === term.id ? 
                <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                <ChevronDown className="w-5 h-5 text-gray-500" />
              }
            </button>
            {expandedSection === term.id && (
              <div className="px-4 py-3 bg-white">
                <p className="text-gray-700">{term.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* <div className="border-t border-gray-200 pt-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Acceptance</h3>
        <div className="flex items-start mb-6">
          <div className="flex items-center h-5">
            <input
              id="terms-checkbox"
              type="checkbox"
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
              className="w-5 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-indigo-300"
            />
          </div>
          <label htmlFor="terms-checkbox" className="ml-2 text-sm text-gray-700">
            I have read, understood, and agree to all the terms and conditions outlined in the R2R Globle Hotel Investment Agreement. I understand that by checking this box and proceeding, I am entering into a legally binding agreement.
          </label>
        </div>
      </div> */}

      {/* <div className="flex justify-between">
        <button 
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors duration-150"
        >
          Back
        </button>
        <button 
          className={`px-6 py-2 rounded transition-colors duration-150 flex items-center ${
            accepted 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!accepted}
        >
          {accepted && <Check className="w-4 h-4 mr-2" />}
          Continue
        </button>
      </div> */}
    </div>
  );
}



