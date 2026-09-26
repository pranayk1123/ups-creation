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
  imgPosition: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    desc: '',
    image: '', 
    imgPosition: 'center',
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Products anayla problem aala:", error);
      setProducts([]); 
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setNewProduct({ ...newProduct, image: '' }); 
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalImage = newProduct.image.trim();

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.url) {
          finalImage = uploadData.url; 
        }
      } catch (error) {
        console.error("Photo upload fail zala:", error);
      }
    }

    const finalPrice = newProduct.price.trim() === '' ? ' ' : newProduct.price;
    if (finalImage === '') finalImage = '/logo.jpg.jpeg';

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: finalPrice,
          image: finalImage,
        }),
      });

      if (res.ok) {
        fetchProducts();
        setIsFormOpen(false);
        setNewProduct({ name: '', price: '', desc: '', image: '', imgPosition: 'center' });
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Product save kartana error aala:", error);
    }
  };

  // 🗑️ Navin Delete Function
  const handleDeleteProduct = async (id: string) => {
    const confirmDelete = window.confirm("Nakkich ha product delete karaycha ahe ka?");
    if (!confirmDelete) return; // Cancel kela tar thambel

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchProducts(); // Delete zalyavar aapoap list refresh hoil
      }
    } catch (error) {
      console.error("Product delete kartana problem aala:", error);
    }
  };

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 6);
  };

  return (
    <div className="overflow-hidden w-full">
      <section className="relative flex flex-col items-center justify-center min-h-screen w-full px-4 text-center bg-[#fdf7f7]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fceceb]/50 to-transparent pointer-events-none"></div>
        <div className="z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
          <p className="text-sm md:text-base text-[#a35d58] mb-6 tracking-[0.3em] uppercase font-medium">Handcrafted in Mumbai</p>
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

      <section id="products" className="py-32 px-6 md:px-12 w-full bg-white relative">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-10 w-full flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-serif text-[#4a2c2a] mb-4">Our Signature Collection</h2>
            <div className="w-16 h-[1px] bg-[#a35d58] mx-auto mb-10"></div>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-2 bg-[#a35d58] text-white rounded-full font-bold uppercase tracking-widest text-sm shadow-md hover:bg-[#4a2c2a] transition-all"
            >
              + Add New Product
            </button>
          </div>

          {isFormOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
              <div className="bg-[#fdf7f7] p-8 rounded-2xl shadow-2xl max-w-md w-full border border-[#f5e1df] max-h-[90vh] overflow-y-auto">
                <h3 className="text-2xl font-serif text-[#4a2c2a] mb-6 text-center">Add New Creation</h3>
                <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
                  <input 
                    type="text" 
                    placeholder="Product Name" 
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="p-3 border border-[#eed6d3] rounded-lg bg-white outline-none focus:border-[#a35d58] text-[#4a2c2a]"
                  />
                  <input 
                    type="text" 
                    placeholder="Price (Optional, e.g. ₹500)" 
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="p-3 border border-[#eed6d3] rounded-lg bg-white outline-none focus:border-[#a35d58] text-[#4a2c2a]"
                  />
                  
                  <div className="flex flex-col gap-2 p-3 bg-white border border-[#eed6d3] rounded-lg">
                    <label className="text-sm text-[#6b4441] font-bold">Image (Upload OR Paste Link)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="text-sm text-[#4a2c2a] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#fceceb] file:text-[#a35d58] hover:file:bg-[#eed6d3]"
                    />
                    <div className="text-center text-xs text-[#a35d58] my-1">OR</div>
                    <input 
                      type="text" 
                      placeholder="Paste Image URL here..." 
                      value={newProduct.image}
                      onChange={(e) => {
                        setNewProduct({...newProduct, image: e.target.value});
                        setSelectedFile(null);
                      }}
                      className="p-2 border border-[#eed6d3] rounded text-sm outline-none focus:border-[#a35d58]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-[#6b4441] font-bold">Image Display Adjust</label>
                    <select 
                      value={newProduct.imgPosition}
                      onChange={(e) => setNewProduct({...newProduct, imgPosition: e.target.value})}
                      className="p-3 border border-[#eed6d3] rounded-lg bg-white outline-none focus:border-[#a35d58] text-[#4a2c2a]"
                    >
                      <option value="center">Center (Default)</option>
                      <option value="top">Top (Varcha bhag dakhava)</option>
                      <option value="bottom">Bottom (Khalcha bhag dakhava)</option>
                    </select>
                  </div>

                  <textarea 
                    placeholder="Short Description" 
                    required
                    rows={3}
                    value={newProduct.desc}
                    onChange={(e) => setNewProduct({...newProduct, desc: e.target.value})}
                    className="p-3 border border-[#eed6d3] rounded-lg bg-white outline-none focus:border-[#a35d58] text-[#4a2c2a]"
                  ></textarea>
                  
                  <div className="flex gap-4 mt-4">
                    <button type="button" onClick={() => { setIsFormOpen(false); setSelectedFile(null); }} className="flex-1 py-3 text-[#4a2c2a] border border-[#4a2c2a] rounded-lg font-bold hover:bg-[#fceceb]">Cancel</button>
                    <button type="submit" className="flex-1 py-3 text-white bg-[#a35d58] rounded-lg font-bold hover:bg-[#4a2c2a]">Save</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="text-center text-[#a35d58] font-bold my-20">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-[#6b4441] my-20 italic">No products yet. Click "+ Add New Product" to start!</div>
          ) : (
            <div className="flex flex-col items-center w-full mt-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full">
                {products.slice(0, visibleCount).map((product) => (
                  <div key={product._id} className="group bg-white rounded-none p-6 shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#f5e1df] flex flex-col relative">
                    
                    {/* 🗑️ Delete Button: Card var hover kelyavar disel */}
                    <button 
                      onClick={() => handleDeleteProduct(product._id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 hover:bg-red-600 shadow-md"
                      title="Delete Product"
                    >
                      ✕
                    </button>

                    <div className="w-full h-80 bg-[#fdf7f7] mb-8 relative overflow-hidden flex items-center justify-center group-hover:bg-[#fceceb] transition-colors duration-500">
                      <Image 
                        src={product.image || "/logo.jpg.jpeg"} 
                        alt={product.name} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: "cover", objectPosition: product.imgPosition || "center" }}
                        className="transition-transform duration-500 group-hover:scale-105"
                      />  
                    </div>
                    <div className="text-center flex-grow">
                      <h3 className="text-2xl font-serif text-[#4a2c2a] mb-3">{product.name}</h3>
                      <p className="text-[#6b4441] text-sm font-light leading-relaxed mb-6 px-4 mx-auto">{product.desc}</p>
                    </div>
                    <div className="flex flex-col items-center pt-4 border-t border-[#f5e1df]">
                      {product.price && product.price.trim() !== '' && (
                        <span className="text-xl font-serif text-[#a35d58] mb-4">{product.price}</span>
                      )}
                      <button className="w-full py-3 bg-transparent text-[#4a2c2a] text-sm tracking-widest uppercase border border-[#4a2c2a] hover:bg-[#4a2c2a] hover:text-white transition-all duration-300">
                        Enquire Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {visibleCount < products.length && (
                <button 
                  onClick={handleShowMore}
                  className="mt-16 px-10 py-3 bg-transparent text-[#a35d58] border-2 border-[#a35d58] text-sm tracking-widest uppercase font-bold hover:bg-[#a35d58] hover:text-white transition-all duration-300 shadow-sm"
                >
                  Show More Products
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}