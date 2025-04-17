import React from "react";
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto gap-4">
        {/* Branding and Social */}
        <div className="flex flex-row gap-1  items-center md:items-start">
          <div className="bg-yellow-400 p-2 rounded-full">
            <img src="/images/image24.png" alt="Catalog" className="w-6 h-6" />
          </div>
          <a href="/" className="font-bold  text-2xl mb-2">
            Catalog
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

export default Footer;
