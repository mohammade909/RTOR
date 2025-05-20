import React, { useEffect, useState, useRef } from "react";
import { AiOutlineGlobal } from "react-icons/ai"; 
import Spinner from "../BaseFile/comman/Spinner";

export const LanguageButton = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isScriptLoaded) return;

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: false },
        "google_translate_element"
      );

      setTimeout(() => {
        const translateDropdown = document.querySelector(".goog-te-combo");
        if (translateDropdown) {
          translateDropdown.style.display = "block";
        }
        setIsLoading(false); 
      }, 1500);
    };

    setIsScriptLoaded(true);
  }, [isScriptLoaded]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="relative flex justify-center items-center" ref={dropdownRef}>
      <button
        className="p-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition duration-300"
        onClick={toggleDropdown}
      >
        <AiOutlineGlobal className="w-6 h-6" />
      </button>

      <div
        id="google_translate_element"
        className={`absolute top-12 lg:left-0 bg-yellow-500 flex justify-between shadow-sm px-1 rounded-md ${
          showDropdown ? "block" : "hidden"
        }`}
      >
        {isLoading ? (
          <Spinner/>
        ) : null}
      </div>

      <style>
        {`
          .goog-te-banner-frame { display: none !important; }
          .goog-te-gadget img { display: none !important; }
          .goog-te-gadget span, .goog-text-highlight { display: none !important; }
          .goog-te-gadget-simple span { display: none !important; }
          .goog-te-banner-frame.skiptranslate { display: none !important; }

          /* Hide "Powered by Google Translate" */
          .goog-logo-link,
          .goog-te-gadget span,
          .goog-text-highlight,
          #google_translate_element a {
            display: none !important;
          }

          /* Hide the entire footer of the translate widget */
          .goog-te-gadget {
            color: transparent !important;
            font-size: 0px !important;
          }

          /* Dropdown Styling */
          .goog-te-combo {
            display: block !important;
            width: 150px !important;
            height: 35px !important;
            font-size: 14px;
            font-weight: semibold;
            cursor: pointer;
            border-radius: 4px !important;
            border: none;
            background: green;
            backdrop-filter: blur(10px);
            color: white;
            transition: all 0.3s ease-in-out;
            outline: none;
            position: relative;
          }

          /* Hover Effects */
          .goog-te-combo:hover {
            transform: translateY(-2px);
          }
        `}
      </style>
    </div>
  );
};
