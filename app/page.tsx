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
  images?: string[]; // Multiple photos
  imgPosition: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  
  // NAVIN: Popup sathi state
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');

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

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 6);
  };

  // NAVIN: Product var click kelyavar Popup open karnya sathi
  const openProductDetails = (product: ProductType) => {
    setSelectedProduct(product);
    // Pahila photo set kara (Jar images array asel tar tithun, nahitar single image)
    setCurrentImage(product.images && product.images.length > 0 ? product.images[0] : (product.image || "/logo.jpg.jpeg"));
  };

  return (
    <div className="overflow-hidden w-full relative">
      <section className="relative flex flex-col items-center justify-center min-h-screen w-full px-4 text-center bg-[#fdf7f7]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fceceb]/50 to-transparent pointer-events-none"></div>
        <div className="z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
          <p className="text-sm md:text-base text-[#a35d58] mb-6 tracking-[0.3em] uppercase font-medium">Handcrafted in Mumbai</p>
          <h1 className="text-6xl md:text-8xl font-serif text-[#4a2c2a] mb-8 leading-tight">Handmade <br/> <span className="italic text-[#a35d58]">with Love</span></h1>
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

          {isLoading ? (
            <div className="text-center text-[#a35d58] font-bold my-20">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-[#6b4441] my-20 italic">Products coming soon...</div>
          ) : (
            <div className="flex flex-col items-center w-full mt-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full">
                {products.slice(0, visibleCount).map((product) => (
                  <div key={product._id} className="group bg-white rounded-none p-6 shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#f5e1df] flex flex-col">
                    
                    {/* NAVIN: Image var click kelyavar Pop-up ughadel */}
                    <div 
                      onClick={() => openProductDetails(product)}
                      className="w-full h-80 bg-[#fdf7f7] mb-8 relative overflow-hidden flex items-center justify-center group-hover:bg-[#fceceb] transition-colors duration-500 cursor-pointer"
                    >
                      <Image src={product.image || "/logo.jpg.jpeg"} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover", objectPosition: product.imgPosition || "center" }} className="transition-transform duration-500 group-hover:scale-105" />  
                      {/* Photo chya var ek chota icon disel ki multiple photos ahet */}
                      {product.images && product.images.length > 1 && (
                        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-xs font-bold text-[#4a2c2a] px-2 py-1 rounded-full flex gap-1 items-center shadow-sm">
                           <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                           {product.images.length}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center flex-grow">
                      <h3 className="text-2xl font-serif text-[#4a2c2a] mb-3">{product.name}</h3>
                      <p className="text-[#6b4441] text-sm font-light leading-relaxed mb-6 px-4 mx-auto line-clamp-2">{product.desc}</p>
                    </div>
                    <div className="flex flex-col items-center pt-4 border-t border-[#f5e1df]">
                      {product.price && product.price.trim() !== '' && (
                        <span className="text-xl font-serif text-[#a35d58] mb-4">{product.price}</span>
                      )}
                      <button 
                        onClick={() => openProductDetails(product)}
                        className="w-full py-3 bg-transparent text-[#4a2c2a] text-sm tracking-widest uppercase border border-[#4a2c2a] hover:bg-[#4a2c2a] hover:text-white transition-all duration-300"
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

      {/* 🚀 NAVIN: AMAZON STYLE POPUP (MODAL) 🚀 */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 md:p-10">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative shadow-2xl animate-fade-in-up">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/80 text-[#4a2c2a] rounded-full flex items-center justify-center hover:bg-[#a35d58] hover:text-white transition-colors shadow-md border border-[#f5e1df]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            {/* Left Side: Images Gallery */}
            <div className="w-full md:w-1/2 bg-[#fdf7f7] p-6 md:p-10 flex flex-col gap-6">
              {/* Main Large Image */}
              <div className="w-full aspect-square relative rounded-xl overflow-hidden bg-white border border-[#f5e1df] shadow-sm">
                <Image src={currentImage} alt={selectedProduct.name} fill className="object-cover" />
              </div>
              
              {/* Thumbnails Row (Multiple Photos) */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {(selectedProduct.images && selectedProduct.images.length > 0 
                  ? selectedProduct.images 
                  : [selectedProduct.image || "/logo.jpg.jpeg"]
                ).map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentImage(img)} 
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 border-2 ${currentImage === img ? 'border-[#a35d58] shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <Image src={img} alt={`Variant ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side: Product Details */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#a35d58] mb-3">UP's Creation</p>
              <h2 className="text-4xl md:text-5xl font-serif text-[#4a2c2a] mb-4 leading-tight">{selectedProduct.name}</h2>
              <p className="text-3xl font-serif text-[#a35d58] mb-8">{selectedProduct.price}</p>
              
              <div className="w-full h-[1px] bg-[#f5e1df] mb-8"></div>
              
              <h4 className="text-sm font-bold text-[#4a2c2a] uppercase tracking-wider mb-3">Product Description</h4>
              <p className="text-[#6b4441] leading-relaxed mb-10 whitespace-pre-wrap font-light">{selectedProduct.desc}</p>
              
              <div className="mt-auto flex flex-col gap-4">
                <button className="w-full py-4 bg-[#4a2c2a] text-white text-sm tracking-widest uppercase font-bold hover:bg-[#a35d58] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 rounded-none">
                  Enquire via WhatsApp
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}