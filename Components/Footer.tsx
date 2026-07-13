import React from "react";
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto gap-4">
        {/* Branding and Social */}
        <div className="flex flex-row gap-2.5 items-center group">
          <img
            src={`${import.meta.env.BASE_URL}images/image_12.png`}
            alt="Nike Dunk Logo"
            className="w-10 h-auto object-contain transform -rotate-12 group-hover:rotate-0 transition-transform duration-300"
          />
          <a href="/" className="font-black italic text-xl uppercase tracking-wider text-white">
            NIKE <span className="text-yellow-400">DUNK</span>
          </a>
        </div>
        <div className="flex space-x-3 justify-between items-center">
          <a
            href="https://www.facebook.com/ahmedhamdyelbrens?"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF className="text-gray-400 text-2xl hover:text-white" />
          </a>
          <a
            href="https://www.linkedin.com/in/ahmed-hamdy-35a96b263/"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedinIn className="text-gray-400 text-2xl hover:text-white" />
          </a>
          <a
            href="https://www.instagram.com/ah_med.ham_dy/"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="text-gray-400 text-2xl hover:text-white" />
          </a>
        </div>
        {/* Simple Links */}
        <div className="flex space-x-6">
          <a href="#" className="hover:text-gray-400">
            About
          </a>
          <a href="#" className="hover:text-gray-400">
            Contact
          </a>
          <a href="#" className="hover:text-gray-400">
            Privacy
          </a>
        </div>
      </div>
      <div className="text-center text-gray-400 text-sm mt-6">
        © 2025 Catalog. All Rights Reserved.
      </div>
    </footer>
  );
};

export default React.memo(Footer);
