"use client"; 

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

export default function AdminPage() {
  // --- LOGIN STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // --- PRODUCT STATE ---
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', desc: '', image: '', imgPosition: 'center',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Check if already logged in (Refresh kelyavar logout na vhava mhanun)
  useEffect(() => {
    if (sessionStorage.getItem("isAdmin") === "true") {
      setIsAuthenticated(true);
      fetchProducts();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // API la username ani password pathvun check kar
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
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.url) finalImage = uploadData.url; 
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
        body: JSON.stringify({ ...newProduct, price: finalPrice, image: finalImage }),
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

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf7f7] px-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm flex flex-col gap-5 border border-[#f5e1df]">
          <h2 className="text-3xl font-serif text-[#4a2c2a] text-center mb-2">Admin Login</h2>
          <input 
            type="text" 
            placeholder="Username" 
            required 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 border border-[#eed6d3] rounded-lg outline-none focus:border-[#a35d58]"
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-[#eed6d3] rounded-lg outline-none focus:border-[#a35d58]"
          />
          <button type="submit" className="py-3 bg-[#a35d58] text-white rounded-lg font-bold hover:bg-[#4a2c2a] transition-colors mt-2">
            Login
          </button>
        </form>
      </div>
    );
  }

  // --- ADMIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#fdf7f7] py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-[#f5e1df]">
          <h1 className="text-3xl font-serif text-[#4a2c2a]">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button onClick={() => setIsFormOpen(true)} className="px-6 py-2 bg-[#a35d58] text-white rounded-full font-bold uppercase tracking-widest text-sm shadow-md hover:bg-[#4a2c2a] transition-all">
              + Add Product
            </button>
            <button onClick={handleLogout} className="px-6 py-2 bg-transparent text-[#4a2c2a] border border-[#4a2c2a] rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#fceceb] transition-all">
              Logout
            </button>
          </div>
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-[#fdf7f7] p-8 rounded-2xl shadow-2xl max-w-md w-full border border-[#f5e1df] max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-serif text-[#4a2c2a] mb-6 text-center">Add New Creation</h3>
              <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
                <input type="text" placeholder="Product Name" required value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="p-3 border border-[#eed6d3] rounded-lg bg-white outline-none focus:border-[#a35d58] text-[#4a2c2a]" />
                <input type="text" placeholder="Price (Optional)" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="p-3 border border-[#eed6d3] rounded-lg bg-white outline-none focus:border-[#a35d58] text-[#4a2c2a]" />
                
                <div className="flex flex-col gap-2 p-3 bg-white border border-[#eed6d3] rounded-lg">
                  <label className="text-sm text-[#6b4441] font-bold">Image (Upload OR Paste Link)</label>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="text-sm text-[#4a2c2a] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#fceceb] file:text-[#a35d58] hover:file:bg-[#eed6d3]" />
                  <div className="text-center text-xs text-[#a35d58] my-1">OR</div>
                  <input type="text" placeholder="Paste Image URL here..." value={newProduct.image} onChange={(e) => { setNewProduct({...newProduct, image: e.target.value}); setSelectedFile(null); }} className="p-2 border border-[#eed6d3] rounded text-sm outline-none focus:border-[#a35d58]" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[#6b4441] font-bold">Image Display Adjust</label>
                  <select value={newProduct.imgPosition} onChange={(e) => setNewProduct({...newProduct, imgPosition: e.target.value})} className="p-3 border border-[#eed6d3] rounded-lg bg-white outline-none focus:border-[#a35d58] text-[#4a2c2a]">
                    <option value="center">Center (Default)</option>
                    <option value="top">Top (Varcha bhag dakhava)</option>
                    <option value="bottom">Bottom (Khalcha bhag dakhava)</option>
                  </select>
                </div>

                <textarea placeholder="Short Description" required rows={3} value={newProduct.desc} onChange={(e) => setNewProduct({...newProduct, desc: e.target.value})} className="p-3 border border-[#eed6d3] rounded-lg bg-white outline-none focus:border-[#a35d58] text-[#4a2c2a]"></textarea>
                
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {products.map((product) => (
              <div key={product._id} className="group bg-white rounded-xl p-4 shadow-sm border border-[#f5e1df] flex flex-col relative">
                <button 
                  onClick={() => handleDeleteProduct(product._id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md z-10"
                  title="Delete Product"
                >
                  ✕
                </button>
                <div className="w-full h-48 bg-[#fdf7f7] mb-4 relative rounded-lg overflow-hidden flex items-center justify-center">
                  <Image src={product.image || "/logo.jpg.jpeg"} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover", objectPosition: product.imgPosition || "center" }} />  
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-serif text-[#4a2c2a] mb-1">{product.name}</h3>
                  <span className="text-sm font-bold text-[#a35d58]">{product.price || 'No Price'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}