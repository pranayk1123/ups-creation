import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="absolute top-6 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 w-full">
      
      {/* 1. Left Side: Logo & Brand Name */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#a35d58] shadow-sm bg-white group-hover:scale-105 transition-transform duration-300">
          <Image src="/logo.jpg.jpeg" alt="UP's Creation Logo" fill className="object-cover" />
        </div>
        
        {/* STYLISH NAME: 'UP's' bold ani 'Creation' italic madhe */}
        <h2 className="hidden sm:flex items-baseline gap-1.5 drop-shadow-md">
          <span className="text-2xl font-serif font-extrabold text-[#4a2c2a] tracking-wider">UP's</span>
          <span className="text-3xl font-serif italic text-[#a35d58] tracking-wide">Creation</span>
        </h2>
      </Link>

      {/* 2. Center: Links Capsule (Thoda left la shift kela ahe) */}
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
        {/* ADDED ADMIN LINK HERE */}
        <Link href="/admin" className="text-[#4a2c2a] hover:text-[#a35d58] text-xs tracking-widest uppercase font-bold transition-colors">
          Admin
        </Link>
      </div>

      {/* 3. Right Side: Menu Capsule */}
      <div className="hidden lg:flex items-center gap-4 bg-[#4a2c2a]/10 backdrop-blur-md pl-6 pr-2 py-2 rounded-full border border-white/40 shadow-sm cursor-pointer hover:bg-[#4a2c2a]/20 transition-all">
        <span className="text-[#4a2c2a] text-xs font-bold tracking-widest uppercase">Menu</span>
        <div className="w-9 h-9 rounded-full bg-[#a35d58] flex items-center justify-center shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      </div>

      {/* Mobile Menu Icon (Fakta chotya screen sathi) */}
      <button className="md:hidden text-[#4a2c2a] bg-white/40 p-2.5 rounded-full backdrop-blur-md border border-white/50">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

    </div>
  );
}