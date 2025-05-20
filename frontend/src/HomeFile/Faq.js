// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp, Hotel, Award, Star, DollarSign, Clock, Shield } from 'lucide-react';

// export default function Faq() {
//   const [openQuestion, setOpenQuestion] = useState(0);

//   const toggleQuestion = (index) => {
//     setOpenQuestion(openQuestion === index ? null : index);
//   };

//   const faqItems = [
//     {
//       question: "What is R2R Globle?",
//       answer: "R2R Globle is a global hotel investment platform that allows you to earn passive income by investing in real, income-generating hotel rooms.",
//       icon: <Hotel size={20} className="text-yellow-500" />
//     },
//     {
//       question: "How do I earn from my investment?",
//       answer: "You earn daily rent income based on the hotel’s performance. The earnings are automatically added to your dashboard and can be withdrawn based on terms.",
//       icon: <DollarSign size={20} className="text-yellow-500" />
//     },
//     {
//       question: " Is my investment secure?",
//       answer: "Yes. All investments are backed by legal contracts and verified hotel partnerships. We follow strict due diligence and transparency practices.",
//       icon: <Shield size={20} className="text-yellow-500" />
//     },
//     {
//       question: "What is the minimum amount required to invest?",
//       answer: "You can start investing with just $100, making it accessible for first-time and small-scale investors.",
//       icon: <Star size={20} className="text-yellow-500" />
//     },
//     {
//       question: " Can I track my earnings in real time?",
//       answer: "Absolutely. Your personal dashboard shows real-time income, room performance, and transaction history.",
//       icon: <Clock size={20} className="text-yellow-500" />
//     },
//   ];

//   return (
//     <div className="bg-gradient-to-br from-yellow-50 to-slate-100 lg:min-h-screen py-10 lg:py-16">
//       <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 relative z-10">
//         {/* Header Section with curved background */}
//         <div className="relative mb-16 text-center">
//           <div className="absolute inset-0 bg-yellow-600 rounded-3xl opacity-10 transform -skew-y-2"></div>
//           <div className="relative py-12 sm:px-8">
//             <h2 className="sm:text-4xl text-2xl px-1 md:text-5xl font-bold text-slate-800 mb-4">Stay Updated with the Latest Insights</h2>
//             <p className="sm:text-xl text-lg text-slate-600 max-w-2xl px-5 mx-auto">Explore expert tips, market trends, and hotel investment strategies—all in one place. Get the knowledge you need to make smarter decisions and grow your returns with confidence.</p>
//           </div>
//         </div>
        
//         {/* Main Content - Horizontal Layout */}
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Left FAQ Column */}
//           <div className="w-full lg:w-3/5 order-2 lg:order-1">
//             <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
//               <div className="bg-yellow-700 p-6">
//                 <div className="flex sm:flex-row flex-col items-center">
//                   <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl mr-4">
//                     <Award size={28} className="text-white" />
//                   </div>
//                   <div>
//                     <h3 className="sm:text-2xl sm:text-left text-center text-base font-bold text-white">Frequently Asked Questions</h3>
//                     <p className="text-yellow-100  sm:text-left text-center sm:text-xl text-base mt-1">Got questions? We’ve got answers.</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="divide-y divide-slate-100">
//                 {faqItems.map((item, index) => (
//                   <div key={index} className="transition-all duration-300">
//                     <button
//                       className={`w-full flex items-center gap-4 p-6 text-left focus:outline-none hover:bg-yellow-50 ${openQuestion === index ? 'bg-yellow-50' : ''}`}
//                       onClick={() => toggleQuestion(index)}
//                     >
//                       <div className={`p-3 rounded-xl ${openQuestion === index ? 'bg-yellow-100' : 'bg-slate-100'}`}>
//                         {item.icon}
//                       </div>
//                       <div className="flex-1">
//                         <span className={`sm:text-lg text-[12px] font-medium ${openQuestion === index ? 'text-yellow-700' : 'text-slate-800'}`}>
//                           {item.question}
//                         </span>
//                       </div>
//                       <div className={`p-2 sm:block hidden rounded-full ${openQuestion === index ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
//                         {openQuestion === index ? 
//                           <ChevronUp className="h-5 w-5" /> : 
//                           <ChevronDown className="h-5 w-5" />
//                         }
//                       </div>
//                     </button>
                    
//                     {openQuestion === index && (
//                       <div className="px-6 pb-6 pt-0 ml-16 sm:text-base text-[10px] text-slate-600 animate-fadeIn">
//                         <p>{item.answer}</p>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
              
//               <div className="bg-slate-50 p-6 flex  flex-col sm:flex-row items-center justify-between">
//                 <div>
//                   <p className="font-medium text-slate-700">Still have questions?</p>
//                   <p className="text-slate-500 text-sm">Our investment specialists are here to help</p>
//                 </div>
//                 <button className="px-6 py-3 sm:mt-0 mt-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-xl transition-colors">
//                   Contact Us
//                 </button>
//               </div>
//             </div>
//           </div>
          
