import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const products = [
    { 
      id: 1, 
      name: "Crochet Modak", 
      price: "₹399", 
      desc: "Traditional, handcrafted crochet modak for your festive offerings.", 
      image: "/image1.jpeg", 
      imgPosition: "center 45%" // Pahilya image sathi vegli position
    },
    { 
      id: 2, 
      name: "Custom Amigurumi", 
      price: "₹899", 
      desc: "Personalized crochet dolls made with intricate details.", 
      image: "/image2.jpeg", 
      imgPosition: "bottom" // Dusrya image sathi vegli position
    },
    { 
      id: 3, 
      name: "Aesthetic Decor", 
      price: "₹699", 
      desc: "Minimalist and warm crochet pieces for home styling.", 
      image: "/image3.jpeg", 
      imgPosition: "center 55%" // Tisrya image sathi vegli position
    }
  ];

  return (
    <div className="overflow-hidden w-full">
      {/* Premium Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen w-full px-4 text-center bg-[#fdf7f7]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fceceb]/50 to-transparent pointer-events-none"></div>
        
        <div className="z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
          <p className="text-sm md:text-base text-[#a35d58] mb-6 tracking-[0.3em] uppercase font-medium">
            Handcrafted in Mumbai
          </p>
          <h1 className="text-6xl md:text-8xl font-serif text-[#4a2c2a] mb-8 leading-tight">
            Handmade <br/> <span className="italic text-[#a35d58]">with Love</span>
          </h1>
          <p className="text-lg text-[#6b4441] mb-12 max-w-xl mx-auto leading-relaxed font-light">
            Discover our premium collection of crochet artistry, bespoke gifts, and elegant home decor. Stitched meticulously for your special moments.
          </p>
          
          <Link href="#products" className="px-10 py-4 bg-[#4a2c2a] text-[#fdf7f7] text-sm tracking-widest uppercase font-medium hover:bg-[#a35d58] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Elegant Products Section */}
      <section id="products" className="py-32 px-6 md:px-12 w-full bg-white">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-20 w-full flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-serif text-[#4a2c2a] mb-4">Our Signature Collection</h2>
            <div className="w-16 h-[1px] bg-[#a35d58] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full">
            {products.map((product) => (
              <div key={product.id} className="group bg-white rounded-none p-6 shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#f5e1df] flex flex-col">
                <div className="w-full h-80 bg-[#fdf7f7] mb-8 relative overflow-hidden flex items-center justify-center group-hover:bg-[#fceceb] transition-colors duration-500">
                  
                  {/* Ithe style madhe tuzyach array madhli imgPosition apply hotiye */}
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    layout="fill" 
                    style={{ 
                      objectFit: "cover", 
                      objectPosition: product.imgPosition 
                    }}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />  
                  
                </div>
                
                <div className="text-center flex-grow">
                  <h3 className="text-2xl font-serif text-[#4a2c2a] mb-3">{product.name}</h3>
                  <p className="text-[#6b4441] text-sm font-light leading-relaxed mb-6 px-4 mx-auto">{product.desc}</p>
                </div>
                
                <div className="flex flex-col items-center pt-4 border-t border-[#f5e1df]">
                  <span className="text-xl font-serif text-[#a35d58] mb-4">{product.price}</span>
                  <button className="w-full py-3 bg-transparent text-[#4a2c2a] text-sm tracking-widest uppercase border border-[#4a2c2a] hover:bg-[#4a2c2a] hover:text-white transition-all duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}