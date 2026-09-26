"use client"; 

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

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [products, setProducts] = useState<ProductType[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', desc: '', image: '', imgPosition: 'center',
  });
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (sessionStorage.getItem("isAdmin") === "true") {
      setIsAuthenticated(true);
      fetchProducts();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem("isAdmin", "true");
        fetchProducts();
      } else {
        alert("Wrong Username or Password! Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("isAdmin");
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Fetch products error:", error);
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setNewProduct({ ...newProduct, image: '' }); 
    }
  };

  const handleOpenEdit = (product: ProductType) => {
    setEditingProductId(product._id);
    setNewProduct({
      name: product.name,
      price: product.price === ' ' ? '' : product.price,
      desc: product.desc,
      image: '',
      imgPosition: product.imgPosition || 'center',
    });
    setCurrentImages(product.images && product.images.length > 0 ? product.images : [product.image]);
    setSelectedFiles([]);
    setIsFormOpen(true);
  };

  const handleRemoveExistingImage = (indexToRemove: number) => {
    setCurrentImages(currentImages.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let uploadedUrls = [...currentImages];

    if (selectedFiles.length > 0) {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        try {
          const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
          const uploadData = await uploadRes.json();
          if (uploadData.url) {
            uploadedUrls.push(uploadData.url);
          }
        } catch (error) {
          console.error("Photo upload failed:", error);
        }
      }
    }

    if (newProduct.image.trim() !== '') {
      uploadedUrls.push(newProduct.image.trim());
    }

    const finalImage = uploadedUrls.length > 0 ? uploadedUrls[0] : '/logo.jpg.jpeg';
    const finalPrice = newProduct.price.trim() === '' ? ' ' : newProduct.price;

    try {
      const url = editingProductId ? `/api/products?id=${editingProductId}` : '/api/products';
      const method = editingProductId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...newProduct, 
          price: finalPrice, 
          image: finalImage,
          images: uploadedUrls 
        }),
      });

      if (res.ok) {
        fetchProducts();
        setIsFormOpen(false);
        setEditingProductId(null);
        setNewProduct({ name: '', price: '', desc: '', image: '', imgPosition: 'center' });
        setCurrentImages([]);
        setSelectedFiles([]);
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf7f7] px-4 pt-28">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm flex flex-col gap-5 border border-[#f5e1df]">
          <h2 className="text-3xl font-serif text-[#4a2c2a] text-center mb-2">Admin Login</h2>
          <input type="text" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} className="p-3 border border-[#eed6d3] rounded-lg outline-none focus:border-[#a35d58]" />
          <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="p-3 border border-[#eed6d3] rounded-lg outline-none focus:border-[#a35d58]" />
          <button type="submit" className="py-3 bg-[#a35d58] text-white rounded-lg font-bold hover:bg-[#4a2c2a] transition-colors mt-2">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf7f7] pb-10 pt-28 sm:pt-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* 📱 RESPONSIVE ADMIN HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 sm:mb-10 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-[#f5e1df]">
          <h1 className="text-2xl sm:text-3xl font-serif text-[#4a2c2a]">Admin Dashboard</h1>
          <div className="flex flex-wrap justify-center gap-3 w-full sm:w-auto">
            <button onClick={() => { 
              setEditingProductId(null);
              setNewProduct({ name: '', price: '', desc: '', image: '', imgPosition: 'center' });
              setCurrentImages([]);
              setSelectedFiles([]);
              setIsFormOpen(true); 
            }} className="flex-1 sm:flex-none px-5 py-2.5 bg-[#a35d58] text-white rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm shadow-md hover:bg-[#4a2c2a] transition-all text-center">+ Add Product</button>
            <button onClick={handleLogout} className="flex-1 sm:flex-none px-5 py-2.5 bg-transparent text-[#4a2c2a] border border-[#4a2c2a] rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm hover:bg-[#fceceb] transition-all text-center">Logout</button>
          </div>
        </div>

        {/* ADD / EDIT MODAL FORM */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-[#fdf7f7] p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full border border-[#f5e1df] max-h-[90vh] overflow-y-auto mt-10">
              <h3 className="text-2xl font-serif text-[#4a2c2a] mb-6 text-center">{editingProductId ? 'Edit Creation' : 'Add New Creation'}</h3>
              <form onSubmit={handleSaveProduct} className="flex flex-col gap-4">
                <input type="text" placeholder="Product Name" required value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="p-3 border border-[#eed6d3] rounded-lg bg-white outline-none focus:border-[#a35d58] text-[#4a2c2a]" />
                <input type="text" placeholder="Price (Optional)" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="p-3 border border-[#eed6d3] rounded-lg bg-white outline-none focus:border-[#a35d58] text-[#4a2c2a]" />
                
                {currentImages.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#6b4441] font-bold">Current Photos (Click ✕ to remove)</label>
                    <div className="flex gap-2 flex-wrap bg-white p-2 border border-[#eed6d3] rounded-lg">
                      {currentImages.map((imgUrl, idx) => (
                        <div key={idx} className="relative w-14 h-14 rounded overflow-hidden border border-[#eed6d3]">
                          <Image src={imgUrl} alt={`Current ${idx}`} fill className="object-cover" />
                          <button 
                            type="button" 
                            onClick={() => handleRemoveExistingImage(idx)}
                            className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-bl"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2 p-3 bg-white border border-[#eed6d3] rounded-lg">
                  <label className="text-sm text-[#6b4441] font-bold">Add More Images</label>
                  <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="text-sm text-[#4a2c2a] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#fceceb] file:text-[#a35d58] hover:file:bg-[#eed6d3]" />
                  <div className="text-center text-xs text-[#a35d58] my-1">OR</div>
                  <input type="text" placeholder="Paste single Image URL here..." value={newProduct.image} onChange={(e) => { setNewProduct({...newProduct, image: e.target.value}); setSelectedFiles([]); }} className="p-2 border border-[#eed6d3] rounded text-sm outline-none focus:border-[#a35d58]" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[#6b4441] font-bold">Main Image Display Adjust</label>
                  <select value={newProduct.imgPosition} onChange={(e) => setNewProduct({...newProduct, imgPosition: e.target.value})} className="p-3 border border-[#eed6d3] rounded-lg bg-white outline-none focus:border-[#a35d58] text-[#4a2c2a]">
                    <option value="center">Center (Default)</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>

                <textarea placeholder="Short Description" required rows={3} value={newProduct.desc} onChange={(e) => setNewProduct({...newProduct, desc: e.target.value})} className="p-3 border border-[#eed6d3] rounded-lg bg-white outline-none focus:border-[#a35d58] text-[#4a2c2a]"></textarea>
                
                <div className="flex gap-4 mt-4">
                  <button type="button" onClick={() => { setIsFormOpen(false); setSelectedFiles([]); }} className="flex-1 py-3 text-[#4a2c2a] border border-[#4a2c2a] rounded-lg font-bold hover:bg-[#fceceb]">Cancel</button>
                  <button type="submit" className="flex-1 py-3 text-white bg-[#a35d58] rounded-lg font-bold hover:bg-[#4a2c2a]">Save Product</button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* 📱 2-COLUMN GRID FOR MOBILE, 3-COLUMN FOR DESKTOP */}
        {isLoading ? (
          <div className="text-center text-[#a35d58] font-bold my-20">Loading products...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 lg:gap-12 w-full">
            {products.map((product) => (
              <AdminProductCard key={product._id} product={product} handleDeleteProduct={handleDeleteProduct} handleOpenEdit={handleOpenEdit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 📱 Admin Product Card (Optimized for Mobile Grid)
function AdminProductCard({ product, handleDeleteProduct, handleOpenEdit }: { product: ProductType, handleDeleteProduct: (id: string) => void, handleOpenEdit: (p: ProductType) => void }) {
  const [activeImage, setActiveImage] = useState(product.image || "/logo.jpg.jpeg");

  return (
    <div className="group bg-white rounded-none p-3 sm:p-6 shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#f5e1df] flex flex-col relative">
      <div className="absolute top-2 right-2 flex gap-1.5 z-20">
        <button onClick={() => handleOpenEdit(product)} className="w-7 h-7 sm:w-8 sm:h-8 bg-[#4a2c2a] text-white rounded-full flex items-center justify-center sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#a35d58] shadow-md text-xs" title="Edit Product">
          ✎
        </button>
        <button onClick={() => handleDeleteProduct(product._id)} className="w-7 h-7 sm:w-8 sm:h-8 bg-red-500/90 text-white rounded-full flex items-center justify-center sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600 shadow-md text-xs" title="Delete Product">
          ✕
        </button>
      </div>
      
      {/* Main Image */}
      <div className="w-full h-44 sm:h-80 bg-[#fdf7f7] mb-3 sm:mb-4 relative overflow-hidden flex items-center justify-center group-hover:bg-[#fceceb] transition-colors duration-500">
        <Image src={activeImage} alt={product.name} fill sizes="(max-width: 768px) 50vw, 33vw" style={{ objectFit: "cover", objectPosition: product.imgPosition || "center" }} className="transition-transform duration-500 group-hover:scale-105" />  
      </div>

      {/* Thumbnails */}
      {product.images && product.images.length > 1 && (
        <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4 overflow-x-auto pb-1 scrollbar-thin">
          {product.images.map((imgUrl, i) => (
            <div 
              key={i} 
              onClick={() => setActiveImage(imgUrl)}
              className={`relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded border-2 overflow-hidden bg-[#fdf7f7] cursor-pointer transition-all ${activeImage === imgUrl ? 'border-[#a35d58] scale-105 shadow-md' : 'border-[#eed6d3] opacity-70 hover:opacity-100'}`}
            >
              <Image src={imgUrl} alt={`Thumb ${i}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="text-center flex-grow">
        <h3 className="text-base sm:text-2xl font-serif text-[#4a2c2a] mb-1 line-clamp-1">{product.name}</h3>
        <span className="text-sm sm:text-xl font-serif text-[#a35d58]">{product.price || 'No Price'}</span>
        <p className="text-[10px] sm:text-xs text-gray-400 mt-1 sm:mt-2 font-bold">{product.images && product.images.length > 1 ? `${product.images.length} Photos` : '1 Photo'}</p>
      </div>
    </div>
  );
}