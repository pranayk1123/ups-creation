"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Baher click kelyavar Menu band karnyasathi logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="absolute top-6 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 w-full">
      
      {/* 1. Left Side: Logo & Brand Name */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#a35d58] shadow-sm bg-white group-hover:scale-105 transition-transform duration-300">
          <Image src="/logo.jpg.jpeg" alt="UP's Creation Logo" fill className="object-cover" />
        </div>
        
        <h2 className="hidden sm:flex items-baseline gap-1.5 drop-shadow-md">
          <span className="text-2xl font-serif font-extrabold text-[#4a2c2a] tracking-wider">UP's</span>
          <span className="text-3xl font-serif italic text-[#a35d58] tracking-wide">Creation</span>
        </h2>
      </Link>

      {/* 2. Center: Links Capsule */}
      <div className="hidden md:flex items-center gap-8 bg-[#4a2c2a]/10 backdrop-blur-md px-10 py-3 rounded-full border border-white/40 shadow-sm relative right-4 lg:right-16">
        <Link href="/" className="text-[#4a2c2a] hover:text-[#a35d58] text-xs tracking-widest uppercase font-bold transition-colors">
          Home
        </Link>
        <Link href="#products" className="text-[#4a2c2a] hover:text-[#a35d58] text-xs tracking-widest uppercase font-bold transition-colors">
          Collection
        </Link>
        <Link href="#contact" className="text-[#4a2c2a] hover:text-[#a35d58] text-xs tracking-widest uppercase font-bold transition-colors">
          Contact
        </Link>
      </div>

      {/* 3. Right Side: Menu Capsule WITH CLICK DROPDOWN */}
      <div ref={menuRef} className="relative">
        
        {/* Desktop Menu Button */}
        <div 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="hidden lg:flex items-center gap-4 bg-[#4a2c2a]/10 backdrop-blur-md pl-6 pr-2 py-2 rounded-full border border-white/40 shadow-sm cursor-pointer hover:bg-[#4a2c2a]/20 transition-all"
        >
          <span className="text-[#4a2c2a] text-xs font-bold tracking-widest uppercase">Menu</span>
          <div className="w-9 h-9 rounded-full bg-[#a35d58] flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-[#4a2c2a] bg-white/40 p-2.5 rounded-full backdrop-blur-md border border-white/50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Dropdown Menu - Open zalyavar disel */}
        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-3 flex flex-col bg-white border border-[#eed6d3] rounded-xl shadow-xl overflow-hidden w-44 z-50">
            <Link 
              href="/admin" 
              onClick={() => setIsMenuOpen(false)} // Click kelyavar band hoil
              className="px-5 py-3 text-sm font-bold text-[#4a2c2a] hover:bg-[#fceceb] hover:text-[#a35d58] transition-colors flex items-center justify-between"
            >
              Admin Panel
              {/* Ek chota Lock cha icon taklay professional disnyasathi */}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#a35d58]">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}