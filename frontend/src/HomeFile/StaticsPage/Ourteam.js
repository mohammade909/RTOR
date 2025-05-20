import React from 'react';
import Header from '../../CoreFile/Header';
import Footer from '../../CoreFile/Footer';
import { Ourteamherosection } from './Ourteamherosection';
import { UserCircle2, Award, BrainCircuit, Target, TrendingUp, Users, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';

export const Ourteam = () => {
  const teamMembers = [
    {
      name: "Lukas Meier, Zürich",
      position: "Founder & CEO",
      image: "/ourteam7.webp",
      bio: "With over 15 years of experience in financial strategy and investment banking.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "#"
      }
    },
    {
      name: "Sophie Baumann, Bern",
      position: "Chief Investment Officer",
      image: "/ourteam2.jpg",
      bio: "Former Wall Street analyst with expertise in market forecasting and portfolio management.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "#"
      }
    },
    {
      name: "Marc Keller, Geneva",
      position: "Head of Operations",
      image: "/ourteam3.jpg",
      bio: "Certified financial planner specializing in retirement and estate planning strategies.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "#"
      }
    },
    {
      name: "Nina Schneider, Lausanne",
      position: "Director of Marketing",
      image: "/ourteam4.webp",
      bio: "Expert in emerging markets and sustainable investment opportunities.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "#"
      }
    },
    {
      name: "Fabian Müller, Basel",
      position: "Lead Tech Architect",
      image: "/ourteam5.webp",
      bio: "Specializes in quantitative analysis and protective investment structures.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "#"
      }
    },
    {
      name: "Tim Schmid, Lucerne ",
      position: "Client Relations Manager",
      image: "/ourteam6.webp",
      bio: "Dedicated to ensuring exceptional client experience and personalized service.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "#"
      }
    },
 
  ];


  return (
    <div className="bg-gray-50">
      <Header />
      <Ourteamherosection />
      
      {/* Team Introduction Section */}
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-br from-yellow-600 to-blue-600 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                <div className="relative">
                  <img 
                    src="/ourteam1.jpg" 
                    alt="Capwise Team" 
                    className="w-full h-auto rounded-lg shadow-xl"
                  />
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-12 h-12 border-t-4 border-l-4 border-yellow-600 opacity-60"></div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-4 border-r-4 border-yellow-600 opacity-60"></div>
                <div className="relative z-10">
                  <h3 className="text-yellow-600 font-bold text-lg mb-3 inline-block px-4 py-1 bg-yellow-100 rounded-full">Our Team</h3>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                    Driven by Expertise,United by Vision
                  </h2>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    Our team is united by one goal—to redefine hotel investment for a globle audience. With decades of combined experience in hospitality, real estate, and financial management, we offer insights that help you invest smartly and confidently. At R2R Globle, every decision is made with the investor’s best interest at heart.
                  </p>
               
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <div className="mb-3 inline-block">
              <span className="bg-yellow-100 text-yellow-600 text-sm font-semibold px-4 py-1 rounded-full">Expert Team</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Meet Our <span className="text-yellow-600">Team</span>
            </h2>
            <div className="w-24 h-1 bg-yellow-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Here are the professionals who lead the mission to make hotel investment accessible, secure, and rewarding for all.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group transform hover:-translate-y-2"

              >
                <div className="relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-72 object-cover object-center transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex space-x-4 justify-center">
                      <a href={member.social.linkedin} className="bg-white/20 hover:bg-yellow-600 p-2 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                      <a href={member.social.twitter} className="bg-white/20 hover:bg-yellow-400 p-2 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                      <a href={member.social.email} className="bg-white/20 hover:bg-red-500 p-2 rounded-full transition-colors">
                        <Mail className="w-5 h-5 text-white" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-yellow-100  text-xs bg-blue-600 py-1 px-2 rounded-full ">
                    {member.position}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1 mt-2">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 text-xs text-justify">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials Section - New Addition */}
      {/* <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <div className="mb-3 inline-block">
              <span className="bg-yellow-100 text-yellow-600 text-sm font-semibold px-4 py-1 rounded-full">Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              What Our <span className="text-yellow-600">Clients</span> Say
            </h2>
            <div className="w-24 h-1 bg-yellow-600 mx-auto mb-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg relative">
              <div className="absolute -top-4 -left-4 text-yellow-600 text-6xl opacity-20">"</div>
              <div className="relative z-10">
                <p className="text-gray-600 mb-6 italic">
                  I started small with R2R Globle, and now I’m earning consistent income every month. The transparency and simplicity of the platform are top-notch!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-bold">AT</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Amit T., India</h4>
                    <p className="text-gray-500 text-sm">Retirement Client</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg relative">
              <div className="absolute -top-4 -left-4 text-yellow-600 text-6xl opacity-20">"</div>
              <div className="relative z-10">
                <p className="text-gray-600 mb-6 italic">
                   I’ve tried other platforms before, but none matched the professionalism and real results I got with R2R Globle. Highly recommended!
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-bold">SL</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Samantha L., UK</h4>
                    <p className="text-gray-500 text-sm">Business Owner</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg relative">
              <div className="absolute -top-4 -left-4 text-yellow-600 text-6xl opacity-20">"</div>
              <div className="relative z-10">
                <p className="text-gray-600 mb-6 italic">
                  The team at R2R Globle made investing easy and stress-free. It feels great to be earning from real hotels without any management hassle.
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-bold">JM</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">John M., USA</h4>
                    <p className="text-gray-500 text-sm">Individual Investor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <Footer />
    </div>
  );
};