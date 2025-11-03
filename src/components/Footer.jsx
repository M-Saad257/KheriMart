import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#9f6b4a] text-white pt-10 pb-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {/* Logo & Tagline */}
        <div>
          <h2 className="text-2xl font-bold mb-2">KheriMart</h2>
          <p className="text-sm">Culture You Can Wear, Pride You Can Feel</p>
        </div>

        {/* Quick Links + Contact Info side by side */}
        <div className="col-span-2 flex flex-col sm:flex-row justify-between gap-6">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><a href="#about"  className="hover:underline">About Us</a></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div id='contact'>
            <h3 className="text-lg font-semibold mb-2">Contact</h3>
            <p className="text-sm">Email: support@KheriMart.pk</p>
            <p className="text-sm">Phone: +92 301 6235725</p>
            <p className="text-sm">Peshawar, Pakistan</p>
          </div>
        </div>

        {/* Social Icons */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-amber-300"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="hover:text-amber-300"><i className="fab fa-instagram"></i></a>
            <a href="#" className="hover:text-amber-300"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-amber-300"><i className="fab fa-youtube"></i></a>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-amber-900 mt-8 pt-4 text-center text-sm">
        © 2025 KheriMart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
