// import React, { useState, useEffect } from 'react';
// import { Clock, MessageCircle, ChevronRight, BookOpen, Heart, Share2, Bookmark, Link } from 'lucide-react';

// export default function Blogs() {
//   const [hoveredId, setHoveredId] = useState(null);
//   const [activeCategory, setActiveCategory] = useState('All');
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [currentSlide, setCurrentSlide] = useState(0);
  
//   const categories = ['All', 'Travel Tips', 'Investment', 'Hotel Reviews', 'Destinations'];

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 100);
//     };
    
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);
  
//   useEffect(() => {
//     // Auto slide functionality
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev === sliderItems.length - 1 ? 0 : prev + 1));
//     }, 5000);
    
//     return () => clearInterval(interval);
//   }, []);
  
//   const sliderItems = [
//     {
//       id: 1,
//       title: "Ready to Turn Your Money into Daily Income?",
//       description: "Join thousands of global investors earning steady returns from real hotel properties. With R2R Globle, your path to financial growth is secure, simple, and fully managed.",
//       image: "/blog1.avif",
//       ctaText: "Start Earning Today"
//     },
//     {
//       id: 2,
//       title: " Your Income Journey Begins Here",
//       description: " Turn everyday hotel bookings into daily income with R2R Globle. Join a growing network of global investors and start building your passive income—securely and smartly.",
//       image: "/blog2.avif",
//       ctaText: "Get Started Today"
//     },
//     {
//       id: 3,
//       title: " Invest Small, Earn Big",
//       description: " With R2R Globle, you can begin with as little as $100 and grow your income through real hotel revenue. Invest smart, track your earnings, and enjoy monthly returns—automatically.",
//       image: "/blog3.avif",
//       ctaText: "Start Investing"
//     }
//   ];

//   const blogPosts = [
//     {
//       id: 1,
//       title: '5 Tips for Booking the Perfect Hotel Stay',
//       description: 'Discover essential tips for booking your next hotel stay, including choosing the best location, reading reviews, and more.',
//       image: '/blog4.avif',
//       category: 'Travel Tips',
//       time: 'April 15, 2025',
//       comments: 10,
//       readTime: '5 min read',
//       featured: true
//     },
//     {
//       id: 2,
//       title: 'How to Maximize Your Hotel Investment for Passive Income',
//       description: 'Learn how to turn your property into a profitable venture by renting it out to travelers and earning steady returns.',
//       image: '/blog5.avif',
//       category: 'Investment',
//       time: 'April 12, 2025',
//       comments: 8,
//       readTime: '8 min read',
//       featured: false
//     },
//     {
//       id: 3,
//       title: 'The Benefits of Staying in Boutique Hotels vs. Big Chains',
//       description: 'Explore the unique advantages of boutique hotels and how they offer a more personalized experience compared to larger hotel chains.',
//       image: '/blog6.avif',
//       category: 'Hotel Reviews',
//       time: 'April 9, 2025',
//       comments: 15,
//       readTime: '6 min read',
//       featured: false
//     },
//     {
//       id: 4,
//       title: 'Unforgettable Island Destinations for Your Next Vacation',
//       description: 'Discover the most beautiful islands around the world that offer pristine beaches, crystal-clear waters, and unforgettable experiences.',
//       image: '/blog7.avif',
//       category: 'Destinations',
//       time: 'April 5, 2025',
//       comments: 21,
//       readTime: '7 min read',
//       featured: false
//     },
//   ];

//   const filteredPosts = activeCategory === 'All' 
//     ? blogPosts 
//     : blogPosts.filter(post => post.category === activeCategory);

//   return (
//     <div className="relative px-5 md:px-0 bg-gradient-to-br from-orange-50 via-blue-50 to-pink-50 lg:py-28 py-10 text-gray-800 lg:min-h-screen">


//       <div className="max-w-7xl mx-auto  md:px-10 lg:px-12 relative z-10">
//         {/* Hero Slider with creative padding and design */}
//         <div className="mb-20 relative overflow-hidden rounded-3xl shadow-2xl">
//           <div className="relative h-96 md:h-[32rem] bg-gray-900">
//             {/* Slider content */}
//             <div className="relative h-full overflow-hidden">
//               {sliderItems.map((item, index) => (
//                 <div
//                   key={item.id}
//                   className={`absolute inset-0 transition-opacity duration-1000 ${
//                     currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
//                   }`}
//                 >
//                   {/* Background image with overlay */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-gray-900/30 z-10"></div>
//                   <div 
//                     className="absolute inset-0 bg-cover bg-center"
//                     style={{ backgroundImage: `url(${item.image})` }}
//                   ></div>
                  
