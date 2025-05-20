import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaTelegram, FaYoutube } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { GiPositionMarker } from "react-icons/gi";
import { motion } from "framer-motion";
import { useState } from "react";
 
const usefulLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about-us" },
  { name: "Services", href: "/services" },
  { name: "Contact us", href: "/contact-us" },
 
];
 
const ourServices = [
  { name: "Privacy", href: "/privacy" },
  { name: "Terms & Conditions", href: "/terms" },
   { name: "Our Team", href: "/Ourteam" },
  { name: "FAQ", href: "/" },
];
 
const contactDetails = [
  {
    icon: <MdEmail className="w-6 h-6" />,
    text: (
      <a href="mailto:info@globle.com" className="hover:text-yellow-400 transition-colors">
        info@r2rgloble.com
      </a>
    ),
  },
  // {
  //   icon: <IoIosCall className="w-6 h-6" />,
  //   text: (
  //     <a href="tel:+1234567890" className="hover:text-yellow-400 transition-colors">
  //       +16462254510
  //     </a>
  //   ),
  // },
  {
    icon: <GiPositionMarker className="w-6 h-6" />,
    text: (
      <span className="hover:text-yellow-400 transition-colors">
       Weberstrasse 11, 8004 Zurich (Switzerland)
      </span>
    ),
  },
];
 
const socialLinks = [
  { icon: <FaFacebookF className="w-5 h-5" />, href: "https://www.facebook.com/profile.php?id=61575942577722" },
  { icon: <FaTwitter className="w-5 h-5" />, href: "https://x.com/r2rgloble" },
  { icon: <FaInstagram className="w-5 h-5" />, href: "https://www.instagram.com/r2rgloble/" },
  { icon: <FaTelegram className="w-5 h-5" />, href: "https://t.me/r2rgloble" },
  { icon: <FaYoutube className="w-5 h-5" />, href: "https://www.youtube.com/@R2RGloble" },
];
 
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};
 
const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
 
export default function Footer() {
  const [email, setEmail] = useState("");
 
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with ${email}`);
    setEmail("");
  };
 
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      {/* Gold decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-yellow-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-yellow-600/10 rounded-full filter blur-3xl"></div>
      </div>
 
      {/* Animated floating elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-yellow-600/5 to-yellow-500/5"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              transition: {
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }
            }}
          />
        ))}
      </div>
 
      <div className="relative px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid gap-12 lg:grid-cols-4"
        >
          {/* Company Info */}
          <motion.div variants={fadeIn} className="space-y-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center w-56"
            >
              <Link to="/">
                 <img
                  alt="R2R globle Logo"
                   src="/r2rblue.png"
                  className="w-auto h-20"
                 />
              </Link>
            </motion.div>
            <p className="text-lg leading-relaxed text-gray-300">
              R2R Globle — Your Trusted Partner in Hotel Investments. Invest smart, earn daily, and grow with confidence.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white/5 hover:bg-yellow-600/30 backdrop-blur-sm transition-all duration-300"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
 
          {/* Useful Links */}
          <motion.div variants={fadeIn}>
            <h3 className="mb-8 text-xl font-semibold tracking-wider text-yellow-500">Quick Links</h3>
            <ul className="space-y-4">
              {usefulLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={link.href}
                    className="text-lg transition-colors hover:text-yellow-400 hover:underline"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
 
          {/* Our Services */}
          <motion.div variants={fadeIn}>
            <h3 className="mb-8 text-xl font-semibold tracking-wider text-yellow-500">Information</h3>
            <ul className="space-y-4">
              {ourServices.map((service, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={service.href}
                    className="text-lg transition-colors hover:text-yellow-400 hover:underline"
                  >
                    {service.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
 
          {/* Contact & Newsletter */}
          <motion.div variants={fadeIn} className="space-y-8">
            <div>
              <h3 className="mb-6 text-xl font-semibold tracking-wider text-yellow-500">Contact Us</h3>
              <ul className="space-y-4">
                {contactDetails.map((contact, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-4 text-lg"
                    whileHover={{ x: 5 }}
                  >
                    <span className="mt-1 text-yellow-500">
                      {contact.icon}
                    </span>
                    {contact.text}
                  </motion.li>
                ))}
              </ul>
            </div>
 
            <div>
              <h3 className="mb-6 text-xl font-semibold tracking-wider text-yellow-500">Stay Updated</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div whileHover={{ scale: 1.01 }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full px-5 py-3 text-lg bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  />
                </motion.div>
                <motion.button
                  type="submit"
                  className="px-8 py-3 text-lg font-medium text-gray-900 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all"
                  whileHover={{
                    y: -3,
                    boxShadow: "0 10px 25px rgba(234, 179, 8, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
 
      {/* Footer Bottom */}
      <motion.div
        className="relative py-8 border-t border-white/20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container flex flex-col items-center justify-between px-4 mx-auto sm:px-6 lg:px-8 md:flex-row">
          <p className="text-base text-white/70">
            © {new Date().getFullYear()} Luxury Hotel Investments. All rights reserved.
          </p>
          <div className="flex gap-8 mt-6 md:mt-0">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/terms"
                className="text-base text-white/70 hover:text-yellow-400 transition-colors"
              >
                Terms of Service
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/privacy"
                className="text-base text-white/70 hover:text-yellow-400 transition-colors"
              >
                Privacy Policy
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}