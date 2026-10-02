"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer id="contact" className="bg-[#fceceb] text-center pt-24 pb-12 px-6 relative">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Brand Name, Tagline & Custom Badge */}
        <div className="mb-14 flex flex-col items-center">
          <h2 className="flex items-baseline justify-center gap-1.5 mb-2">
            <span className="text-3xl font-serif font-extrabold text-[#4a2c2a] tracking-wider">UP's</span>
            <span className="text-4xl font-serif italic text-[#a35d58] tracking-wide">Creation</span>
          </h2>
          <p className="text-[#6b4441] text-sm tracking-[0.2em] uppercase font-light mt-4 mb-3">
            Stitched with Love 🤍
          </p>
          <div className="inline-block px-5 py-2 bg-white/60 border border-[#eed6d3] rounded-full shadow-sm">
            <p className="text-[#a35d58] text-[11px] sm:text-xs tracking-widest uppercase font-bold">
              ✨ Bespoke & Customized Orders Available
            </p>
          </div>
        </div>
        
        {/* Contact Links with Icons */}
        <div className="flex flex-col sm:flex-row justify-center gap-8 md:gap-16 mb-12 text-sm tracking-widest uppercase font-medium">
          
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

        {/* Professional Payment Policy Block */}
        <div className="mb-14 bg-white/60 p-6 md:p-8 rounded-2xl border border-[#eed6d3] max-w-2xl w-full shadow-sm">
          <h4 className="text-[#4a2c2a] text-[11px] sm:text-xs tracking-[0.2em] uppercase font-bold mb-3">
            Order & Payment Policy
          </h4>
          <p className="text-[#6b4441] text-xs sm:text-sm font-light leading-relaxed">
            We dedicate meticulous care and time to craft your unique pieces. To confirm and initiate your order, a <span className="font-semibold text-[#a35d58]">50% non-refundable advance payment</span> is required. Thank you for understanding and supporting our handcrafted artistry.
          </p>
        </div>
        
        {/* Copyright */}
        <div className="w-full border-t border-[#eed6d3] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#6b4441] text-xs tracking-widest uppercase">
            © {new Date().getFullYear()} UP's Creation. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-[#a35d58] tracking-wider font-bold">
            <button onClick={() => setActivePolicy('privacy')} className="hover:text-[#4a2c2a] transition-colors uppercase">Privacy Policy</button>
            <button onClick={() => setActivePolicy('terms')} className="hover:text-[#4a2c2a] transition-colors uppercase">Terms of Service</button>
          </div>
        </div>

      </div>

      {/* 📜 POLICY POPUP MODAL */}
      {activePolicy && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6 transition-opacity">
          <div className="bg-[#fdf7f7] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col relative shadow-2xl overflow-hidden border border-[#f5e1df] animate-in fade-in zoom-in-95 duration-300">
            
            {/* Close Button */}
            <button 
              onClick={() => setActivePolicy(null)} 
              className="absolute top-4 right-4 z-50 w-9 h-9 bg-white text-[#4a2c2a] rounded-full flex items-center justify-center hover:bg-[#a35d58] hover:text-white transition-colors shadow-sm border border-[#f5e1df]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {/* Modal Content */}
            <div className="p-6 sm:p-10 overflow-y-auto text-left flex-grow">
              <h3 className="text-2xl sm:text-3xl font-serif text-[#4a2c2a] mb-6 border-b border-[#eed6d3] pb-4">
                {activePolicy === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h3>
              
              <div className="text-sm text-[#6b4441] space-y-5 font-light leading-relaxed">
                {activePolicy === 'privacy' ? (
                  <>
                    <p><strong>1. Information We Collect:</strong><br/> We collect necessary details (such as your name, contact number, and shipping address) purely to process and deliver your custom handcrafted orders.</p>
                    <p><strong>2. How We Use Your Data:</strong><br/> Your information is strictly used for order fulfillment, updates via WhatsApp/Email, and addressing any queries you might have.</p>
                    <p><strong>3. Data Protection:</strong><br/> We respect your privacy. UP's Creation does not sell, share, or trade your personal information with any third parties.</p>
                    <p><strong>4. Payments:</strong><br/> All payment details and transactions are handled securely. We do not store sensitive payment information on our servers.</p>
                  </>
                ) : (
                  <>
                    <p><strong>1. Handcrafted Nature:</strong><br/> Every item at UP's Creation is 100% handmade. Slight variations in color, size, and stitching are a natural characteristic of bespoke crochet artistry and are not considered defects.</p>
                    <p><strong>2. Advance Payment & Cancellations:</strong><br/> Because our items are made-to-order, a <strong>50% non-refundable advance</strong> is required to confirm your order. Once the crafting process begins, cancellations cannot be accommodated.</p>
                    <p><strong>3. Delivery Timelines:</strong><br/> Crafting takes time. We will provide an estimated delivery timeframe during your enquiry. While we strive to meet these timelines, slight delays may occur due to the intricate nature of the work.</p>
                    <p><strong>4. Returns & Refunds:</strong><br/> Due to the customized nature of our products, we do not accept returns or exchanges unless the item arrives significantly damaged in transit. In such cases, an unboxing video is mandatory within 24 hours of delivery.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </footer>
  );
}