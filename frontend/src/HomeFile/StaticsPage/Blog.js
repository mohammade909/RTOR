import React, { useState } from "react";
import { Blogherosection } from "./Blogherosection";
import Header from "../../CoreFile/Header";
import Footer from "../../CoreFile/Footer";
import { Clock, User, Tag, ChevronRight, Search, ArrowRight } from 'lucide-react';

export const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  

  
  const blogPosts = [
    {
      id: 1,
      title: "How to Build Scalable React Applications in 2025",
      excerpt: "Learn the latest best practices for building scalable and maintainable React applications with modern tools and techniques.",
      imageUrl: "/api/placeholder/800/600",
      category: "Web Development",
      date: "April 10, 2025",
      author: "Sarah Johnson",
      readTime: "8 min read",
      featured: true
    },
    {
      id: 2,
      title: "The Evolution of UI Design: Trends to Watch",
      excerpt: "Explore the newest UI design trends that are shaping the digital landscape and how to implement them in your projects.",
      imageUrl: "/api/placeholder/800/600",
      category: "UI/UX Design",
      date: "April 8, 2025",
      author: "Michael Chen",
      readTime: "6 min read",
      featured: true
    },
    {
      id: 3,
      title: "Mastering Tailwind CSS: Advanced Techniques",
      excerpt: "Take your Tailwind CSS skills to the next level with these advanced techniques and optimization strategies.",
      imageUrl: "/api/placeholder/800/600",
      category: "Web Development",
      date: "April 5, 2025",
      author: "David Rodriguez",
      readTime: "10 min read",
      featured: false
    },
    {
      id: 4,
      title: "SEO Strategies That Actually Work in 2025",
      excerpt: "Discover proven SEO strategies that can help your website rank higher in search engine results pages.",
      imageUrl: "/api/placeholder/800/600",
      category: "Digital Marketing",
      date: "April 3, 2025",
      author: "Emma Wilson",
      readTime: "7 min read",
      featured: false
    },
    {
      id: 5,
      title: "The Impact of AI on Web Development",
      excerpt: "Explore how artificial intelligence is transforming web development and what it means for developers.",
      imageUrl: "/api/placeholder/800/600",
      category: "Technology",
      date: "March 29, 2025",
      author: "James Parker",
      readTime: "9 min read",
      featured: false
    },
    {
      id: 6,
      title: "Creating Accessible Web Applications",
      excerpt: "Learn how to build web applications that are accessible to everyone, including people with disabilities.",
      imageUrl: "/api/placeholder/800/600",
      category: "Web Development",
      date: "March 25, 2025",
      author: "Lisa Thompson",
      readTime: "8 min read",
      featured: false
    }
  ];

  
  const featuredPosts = blogPosts.filter(post => post.featured);
  return (
    <>
    <Header/>
    <Blogherosection/>
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  
        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map(post => (
                <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-2/5">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="md:w-3/5 p-6 flex flex-col justify-between">
                      <div>
                        <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
                          {post.category}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{post.author}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {post.readTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    
        
        {/* All Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative pb-60">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="absolute h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-blue-600">{post.category}</span>
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-500" />
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{post.author}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2">
            <a href="#" className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50">
              Previous
            </a>
            <a href="#" className="px-3 py-2 rounded-md bg-blue-600 text-white">
              1
            </a>
            <a href="#" className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50">
              2
            </a>
            <a href="#" className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50">
              3
            </a>
            <span className="px-3 py-2 text-gray-600">...</span>
            <a href="#" className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50">
              8
            </a>
            <a href="#" className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50">
              Next
            </a>
          </nav>
        </div>
        </div>
        {/* Newsletter Subscription */}
        <div className="mt-20 bg-gradient-to-r from-[#263283] to-[#ed2924] rounded-2xl shadow-xl overflow-hidden">
          <div className=" py-12 md:py-16 ">
            <div className=" mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Stay updated with our newsletter
              </h2>
              <p className="text-blue-100 mb-8 text-lg">
                Get the latest articles, tutorials, and updates delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-5 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 flex-grow max-w-md"
                />
                <button className="bg-white text-blue-600 font-medium px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
     
    </div>
      <Footer/>
    </>
  );
};
