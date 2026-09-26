"use client"; 

import Image from 'next/image';
import { useState, useEffect } from 'react';

// NAVIN: images?: string[] add kela ahe
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
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', desc: '', image: '', imgPosition: 'center',
  });
  
  // NAVIN: Multiple files sathi File[] cha Array
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
      console.error("Login madhe problem aala:", error);
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
      console.error("Products anayla problem aala:", error);
      setIsLoading(false);
    }
  };

  // NAVIN: Multiple files select karnyasathi
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setNewProduct({ ...newProduct, image: '' }); 
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let uploadedUrls: string[] = [];

    // NAVIN: Ek-ek karun sagle photos upload karne
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
          console.error("Photo upload fail zala:", error);
        }
      }
    }

    if (newProduct.image.trim() !== '') {
      uploadedUrls.push(newProduct.image.trim());
    }

    const finalImage = uploadedUrls.length > 0 ? uploadedUrls[0] : '/logo.jpg.jpeg';
    const finalPrice = newProduct.price.trim() === '' ? ' ' : newProduct.price;

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...newProduct, 
          price: finalPrice, 
          image: finalImage,
          images: uploadedUrls // NAVIN: Sagle photos array madhe pathvle
        }),
      });
      if (res.ok) {
        fetchProducts();
        setIsFormOpen(false);
        setNewProduct({ name: '', price: '', desc: '', image: '', imgPosition: 'center' });
        setSelectedFiles([]);
      }
    } catch (error) {
      console.error("Product save kartana error aala:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const confirmDelete = window.confirm("Nakkich ha product delete karaycha ahe ka?");
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    } catch (error) {
      console.error("Product delete kartana problem aala:", error);
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
    <div className="min-h-screen bg-[#fdf7f7] pb-10 pt-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-[#f5e1df]">
          <h1 className="text-3xl font-serif text-[#4a2c2a]">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button onClick={() => setIsFormOpen(true)} className="px-6 py-2 bg-[#a35d58] text-white rounded-full font-bold uppercase tracking-widest text-sm shadow-md hover:bg-[#4a2c2a] transition-all">+ Add Product</button>
            <button onClick={handleLogout} className="px-6 py-2 bg-transparent text-[#4a2c2a] border border-[#4a2c2a] rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#fceceb] transition-all">Logout</button>
          </div>
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-[#fdf7f7] p-8 rounded-2xl shadow-2xl max-w-md w-full border border-[#f5e1df] max-h-[90vh] overflow-y-auto mt-20">
              <h3 className="text-2xl font-serif text-[#4a2c2a] mb-6 text-center">Add New Creation</h3>
              <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
                <input type="text" placeholder="Product Name" required value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="p-3 border border-[#eed6d3] rounded-lg bg-white outline-none focus:border-[#a35d58] text-[#4a2c2a]" />
                <input type="text" placeholder="Price (Optional)" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="p-3 border border-[#eed6d3] rounded-lg bg-white outline-none focus:border-[#a35d58] text-[#4a2c2a]" />
                
                <div className="flex flex-col gap-2 p-3 bg-white border border-[#eed6d3] rounded-lg">
                  {/* NAVIN: multiple added here */}
                  <label className="text-sm text-[#6b4441] font-bold">Images (Select Multiple by pressing Ctrl)</label>
                  <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="text-sm text-[#4a2c2a] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#fceceb] file:text-[#a35d58] hover:file:bg-[#eed6d3]" />
                  <div className="text-center text-xs text-[#a35d58] my-1">OR</div>
                  <input type="text" placeholder="Paste single Image URL here..." value={newProduct.image} onChange={(e) => { setNewProduct({...newProduct, image: e.target.value}); setSelectedFiles([]); }} className="p-2 border border-[#eed6d3] rounded text-sm outline-none focus:border-[#a35d58]" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[#6b4441] font-bold">Main Image Display Adjust</label>
                  <select value={newProduct.imgPosition} onChange={(e) => setNewProduct({...newProduct, imgPosition: e.target.value})} className="p-3 border border-[#eed6d3] rounded-lg bg-white outline-none focus:border-[#a35d58] text-[#4a2c2a]">
                    <option value="center">Center (Default)</option>
                    <option value="top">Top (Varcha bhag dakhava)</option>
                    <option value="bottom">Bottom (Khalcha bhag dakhava)</option>
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
        
        {isLoading ? (
          <div className="text-center text-[#a35d58] font-bold my-20">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full">
            {products.map((product) => (
              <div key={product._id} className="group bg-white rounded-none p-6 shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#f5e1df] flex flex-col relative">
                <button onClick={() => handleDeleteProduct(product._id)} className="absolute top-2 right-2 w-8 h-8 bg-red-500/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 hover:bg-red-600 shadow-md">✕</button>
                <div className="w-full h-80 bg-[#fdf7f7] mb-8 relative overflow-hidden flex items-center justify-center group-hover:bg-[#fceceb] transition-colors duration-500">
                  <Image src={product.image || "/logo.jpg.jpeg"} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover", objectPosition: product.imgPosition || "center" }} className="transition-transform duration-500 group-hover:scale-105" />  
                </div>
                <div className="text-center flex-grow">
                  <h3 className="text-2xl font-serif text-[#4a2c2a] mb-1">{product.name}</h3>
                  <span className="text-xl font-serif text-[#a35d58]">{product.price || 'No Price'}</span>
                  {/* NAVIN: Admin la kiti photo ahet te disel */}
                  <p className="text-xs text-gray-400 mt-2 font-bold">{product.images && product.images.length > 1 ? `${product.images.length} Photos Added` : '1 Photo'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}