//                   {/* Content */}
//                   <div className="absolute px-4 inset-0 z-20 flex items-center">
//                     <div className="w-full md:w-3/5 lg:w-1/2 md:px-16 lg:px-20">
//                       <div className={`transform transition-all duration-1000 delay-300 ${
//                         currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
//                       }`}>
//                         <span className="inline-block px-6 py-2 bg-orange-500 text-white rounded-full text-sm font-medium mb-6 transform -rotate-1">
//                           Featured
//                         </span>
//                         <h2 className="sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-6 leading-tight">
//                           {item.title}
//                         </h2>
//                         <p className="sm:text-lg text-base md:text-lg text-gray-200 mb-10">
//                           {item.description}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             {/* Slider navigation */}
//             <div className="absolute bottom-8 left-0 right-0 flex justify-center z-30 space-x-3">
//               {sliderItems.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentSlide(index)}
//                   className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                     currentSlide === index
//                       ? 'bg-white w-8'
//                       : 'bg-white/50 hover:bg-white/70'
//                   }`}
//                   aria-label={`Go to slide ${index + 1}`}
//                 ></button>
//               ))}
//             </div>
            
//             {/* Slider controls */}
//             <div className="absolute inset-y-0 sm:left-4 left-0 flex items-center z-30">
//               <button
//                 onClick={() => setCurrentSlide(prev => (prev === 0 ? sliderItems.length - 1 : prev - 1))}
//                 className="sm:w-12 sm:h-12 w-6 h-6 flex items-center justify-center bg-black/20 backdrop-blur-sm text-white rounded-full hover:bg-black/30 transition-all"
//                 aria-label="Previous slide"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>
//             </div>
//             <div className="absolute inset-y-0 sm:right-4 right-0 flex items-center z-30">
//               <button
//                 onClick={() => setCurrentSlide(prev => (prev === sliderItems.length - 1 ? 0 : prev + 1))}
//                 className="sm:w-12 w-6 sm:h-12 h-6 flex items-center justify-center bg-black/20 backdrop-blur-sm text-white rounded-full hover:bg-black/30 transition-all"
//                 aria-label="Next slide"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>
            
//             {/* Decorative elements */}
       
//           </div>
//         </div>
        
//         {/* Category navigation with asymmetric padding */}
        

//         {/* Blog slider section */}
//         <div className="lg:mb-24 relative">
//           <div className="flex justify-between items-center mb-10">
//             <h2 className="text-3xl font-bold text-gray-800">
//               <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-blue-600">
//                 Trending Articles
//               </span>
//             </h2>
//             <div className="flex space-x-2">
//               <button 
//                 onClick={() => {
//                   const slider = document.getElementById('blog-slider');
//                   slider.scrollBy({ left: -slider.offsetWidth, behavior: 'smooth' });
//                 }}
//                 className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-orange-50 transition-colors"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>
//               <button 
//                 onClick={() => {
//                   const slider = document.getElementById('blog-slider');
//                   slider.scrollBy({ left: slider.offsetWidth, behavior: 'smooth' });
//                 }}
//                 className="w-10 h-10 rounded-full bg-orange-500 shadow-md flex items-center justify-center hover:bg-orange-600 transition-colors"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           {/* Blog posts slider */}
//           <div 
//             id="blog-slider" 
//             className="flex space-x-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide scroll-smooth"
//             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//           >
//             {blogPosts.map((post, index) => (
//               <div 
//                 key={post.id}
//                 className="min-w-[320px] md:min-w-[380px] snap-start bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-all duration-300"
//               >
//                 <div className="relative h-52 overflow-hidden">
//                   <img 
//                     src={post.image} 
//                     alt={post.title}
//                     className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
//                   <div className="absolute top-4 left-4">
//                     <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-orange-600 rounded-full text-xs font-semibold">
//                       {post.category}
//                     </span>
//                   </div>
//                   <div className="absolute bottom-4 left-4 right-4">
//                     <div className="flex items-center justify-between text-white text-xs">
//                       <div className="flex items-center">
//                         <Clock size={12} className="mr-1" />
//                         {post.time}
//                       </div>
//                       <div className="flex items-center">
//                         <BookOpen size={12} className="mr-1" />
//                         {post.readTime}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="p-6 flex-1 flex flex-col">
//                   <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 hover:text-orange-600 transition-colors">
//                     {post.title}
//                   </h3>
//                   <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
//                     {post.description}
//                   </p>
//                   <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
//                     <div className="flex items-center text-gray-500 text-xs">
//                       <MessageCircle size={12} className="text-blue-500 mr-1" />
//                       <span>{post.comments} comments</span>
//                     </div>
//                     <button className="text-orange-600 text-sm font-medium flex items-center hover:text-blue-600 transition-colors">
//                       Read 
//                       <ChevronRight size={16} className="ml-1" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
            
