"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ProductType {
  _id: string;
  name: string;
  price: string;
  desc: string;
  image: string;
  images?: string[];
  imgPosition: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Products anayla problem aala:", error);
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 🔙 MOBILE BACK BUTTON FIX
  useEffect(() => {
    const handlePopState = () => {
      if (selectedProduct) {
        setSelectedProduct(null);
      }
    };

    if (selectedProduct) {
      window.history.pushState({ modalOpen: true }, '');
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedProduct]);

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 6);
  };

  const openProductDetails = (product: ProductType) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  const imagesList = selectedProduct
    ? (selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images : [selectedProduct.image || "/logo.jpg.jpeg"])
    : [];

  const currentImage = imagesList[currentImageIndex] || "/logo.jpg.jpeg";

  // TOUCH SWIPE LOGIC FOR MOBILE
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentImageIndex((prev) => (prev < imagesList.length - 1 ? prev + 1 : prev));
    }
    if (isRightSwipe) {
      setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };

  return (
    <div className="overflow-hidden w-full relative">
      <section className="relative flex flex-col items-center justify-center min-h-screen w-full px-4 text-center bg-[#fdf7f7]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fceceb]/50 to-transparent pointer-events-none"></div>
        <div className="z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
          <p className="text-sm md:text-base text-[#a35d58] mb-6 tracking-[0.3em] uppercase font-medium">Handcrafted in Mumbai</p>
          <h1 className="text-6xl md:text-8xl font-serif text-[#4a2c2a] mb-8 leading-tight">Handmade <br /> <span className="italic text-[#a35d58]">with Love</span></h1>
          <p className="text-lg text-[#6b4441] mb-12 max-w-xl mx-auto leading-relaxed font-light">
            Discover our premium collection of crochet artistry, bespoke gifts, and elegant home decor. Stitched meticulously for your special moments.
          </p>
          <Link href="#products" className="px-10 py-4 bg-[#4a2c2a] text-[#fdf7f7] text-sm tracking-widest uppercase font-medium hover:bg-[#a35d58] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
            Explore Collection
          </Link>
        </div>
      </section>

      <section id="products" className="py-32 px-6 md:px-12 w-full bg-white relative">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-16 w-full flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-serif text-[#4a2c2a] mb-4">Our Signature Collection</h2>
            <div className="w-16 h-[1px] bg-[#a35d58] mx-auto mb-10"></div>
          </div>

          {/* 🌟 AMAZON & YOUTUBE STYLE SKELETON LOADING EFFECT */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 lg:gap-12 w-full">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white p-3 sm:p-6 border border-[#f5e1df] flex flex-col animate-pulse">
                  <div className="w-full h-44 sm:h-80 bg-gray-200 mb-4 sm:mb-8 rounded-none"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto mb-6"></div>
                  <div className="h-10 bg-gray-200 rounded w-full mt-auto"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center text-[#6b4441] my-20 italic">Products coming soon...</div>
          ) : (
            <div className="flex flex-col items-center w-full mt-10">
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 lg:gap-12 w-full">
                {products.slice(0, visibleCount).map((product) => (
                  <div key={product._id} className="group bg-white rounded-none p-3 sm:p-6 shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#f5e1df] flex flex-col">

                    <div
                      onClick={() => openProductDetails(product)}
                      className="w-full h-44 sm:h-80 bg-[#fdf7f7] mb-4 sm:mb-8 relative overflow-hidden flex items-center justify-center group-hover:bg-[#fceceb] transition-colors duration-500 cursor-pointer"
                    >
                      <Image src={product.image || "/logo.jpg.jpeg"} alt={product.name} fill sizes="(max-width: 768px) 50vw, 33vw" style={{ objectFit: "cover", objectPosition: product.imgPosition || "center" }} className="transition-transform duration-500 group-hover:scale-105" />
                      {product.images && product.images.length > 1 && (
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/80 backdrop-blur-sm text-[10px] sm:text-xs font-bold text-[#4a2c2a] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex gap-1 items-center shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                          {product.images.length}
                        </div>
                      )}
                    </div>

                    <div className="text-center flex-grow">
                      <h3 className="text-lg sm:text-2xl font-serif text-[#4a2c2a] mb-2 sm:mb-3 line-clamp-1">{product.name}</h3>
                      <p className="text-[#6b4441] text-xs sm:text-sm font-light leading-relaxed mb-4 sm:mb-6 px-1 sm:px-4 mx-auto line-clamp-2">{product.desc}</p>
                    </div>
                    <div className="flex flex-col items-center pt-3 sm:pt-4 border-t border-[#f5e1df]">
                      {product.price && product.price.trim() !== '' && (
                        <span className="text-base sm:text-xl font-serif text-[#a35d58] mb-2 sm:mb-4">{product.price}</span>
                      )}
                      <button
                        onClick={() => openProductDetails(product)}
                        className="w-full py-2 sm:py-3 bg-transparent text-[#4a2c2a] text-[11px] sm:text-sm tracking-widest uppercase border border-[#4a2c2a] hover:bg-[#4a2c2a] hover:text-white transition-all duration-300"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {visibleCount < products.length && (
                <button onClick={handleShowMore} className="mt-16 px-10 py-3 bg-transparent text-[#a35d58] border-2 border-[#a35d58] text-sm tracking-widest uppercase font-bold hover:bg-[#a35d58] hover:text-white transition-all duration-300 shadow-sm">
                  Show More Products
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* POPUP MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-6 md:p-10">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col md:flex-row relative shadow-2xl overflow-y-auto md:overflow-hidden">

            <button
              onClick={closeProductDetails}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 w-9 h-9 sm:w-10 sm:h-10 bg-white/90 text-[#4a2c2a] rounded-full flex items-center justify-center hover:bg-[#a35d58] hover:text-white transition-colors shadow-md border border-[#f5e1df]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {/* Left Gallery */}
            <div className="w-full md:w-1/2 bg-[#fdf7f7] p-4 sm:p-8 flex flex-col gap-4 flex-shrink-0">
              <div
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className="w-full aspect-square relative rounded-xl overflow-hidden bg-white border border-[#f5e1df] shadow-sm cursor-grab active:cursor-grabbing"
              >
                <div
                  className="flex h-full transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                >
                  {imagesList.map((img, idx) => (
                    <div key={idx} className="w-full h-full flex-shrink-0 relative">
                      <Image src={img} alt={`Slide ${idx}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>

                {imagesList.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full pointer-events-none md:hidden shadow-sm z-10 tracking-widest">
                    {currentImageIndex + 1} / {imagesList.length}
                  </div>
                )}
              </div>

              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 border-2 ${currentImageIndex === idx ? 'border-[#a35d58] shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <Image src={img} alt={`Variant ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Details */}
            <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-12 flex flex-col bg-white md:overflow-y-auto md:max-h-[92vh]">
              <div className="mb-4">
                <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#a35d58] mb-1 sm:mb-2">UP's Creation</p>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-[#4a2c2a] mb-2 sm:mb-3 leading-tight">{selectedProduct.name}</h2>
                <p className="text-xl sm:text-3xl font-serif text-[#a35d58] mb-4">{selectedProduct.price}</p>

                <div className="w-full h-[1px] bg-[#f5e1df] mb-4"></div>

                <h4 className="text-xs sm:text-sm font-bold text-[#4a2c2a] uppercase tracking-wider mb-1">Product Description</h4>
                <p className="text-[#6b4441] leading-relaxed mb-4 whitespace-pre-wrap font-light text-xs sm:text-sm">{selectedProduct.desc}</p>
              </div>

              <WhatsAppEnquirySection product={selectedProduct} currentImage={currentImage} />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// 💬 WhatsApp Enquiry Section
function WhatsAppEnquirySection({ product, currentImage }: { product: ProductType, currentImage: string }) {
  const [customMsg, setCustomMsg] = useState("");
  const hasValidPrice = Boolean(product.price && product.price.trim() !== "" && product.price.trim() !== " ");
  const [includePrice, setIncludePrice] = useState(hasValidPrice);

  const handleQuickOptionClick = (optionText: string) => {
    setCustomMsg(prev => (prev ? `${prev}, ${optionText}` : optionText));
  };

  const handleWhatsAppSend = () => {
    const phoneNumber = "919594790996";

    let message = `Hello UP's Creation, I want to enquire about this product:\n\n`;
    message += `*Product:* ${product.name}\n`;
    if (hasValidPrice && includePrice) {
      message += `*Price:* ${product.price}\n`;
    }
    message += `*Photo Link:* ${currentImage}\n`;

    if (customMsg.trim() !== "") {
      message += `*Custom Message:* ${customMsg}\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-[#fdf7f7] p-4 rounded-xl border border-[#f5e1df] flex flex-col gap-3 mt-auto">
      <h4 className="text-xs font-bold text-[#4a2c2a] uppercase tracking-wider">Enquire via WhatsApp</h4>

      {hasValidPrice && (
        <label className="flex items-center gap-2 text-sm text-[#6b4441] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={includePrice}
            onChange={(e) => setIncludePrice(e.target.checked)}
            className="accent-[#a35d58] w-4 h-4"
          />
          Include Price in message
        </label>
      )}

      <div className="flex flex-wrap gap-1.5">
        <span className="text-[11px] text-[#a35d58] font-bold w-full mb-1">Quick Options (Click to add):</span>
        <button
          type="button"
          onClick={() => handleQuickOptionClick("Available colors?")}
          className="text-xs bg-white border border-[#eed6d3] text-[#4a2c2a] px-3 py-1 rounded-full hover:bg-[#fceceb] transition-colors"
        >
          🎨 Available Colors?
        </button>
        <button
          type="button"
          onClick={() => handleQuickOptionClick("Custom size needed")}
          className="text-xs bg-white border border-[#eed6d3] text-[#4a2c2a] px-3 py-1 rounded-full hover:bg-[#fceceb] transition-colors"
        >
          📏 Custom Size
        </button>
        <button
          type="button"
          onClick={() => handleQuickOptionClick("What is the delivery time?")}
          className="text-xs bg-white border border-[#eed6d3] text-[#4a2c2a] px-3 py-1 rounded-full hover:bg-[#fceceb] transition-colors"
        >
          ⏱️ Delivery Time?
        </button>
        <button
          type="button"
          onClick={() => handleQuickOptionClick("What is the Price?")}
          className="text-xs bg-white border border-[#eed6d3] text-[#4a2c2a] px-3 py-1 rounded-full hover:bg-[#fceceb] transition-colors"
        >
          ⏱️ Price?
        </button>
      </div>

      <textarea
        placeholder="Type custom color, size or message here (Optional)..."
        rows={2}
        value={customMsg}
        onChange={(e) => setCustomMsg(e.target.value)}
        className="p-3 bg-white border border-[#eed6d3] rounded-lg text-sm outline-none focus:border-[#a35d58] text-[#4a2c2a]"
      ></textarea>

      <button
        onClick={handleWhatsAppSend}
        className="w-full py-3.5 bg-[#4a2c2a] text-white text-sm tracking-widest uppercase font-bold hover:bg-[#a35d58] transition-all duration-300 shadow-md flex items-center justify-center gap-2 rounded-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        Send Enquiry via WhatsApp
      </button>
    </div>
  );
}