//           {/* Right Side Image & Info Column */}
//           <div className="w-full lg:w-2/5 order-1 lg:order-2">
//             <div className="sticky top-8 space-y-6">
//               {/* Main Image Card */}
//               <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
//                 <div className="relative h-80">
//                   <img 
//                     src="/faq1.avif" 
//                     alt="Luxury Hotel Investment" 
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/90 via-yellow-900/40 to-transparent flex flex-col justify-end p-6">
//                     <div className="inline-flex items-center bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-yellow-800 font-semibold text-sm mb-3">
//                       <Star size={16} className="mr-2 text-yellow-500" />
//                       Exclusive Opportunity
//                     </div>
//                     <h3 className="text-2xl font-bold text-white">Luxury Rooms as Investment Assets</h3>
//                   </div>
//                 </div>
//               </div>

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Hotel, Award, Star, DollarSign, Clock, Shield } from 'lucide-react';
import { Link } from "react-router-dom";
export default function Faq() {
  const [openQuestion, setOpenQuestion] = useState(0);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqItems = [
    {
      question: "What is R2R Globle?",
      answer: "R2R Globle is a globle hotel investment platform that allows you to earn passive income by investing in real, income-generating hotel rooms.",
      icon: <Hotel size={20} className="text-yellow-500" />
    },
    {
      question: "How do I earn from my investment?",
      answer: "You earn daily rent income based on the hotel's performance. The earnings are automatically added to your dashboard and can be withdrawn based on terms.",
      icon: <DollarSign size={20} className="text-yellow-500" />
    },
    {
      question: "Is my investment secure?",
      answer: "Yes. All investments are backed by legal contracts and verified hotel partnerships. We follow strict due diligence and transparency practices.",
      icon: <Shield size={20} className="text-yellow-500" />
    },
    {
      question: "What is the minimum amount required to invest?",
      answer: "You can start investing with just $100, making it accessible for first-time and small-scale investors.",
      icon: <Star size={20} className="text-yellow-500" />
    },
    {
      question: "Can I track my earnings in real time?",
      answer: "Absolutely. Your personal dashboard shows real-time income, room performance, and transaction history.",
      icon: <Clock size={20} className="text-yellow-500" />
    },
  ];

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-slate-100 min-h-screen w-full py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative z-10">
        {/* Header Section with curved background */}
        <div className="relative mb-10 md:mb-16 text-center">
          <div className="absolute inset-0 bg-yellow-600 rounded-2xl md:rounded-3xl opacity-10 transform -skew-y-2"></div>
          <div className="relative py-8 md:py-12 px-4 md:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-3 md:mb-4">Stay Updated with the Latest Insights</h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">Explore expert tips, market trends, and hotel investment strategies—all in one place. Get the knowledge you need to make smarter decisions and grow your returns with confidence.</p>
          </div>
        </div>
        
        {/* Main Content - Horizontal Layout */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Left FAQ Column */}
          <div className="w-full lg:w-3/5 order-2 lg:order-1">
            <div className="bg-white rounded-xl md:rounded-3xl shadow-xl overflow-hidden border border-slate-100 h-full">
              <div className="bg-yellow-700 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center">
                  <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl mb-3 sm:mb-0 sm:mr-4">
                    <Award size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-center sm:text-left">Frequently Asked Questions</h3>
                    <p className="text-yellow-100 text-sm md:text-base lg:text-lg mt-1 text-center sm:text-left">Got questions? We've got answers.</p>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-slate-100">
                {faqItems.map((item, index) => (
                  <div key={index} className="transition-all duration-300">
                    <button
                      className={`w-full flex items-center gap-3 md:gap-4 p-4 md:p-6 text-left focus:outline-none hover:bg-yellow-50 ${openQuestion === index ? 'bg-yellow-50' : ''}`}
                      onClick={() => toggleQuestion(index)}
                    >
                      <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${openQuestion === index ? 'bg-yellow-100' : 'bg-slate-100'}`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <span className={`text-sm sm:text-base md:text-lg font-medium ${openQuestion === index ? 'text-yellow-700' : 'text-slate-800'}`}>
                          {item.question}
                        </span>
                      </div>
                      <div className={`p-1 md:p-2 rounded-full ${openQuestion === index ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
                        {openQuestion === index ? 
                          <ChevronUp className="h-4 w-4 md:h-5 md:w-5" /> : 
                          <ChevronDown className="h-4 w-4 md:h-5 md:w-5" />
                        }
                      </div>
                    </button>
                    
                    {openQuestion === index && (
                      <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0 ml-10 sm:ml-12 md:ml-16 text-xs sm:text-sm md:text-base text-slate-600 animate-fadeIn">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="bg-slate-50 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between">
                <div className="text-center sm:text-left mb-3 sm:mb-0">
                  <p className="font-medium text-slate-700 text-sm md:text-base">Still have questions?</p>
                  <p className="text-slate-500 text-xs md:text-sm">Our investment specialists are here to help</p>
                </div>
                <Link to="/contact-us" className="px-4 md:px-6 py-2 md:py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg md:rounded-xl transition-colors text-sm md:text-base w-full sm:w-auto">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
          
          {/* Right Side Image & Info Column */}
          <div className="w-full lg:w-2/5 order-1 lg:order-2 mb-6 lg:mb-0">
            <div className="lg:sticky lg:top-8 space-y-4 md:space-y-6">
              {/* Main Image Card */}
              <div className="bg-white rounded-xl md:rounded-3xl shadow-xl overflow-hidden">
                <div className="relative h-48 sm:h-64 md:h-72 lg:h-80">
                  <img 
                     src="/faq1.avif" 
                     alt="Luxury Hotel Investment" 
                     className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/90 via-yellow-900/40 to-transparent flex flex-col justify-end p-4 md:p-6">
                    <div className="inline-flex items-center bg-white/90 backdrop-blur-sm px-3 py-1 md:px-4 md:py-2 rounded-full text-yellow-800 font-semibold text-xs md:text-sm mb-2 md:mb-3">
                      <Star size={14} className="mr-1 md:mr-2 text-yellow-500" />
                      Exclusive Opportunity
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Luxury Rooms as Investment Assets</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}