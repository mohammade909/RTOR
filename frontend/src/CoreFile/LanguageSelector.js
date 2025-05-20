import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { IoLanguage } from "react-icons/io5";

const LanguageSelector = () => {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element"
        );

        setTimeout(() => {
          /** Remove unwanted Google text & branding */
          const googleText = document.querySelector(".goog-te-gadget");

          if (googleText) {
            googleText.childNodes.forEach((node) => {
              if (node.nodeType === 3) {
                node.nodeValue = ""; // Remove text nodes
              }
            });
          }
        }, 1000);
      };
    };

    if (!window.google || !window.google.translate) {
      addGoogleTranslateScript();
    } else {
      window.googleTranslateElementInit();
    }
  }, []);

  return (
    <div className="items-center gap-4 flex lg:justify-end relative">
      <div className="lg:flex lg:items-center relative">
        <button
          onClick={() => setLanguageOpen(!languageOpen)}
          className="flex items-center gap-2 bg-gray-100 p-2 rounded-md border cursor-pointer"
        >
          <IoLanguage className="text-gray-700 w-5 h-5" />
          <span className="text-sm font-medium text-gray-800">
            {selectedLanguage}
          </span>
        </button>
        {languageOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border rounded-md p-2 w-32">
            <div id="google_translate_element"></div>
          </div>
        )}
      </div>
      <style>
        {`
          .goog-te-banner-frame { display: none !important; }
          .goog-te-gadget img { display: none !important; }
          .goog-te-gadget span, .goog-text-highlight { display: none !important; }
          .goog-te-combo {
            background: black;
            border: 1px solid #ccc;
            padding: 8px 4px;
            font-size: 12px;
            color: white;
            border-radius: 5px;
            width: 140px;
          }
          .goog-logo-link, 
          .goog-te-gadget .goog-te-gadget-simple, 
          .goog-te-gadget .goog-te-gadget-simple span { 
            display: none !important; 
          }
          .goog-te-banner-frame.skiptranslate { display: none !important; }
        `}
      </style>
      <Link to="/user/login" className="hidden gap-4 lg:flex lg:justify-end">
        <button className="bg-yellow-400 text-white p-1 rounded-full flex items-center gap-2">
          <span className="bg-green-800 text-sm px-8 py-2 rounded-full">Log in</span>
          <div className="bg-white rounded-full p-2">
            <AiOutlineArrowRight className="w-4 h-4 text-green-600" />
          </div>
        </button>
      </Link>
      <div className="flex lg:hidden">
        <button
          type="button"
          onClick={() => setLanguageOpen(false)}
          className="-m-2.5 inline-flex items-center justify-end rounded-md p-2.5 text-gray-400"
        >
          <span className="sr-only">Open main menu</span>
          <Bars3Icon className="w-6 h-6" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
