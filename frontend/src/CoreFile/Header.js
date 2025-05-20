import { useState, useEffect } from "react";
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={` fixed  w-full top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white text-black backdrop-blur-md shadow-lg py-1  "
            : "bg-transparent py-2 text-white"
        }`}
      >
        <nav
          aria-label="Globle"
          className="mx-auto flex  justify-between items-center py-3 max-w-7xl  lg:px-4 px-5"
        >
          {/* Logo */}
          <div className="flex item-center  gap-20">
            <div className="flex justify-center ">
              <Link
                to="/"
                className="flex items-center space-x-2 transition duration-300 ease-in-out hover:opacity-80"
              >
                <div className="">
                  <img
                    alt="R2r"
                    src="/logo.png"
                    className="h-auto w-20  bg-transparent items-center  flex "
                  />
                </div>
              </Link>
            </div>
          </div>
          <PopoverGroup className="hidden justify-center lg:flex lg:gap-x-8 lg:items-center">
            <Link
              to="/"
              className="text-base  
            transition duration-300 ease-in-out"
            >
              Home
            </Link>
            <Link
              to="/about-us"
              className="text-base  
            transition duration-300 ease-in-out"
            >
              About Us
            </Link>

            <Link
              to="/services"
              className="text-base  
            transition duration-300 ease-in-out"
            >
              Service
            </Link>
            <Link
              to="/contact-us"
              className="text-base  
            transition duration-300 ease-in-out"
            >
              Contact
            </Link>
          </PopoverGroup>
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center rounded-full p-2
              text-gray-600 bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200
              hover:bg-indigo-50  transition duration-300 ease-in-out"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-5" />
            </button>
          </div>

          {/* Desktop navigation */}

          {/* Login buttons */}
          <div className="hidden lg:flex  lg:justify-end lg:gap-x-4 lg:items-center">
            <Link
              to="/user/login"
              className="text-base font-mediumtext-gray-600  
            transition duration-300 ease-in-out"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="inline-flex rounded-xl items-center justify-center  bg-gray-200
            px-4 py-2 text-base text-yellow-500 font-semibold shadow-sm hover:shadow-lg hover:text-gray-600
            "
            >
              Signup
            </Link>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50">
            <div className=" inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gradient-to-r from-gray-400 to-yellow-600 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
              <div className="flex items-center justify-between px-6 py-6">
                <Link to="/" className="flex items-center space-x-2">
                  <div className="  ">
                    <img alt="R2r" src="/logo.png" className="h-auto w-20" />
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full p-2 text-gray-600 bg-gray-100 hover:bg-gray-200"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="size-5" aria-hidden="true" />
                </button>
              </div>
              <div className=" text-white px-6 py-4">
                <Link
                  to="/"
                  className="text-base  
            transition duration-300 ease-in-out"
                >
                  Home
                </Link>
                <div className="py-4">
                  <Link
                    to="/about-us"
                    className="text-base  
            transition duration-300 ease-in-out"
                  >
                    About Us
                  </Link>

                  {/* <div className="space-y-1">
                    <a
                      href="/Blogs"
                      className="text-base  
            transition duration-300 ease-in-out"
                    >
                      Blogs
                    </a>
                  </div> */}
                </div>
                <div className="">
                  <div className="space-y-4">
                    {/* <a
                      href="/Career"
                      className="text-base  
            transition duration-300 ease-in-out"
                    >
                      Career
                    </a> */}

                    {/* {company.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block py-2 text-base text-gray-100 "
                      >
                        {item.name}
                      </a>
                    ))} */}
                  </div>
                  <div className="space-y-4 flex flex-col">
                    <Link
                      to="/services"
                      className="text-base  
            transition duration-300 ease-in-out"
                    >
                      Service
                    </Link>
                    <Link
                      to="/contact-us"
                      className="text-base  
            transition duration-300 ease-in-out"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
                <div className="py-6 space-y-4">
                  <Link
                    to="/user/login"
                    className="block text-center w-full rounded-md bg-white px-3 py-2 text-base
                    text-red-600 hover:bg-indigo-50 border border-red-600 shadow-sm"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="block text-center w-full rounded-md bg-gradient-to-r from-yellow-600 to-yellow-700
                    px-3 py-2.5 text-base text-white shadow-sm hover:from-orange-500 hover:to-yellow-800"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
