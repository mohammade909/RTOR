
 import { useState } from 'react';
 import { Check, ChevronDown, ChevronUp } from 'lucide-react';

 export default function AgreementTerms() {
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
       title: "Investment Purpose",
       content: "You are investing in operational hotels managed by R2R Globle with the objective of earning a share of the profits generated from hotel revenues."
     },
     {
       id: 2,
       title: "Ownership & Share",
       content: "Your investment grants you a fractional ownership or profit-sharing right based on the amount invested. This does not include ownership of physical hotel property."
     },
     {
       id: 3,
       title: "Returns on Investment",
       content: "Returns are generated from hotel earnings and distributed automatically to investors as per their share, on a monthly or quarterly basis, as decided by the Company."
     },
     {
       id: 4,
       title: "Management Responsibility",
       content: "All hotel operations, management, and maintenance are fully handled by the R2R Globle team. Investors are not required to be involved in day-to-day operations."
     },
     {
       id: 5,
       title: "Transparency",
       content: "You will receive regular performance reports, earnings summaries, and updates through your registered dashboard or email."
     },
     {
       id: 6,
       title: "Withdrawal or Exit Option",
       content: "Investors may request to exit or withdraw funds based on the terms and holding period defined for the specific investment project. Early withdrawal may be subject to conditions."
     },
     {
       id: 7,
       title: "Tax & Legal Compliance",
       content: "Investors are responsible for declaring earnings and paying any taxes as per the laws of their country. R2R Globle operates under Swiss legal and financial regulations."
     },
     {
       id: 8,
       title: "Data Privacy & Security",
       content: "All your personal and financial data will be securely stored and never shared with third parties without your consent, in line with Swiss data protection laws."
     },
     {
       id: 9,
       title: "Agreement Duration",
       content: "This agreement remains valid for the duration of your active investment. Specific project timelines may vary and will be communicated separately."
     },
     {
       id: 10,
       title: "Dispute Resolution",
       content: "Any disputes arising from this agreement shall be resolved under the jurisdiction of Swiss law, with mediation or arbitration preferred before legal proceedings."
     },
     {
       id: 11,
       title: "Acceptance",
       content: "By signing or confirming this agreement digitally, you acknowledge that you have read, understood, and agreed to all the above terms."
     }
   ];

   return (
     <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 my-10">
       <div className="text-center mb-8">
         <h1 className="text-3xl font-bold text-indigo-900">R2R Globle Hotel Investment Agreement</h1>
         <p className="text-gray-600 mt-2">
           This Agreement outlines the terms between <span className="font-semibold">R2R Globle</span> and the <span className="font-semibold">Investor</span> in relation to your investment in income-generating hotels.
         </p>
       </div>

       <div className="bg-gray-50 rounded-lg p-4 mb-8">
         <div className="flex items-center text-indigo-800 mb-2">
           <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http:www.w3.org/2000/svg">
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
                 <span className="font-medium text-gray-800">{term.title}</span>
               </div>
               {expandedSection === term.id ? 
                 <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                 <ChevronDown className="w-5 h-5 text-gray-500" />
               }
             </button>
             {expandedSection === term.id && (
               <div className="px-4 py-3 bg-white">
                 <p className="text-gray-800">{term.content}</p>
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