//             {/* Add a few duplicate posts to ensure sufficient scrolling content */}
//             {blogPosts.map((post, index) => (
//               <div 
//                 key={`duplicate-${post.id}-${index}`}
//                 className="min-w-[320px] md:min-w-[380px] snap-start bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-all duration-300"
//               >
//                 <div className="relative h-52 overflow-hidden">
//                   <img 
//                     src={post.image} 
//                     alt={post.title}
//                     className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
//                   <div className="absolute top-4 left-4">
//                     <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-orange-600 rounded-full text-xs font-semibold">
//                       {post.category}
//                     </span>
//                   </div>
//                   <div className="absolute bottom-4 left-4 right-4">
//                     <div className="flex items-center justify-between text-white text-xs">
//                       <div className="flex items-center">
//                         <Clock size={12} className="mr-1" />
//                         {post.time}
//                       </div>
//                       <div className="flex items-center">
//                         <BookOpen size={12} className="mr-1" />
//                         {post.readTime}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="p-6 flex-1 flex flex-col">
//                   <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 hover:text-orange-600 transition-colors">
//                     {post.title}
//                   </h3>
//                   <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
//                     {post.description}
//                   </p>
//                   <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
//                     <div className="flex items-center text-gray-500 text-xs">
//                       <MessageCircle size={12} className="text-blue-500 mr-1" />
//                       <span>{post.comments} comments</span>
//                     </div>
//                     <button className="text-orange-600 text-sm font-medium flex items-center hover:text-blue-600 transition-colors">
//                       Read 
//                       <ChevronRight size={16} className="ml-1" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           {/* Slider progress indicator */}
//           <div className="w-full h-1 bg-gray-100 rounded-full mt-4 overflow-hidden">
//             <div 
//               className="h-full bg-gradient-to-r from-orange-500 to-blue-500 w-1/3 rounded-full"
//               style={{
//                 transition: 'transform 0.3s ease-out',
//                 transform: `translateX(${currentSlide * 33}%)`
//               }}
//             ></div>
//           </div>
//         </div>


//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from 'react';
import { Clock, MessageCircle, ChevronRight, BookOpen, Heart, Share2, Bookmark, Link } from 'lucide-react';

