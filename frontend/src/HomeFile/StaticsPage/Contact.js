import React from "react";
import Header from "../../CoreFile/Header";
import Footer from "../../CoreFile/Footer";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  ChevronRight,
} from "lucide-react";
import { ContactHeroSection } from "./ContactHeroSection";

// Contact Info Card Component
const ContactInfoCard = ({ icon, title, details }) => (
  <div className="flex flex-col items-center p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-yellow-600 mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <div className="text-center text-gray-600">{details}</div>
  </div>
);

// Contact Info Section Component
const ContactInfoSection = () => (
  <div className="py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-base font-semibold text-yellow-600 tracking-wide uppercase">
          Contact Information
        </h2>
        <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
          We’d Love to Hear From You
        </p>
        <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
          Have questions, suggestions, or partnership ideas? Just drop us a
          message. Our team typically responds within 24 hours on business days.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <ContactInfoCard
          icon={<Phone className="h-8 w-8 text-white" />}
          title="Phone Support"
          details={
            <>
              <p className="mb-1">+1 (555) 123-4567</p>
              <p className="text-sm text-gray-500">Mon-Fri: 9AM - 5PM EST</p>
            </>
          }
        />

        <ContactInfoCard
          icon={<Mail className="h-8 w-8 text-white" />}
          title="Email Us"
          details={
            <>
              <p className="mb-1">support@finrain.live</p>
              <p className="text-sm text-gray-500">
                We'll respond within 24 hours
              </p>
            </>
          }
        />

        <ContactInfoCard
          icon={<MapPin className="h-8 w-8 text-white" />}
          title="Our Location"
          details={
            <>
              <p className="mb-1">123 Trading Avenue</p>
              <p className="text-sm text-gray-500">New York, NY 10001</p>
            </>
          }
        />

        <ContactInfoCard
          icon={<Clock className="h-8 w-8 text-white" />}
          title="Business Hours"
          details={
            <>
              <p className="mb-1">Monday - Friday</p>
              <p className="text-sm text-gray-500">9:00 AM - 5:00 PM EST</p>
            </>
          }
        />
      </div>
    </div>
  </div>
);

// Contact Form Component
const ContactForm = () => (
  <div id="contact-form" className="relative py-24 bg-white overflow-hidden">
    {/* Background decorative elements */}
    <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
      <div className="relative h-full text-lg max-w-prose mx-auto">
        <svg
          className="absolute top-12 left-full transform translate-x-32"
          width="404"
          height="384"
          fill="none"
          viewBox="0 0 404 384"
        >
          <defs>
            <pattern
              id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect
                x="0"
                y="0"
                width="4"
                height="4"
                className="text-yellow-100"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width="404"
            height="384"
            fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)"
          />
        </svg>
        <svg
          className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32"
          width="404"
          height="384"
          fill="none"
          viewBox="0 0 404 384"
        >
          <defs>
            <pattern
              id="f210dbf6-a58d-4871-961e-36d5016a0f49"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect
                x="0"
                y="0"
                width="4"
                height="4"
                className="text-purple-100"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width="404"
            height="384"
            fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"
          />
        </svg>
      </div>
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-base font-semibold text-yellow-600 tracking-wide uppercase">
          Contact Form
        </h2>
        <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
          Send Us a Message
        </p>
        <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
          Fill out the form below, and our team will get back to you shortly.
          Please provide as much detail as possible so we can assist you
          effectively.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-yellow-50 to-purple-50 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-8 sm:p-10 lg:p-12">
            <form className="space-y-8">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      autoComplete="given-name"
                      className="py-3 px-4 block w-full shadow-sm focus:ring-yellow-500 focus:border-yellow-500 border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      autoComplete="family-name"
                      className="py-3 px-4 block w-full shadow-sm focus:ring-yellow-500 focus:border-yellow-500 border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="py-3 px-4 block w-full shadow-sm focus:ring-yellow-500 focus:border-yellow-500 border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone{" "}
                    <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      autoComplete="tel"
                      className="py-3 px-4 block w-full shadow-sm focus:ring-yellow-500 focus:border-yellow-500 border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Subject
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      className="py-3 px-4 block w-full shadow-sm focus:ring-yellow-500 focus:border-yellow-500 border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message{" "}
                    <span className="text-gray-400 text-xs">
                      (Max 500 characters)
                    </span>
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-yellow-500 focus:border-yellow-500 border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <button
                  type="submit"
                  className="inline-flex justify-center items-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-full text-white bg-gradient-to-r from-purple-600 to-yellow-600 hover:from-purple-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-300"
                >
                  <span>Send Message</span>
                  <Send className="ml-3 -mr-1 h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main Contact Component
export const Contact = () => {
  return (
    <>
      <Header />
      <ContactHeroSection />
      <ContactInfoSection />
      <ContactForm />
      <Footer />
    </>
  );
};

export default Contact;
