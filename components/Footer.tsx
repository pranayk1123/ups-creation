import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#fceceb] text-center pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Brand Name & Tagline */}
        <div className="mb-14">
          <h2 className="flex items-baseline justify-center gap-1.5 mb-2">
            <span className="text-3xl font-serif font-extrabold text-[#4a2c2a] tracking-wider">UP's</span>
            <span className="text-4xl font-serif italic text-[#a35d58] tracking-wide">Creation</span>
          </h2>
          <p className="text-[#6b4441] text-sm tracking-[0.2em] uppercase font-light mt-4">
            Stitched with Love 🤍
          </p>
        </div>
        
        {/* Contact Links with Icons */}
        <div className="flex flex-col sm:flex-row justify-center gap-8 md:gap-16 mb-16 text-sm tracking-widest uppercase font-medium">
          
          {/* WhatsApp */}
          <a href="https://wa.me/919594790996" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[#4a2c2a] hover:text-[#a35d58] transition-all group">
            <div className="w-10 h-10 rounded-full border border-[#4a2c2a] group-hover:border-[#a35d58] flex items-center justify-center group-hover:bg-[#a35d58] group-hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <span>WhatsApp</span>
          </a>

          {/* Instagram */}
          <a href="https://instagram.com/ups.creation" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[#4a2c2a] hover:text-[#a35d58] transition-all group">
            <div className="w-10 h-10 rounded-full border border-[#4a2c2a] group-hover:border-[#a35d58] flex items-center justify-center group-hover:bg-[#a35d58] group-hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>
            <span>Instagram</span>
          </a>

          {/* Email */}
          <a href="mailto:ups.creation@gmail.com" className="flex items-center gap-3 text-[#4a2c2a] hover:text-[#a35d58] transition-all group">
            <div className="w-10 h-10 rounded-full border border-[#4a2c2a] group-hover:border-[#a35d58] flex items-center justify-center group-hover:bg-[#a35d58] group-hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <span className="normal-case tracking-normal font-sans">ups.creation1123@gmail.com</span>
          </a>
          
        </div>
        
        {/* Copyright */}
        <div className="w-full border-t border-[#eed6d3] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#6b4441] text-xs tracking-widest uppercase">
            © {new Date().getFullYear()} UP's Creation. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-[#a35d58] tracking-wider">
            <Link href="/" className="hover:text-[#4a2c2a] transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-[#4a2c2a] transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}