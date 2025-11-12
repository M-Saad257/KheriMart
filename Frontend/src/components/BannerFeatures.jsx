import React from 'react';
import Baner1 from '../assets/Baner1.png';
import Baner2 from '../assets/Baner2.png';
import Baner3 from '../assets/Baner3.png';
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <>
      {/* Banner Section */}
      <div className="mt-15 relative w-full h-[100vh]">
        {/* 🖥 Laptop & Desktop — lg and above */}
        <img
          src={Baner1}
          alt="Laptop Banner"
          className="absolute w-full h-full object-cover brightness-65 opacity-90 z-10 hidden lg:block"
        />

        {/* 💻 Tablet — md to lg */}
        <img
          src={Baner2}
          alt="Tablet Banner"
          className="absolute w-full h-full object-cover brightness-65 opacity-90 z-10 hidden md:block lg:hidden"
        />

        {/* 📱 Mobile — below md */}
        <img
          src={Baner3}
          alt="Mobile Banner"
          className="absolute w-full h-full object-cover brightness-65 opacity-90 z-10 block md:hidden"
        />

        {/* Text Content */}
        <div className="relative z-30 flex flex-col items-center justify-center h-full text-center px-4 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">KheriMart</h1>
          <p className="text-lg md:text-2xl mb-6">
            Culture You Can Wear, Pride You Can Feel
          </p>
          <Link
            to="/prods"
            className="bg-amber-950 hover:bg-amber-900 cursor-pointer text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-lg"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 text-center px-3 py-8 bg-white text-gray-800">
        <div><p className="text-xl font-bold">✅ 100% Handmade</p></div>
        <div><p className="text-xl font-bold">🚚 Free Delivery</p></div>
        <div><p className="text-xl font-bold">🎁 7-Day Exchange</p></div>
        <div><p className="text-xl font-bold">🇵🇰 Peshawar Crafted</p></div>
      </div>
    </>
  );
};

export default Banner;