export default function Blogs() {
  const [hoveredId, setHoveredId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const categories = ['All', 'Travel Tips', 'Investment', 'Hotel Reviews', 'Destinations'];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Auto slide functionality
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === sliderItems.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const sliderItems = [
    {
      id: 1,
      title: "Ready to Turn Your Money into Daily Income?",
      description: "Join thousands of globle investors earning steady returns from real hotel properties. With R2R Globle, your path to financial growth is secure, simple, and fully managed.",
      image: "/blog1.avif",
      ctaText: "Start Earning Today"
    },
    {
      id: 2,
      title: "Your Income Journey Begins Here",
      description: "Turn everyday hotel bookings into daily income with R2R Globle. Join a growing network of globle investors and start building your passive income—securely and smartly.",
      image: "/blog2.avif",
      ctaText: "Get Started Today"
    },
    {
      id: 3,
      title: "Invest Small, Earn Big",
      description: "With R2R Globle, you can begin with as little as $100 and grow your income through real hotel revenue. Invest smart, track your earnings, and enjoy monthly returns—automatically.",
      image: "/blog3.avif",
      ctaText: "Start Investing"
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: '5 Tips for Booking the Perfect Hotel Stay',
      description: 'Discover essential tips for booking your next hotel stay, including choosing the best location, reading reviews, and more.',
      image: '/blog4.avif',
      category: 'Travel Tips',
      time: 'April 15, 2025',
      comments: 10,
      readTime: '5 min read',
      featured: true
    },
    {
      id: 2,
      title: 'How to Maximize Your Hotel Investment for Passive Income',
      description: 'Learn how to turn your property into a profitable venture by renting it out to travelers and earning steady returns.',
      image: '/blog5.avif',
      category: 'Investment',
      time: 'April 12, 2025',
      comments: 8,
      readTime: '8 min read',
      featured: false
    },
    {
      id: 3,
      title: 'The Benefits of Staying in Boutique Hotels vs. Big Chains',
      description: 'Explore the unique advantages of boutique hotels and how they offer a more personalized experience compared to larger hotel chains.',
      image: '/blog6.avif',
      category: 'Hotel Reviews',
      time: 'April 9, 2025',
      comments: 15,
      readTime: '6 min read',
      featured: false
    },
    {
      id: 4,
      title: 'Unforgettable Island Destinations for Your Next Vacation',
      description: 'Discover the most beautiful islands around the world that offer pristine beaches, crystal-clear waters, and unforgettable experiences.',
      image: '/blog7.avif',
      category: 'Destinations',
      time: 'April 5, 2025',
      comments: 21,
      readTime: '7 min read',
      featured: false
    },
  ];

  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <div className="relative w-full bg-gradient-to-br from-orange-50 via-blue-50 to-pink-50 py-6 sm:py-8 md:py-12 lg:py-20 text-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 relative z-10">
        {/* Category navigation with responsive styling */}
        <div className="flex flex-wrap items-center justify-center mb-8 md:mb-12 overflow-x-auto whitespace-nowrap py-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 mx-1 my-1 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-orange-500 text-white shadow-md transform scale-105'
                  : 'bg-white hover:bg-gray-100 text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Hero Slider with responsive design */}
        <div className="mb-10 sm:mb-16 md:mb-20 relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl">
          <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[32rem] bg-gray-900">
            {/* Slider content */}
            <div className="relative h-full overflow-hidden">
              {sliderItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  {/* Background image with overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-gray-900/30 z-10"></div>
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                  ></div>
                  
                  {/* Content with improved responsiveness */}
                  <div className="absolute inset-0 z-20 flex items-center">
                    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 md:w-4/5 lg:w-3/5 xl:w-1/2">
                      <div className={`transform transition-all duration-1000 delay-300 ${
                        currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                      }`}>
                        <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 bg-orange-500 text-white rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4 md:mb-6 transform -rotate-1">
                          Featured
                        </span>
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 lg:mb-6 leading-tight">
                          {item.title}
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-4 sm:mb-6 md:mb-8 lg:mb-10 max-w-xl">
                          {item.description}
                        </p>
                        <button className="hidden sm:inline-block px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg text-sm transition-colors">
                          {item.ctaText}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Slider navigation - improved responsiveness */}
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 flex justify-center z-30 space-x-2 sm:space-x-3">
              {sliderItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? 'bg-white w-6 sm:w-8'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
            
            {/* Slider controls with responsive sizing */}
            <div className="absolute inset-y-0 left-1 sm:left-2 md:left-4 flex items-center z-30">
              <button
                onClick={() => setCurrentSlide(prev => (prev === 0 ? sliderItems.length - 1 : prev - 1))}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/20 backdrop-blur-sm text-white rounded-full hover:bg-black/30 transition-all"
                aria-label="Previous slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="absolute inset-y-0 right-1 sm:right-2 md:right-4 flex items-center z-30">
              <button
                onClick={() => setCurrentSlide(prev => (prev === sliderItems.length - 1 ? 0 : prev + 1))}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/20 backdrop-blur-sm text-white rounded-full hover:bg-black/30 transition-all"
                aria-label="Next slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Blog slider section with improved responsiveness */}
        <div className="mb-12 md:mb-16 lg:mb-24 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-blue-600">
                Trending Articles
              </span>
            </h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  const slider = document.getElementById('blog-slider');
                  slider.scrollBy({ left: -slider.offsetWidth, behavior: 'smooth' });
                }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-orange-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => {
                  const slider = document.getElementById('blog-slider');
                  slider.scrollBy({ left: slider.offsetWidth, behavior: 'smooth' });
                }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-500 shadow-md flex items-center justify-center hover:bg-orange-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Blog posts slider with improved responsiveness */}
          <div 
            id="blog-slider" 
            className="flex space-x-3 sm:space-x-4 md:space-x-6 overflow-x-auto pb-6 sm:pb-8 snap-x snap-mandatory scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {blogPosts.map((post) => (
              <div 
                key={post.id}
                className="min-w-[260px] sm:min-w-[300px] md:min-w-[320px] lg:min-w-[380px] snap-start bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative h-40 sm:h-44 md:h-48 lg:h-52 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <span className="px-2 sm:px-3 py-1 bg-white/90 backdrop-blur-sm text-orange-600 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                    <div className="flex items-center justify-between text-white text-xs">
                      <div className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        {post.time}
                      </div>
                      <div className="flex items-center">
                        <BookOpen size={12} className="mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3 line-clamp-2 hover:text-orange-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 flex-1">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 text-xs">
                      <MessageCircle size={12} className="text-blue-500 mr-1" />
                      <span>{post.comments} comments</span>
                    </div>
                    <button className="text-orange-600 text-xs sm:text-sm font-medium flex items-center hover:text-blue-600 transition-colors">
                      Read 
                      <ChevronRight size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add a few duplicate posts to ensure sufficient scrolling content */}
            {blogPosts.map((post, index) => (
              <div 
                key={`duplicate-${post.id}-${index}`}
                className="min-w-[260px] sm:min-w-[300px] md:min-w-[320px] lg:min-w-[380px] snap-start bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative h-40 sm:h-44 md:h-48 lg:h-52 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <span className="px-2 sm:px-3 py-1 bg-white/90 backdrop-blur-sm text-orange-600 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                    <div className="flex items-center justify-between text-white text-xs">
                      <div className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        {post.time}
                      </div>
                      <div className="flex items-center">
                        <BookOpen size={12} className="mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3 line-clamp-2 hover:text-orange-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 flex-1">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 text-xs">
                      <MessageCircle size={12} className="text-blue-500 mr-1" />
                      <span>{post.comments} comments</span>
                    </div>
                    <button className="text-orange-600 text-xs sm:text-sm font-medium flex items-center hover:text-blue-600 transition-colors">
                      Read 
                      <ChevronRight size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Slider progress indicator */}
          <div className="w-full h-1 bg-gray-100 rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-blue-500 w-1/3 rounded-full"
              style={{
                transition: 'transform 0.3s ease-out',
                transform: `translateX(${currentSlide * 33}%)`
              }}
            ></div>
          </div>
        </div>

        {/* Featured posts grid with responsive design */}
        <div className="mt-10 sm:mt-16 mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-orange-600">
              Explore Latest Posts
            </span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {filteredPosts.map((post) => (
              <div 
                key={`grid-${post.id}`}
                onMouseEnter={() => setHoveredId(post.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60"></div>
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-orange-600 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center text-white/80 text-xs">
                      <Clock size={12} className="mr-1" />
                      <span className="mr-3">{post.time}</span>
                      <BookOpen size={12} className="mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  {/* Hover overlay */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-t from-orange-600/90 to-blue-600/90 flex items-center justify-center transition-opacity duration-300 ${
                      hoveredId === post.id ? 'opacity-80' : 'opacity-0'
                    }`}
                  >
                    <button className="px-5 py-2 bg-white text-orange-600 rounded-lg font-medium transform -translate-y-2 transition-all duration-300">
                      Read Article
                    </button>
                  </div>
                </div>
                
                <div className="p-4 sm:p-5">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <button className="text-gray-500 hover:text-red-500 transition-colors">
                        <Heart size={16} />
                      </button>
                      <button className="text-gray-500 hover:text-blue-500 transition-colors">
                        <Share2 size={16} />
                      </button>
                      <button className="text-gray-500 hover:text-orange-500 transition-colors">
                        <Bookmark size={16} />
                      </button>
                    </div>
                    <div className="flex items-center text-gray-500 text-xs">
                      <MessageCircle size={14} className="text-blue-500 mr-1" />
                      <span>{post.comments} comments</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Newsletter subscription - responsive design */}
        <div className="my-12 sm:my-16 md:my-20 bg-gradient-to-r from-blue-600 to-orange-500 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-sm sm:text-base text-white/80 mb-6 sm:mb-8">
              Stay updated with the latest travel tips, investment opportunities, and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row items-center max-w-md mx-auto sm:space-x-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-3 rounded-lg mb-3 sm:mb-0 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="w-full sm:w-auto px-6 py-3 bg-white text-orange-600 font-medium rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}