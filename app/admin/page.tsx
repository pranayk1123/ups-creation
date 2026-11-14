"use client"; 

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface ProductType {
  _id: string;
  name: string;
  price: string;
  desc: string;
  image: string;
  images?: string[]; 
  imgPosition: string;
}

// Helper Function for Price formatting
const formatPrice = (price: string) => {
  if (!price || price.trim() === '') return '';
  const lowerPrice = price.toLowerCase();
  if (lowerPrice.includes('rs') || lowerPrice.includes('₹') || lowerPrice.includes('rupee')) {
    return price;
  }
  return `₹ ${price}`;
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [products, setProducts] = useState<ProductType[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', desc: '', image: '', imgPosition: '50% 50%_1',
  });
  
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Live Image Preview & 3D Slider State
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imgPosX, setImgPosX] = useState<number>(50);
  const [imgPosY, setImgPosY] = useState<number>(50);
  const [imgScale, setImgScale] = useState<number>(1);

  // Touch and Drag states for interactive image adjustment
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [posStart, setPosStart] = useState({ x: 50, y: 50 });
  const [pinchStartDist, setPinchStartDist] = useState<number | null>(null);
  const [scaleStart, setScaleStart] = useState(1);

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

  // Fixed: Append new files to the array instead of replacing, to support multiple uploads properly
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
      setNewProduct({ ...newProduct, image: '' }); 
      setPreviewImage(URL.createObjectURL(filesArray[0]));
    }
  };

  const handleAddProductClick = () => {
    setEditingProductId(null);
    setNewProduct({ name: '', price: '', desc: '', image: '', imgPosition: '50% 50%_1' });
    setCurrentImages([]);
    setSelectedFiles([]);
    setPreviewImage(null);
    setImgPosX(50);
    setImgPosY(50);
    setImgScale(1);
    setIsFormOpen(true); 
  };

  const handleOpenEdit = (product: ProductType) => {
    setEditingProductId(product._id);
    setNewProduct({
      name: product.name,
      price: product.price === ' ' ? '' : product.price,
      desc: product.desc,
      image: '',
      imgPosition: product.imgPosition || '50% 50%_1',
    });
    
    const existingImages = product.images && product.images.length > 0 ? product.images : [product.image];
    setCurrentImages(existingImages);
    setPreviewImage(existingImages[0] || null);
    setSelectedFiles([]);
    
    let defaultX = 50;
    let defaultY = 50;
    let defaultScale = 1;
    
    if (product.imgPosition) {
      const parts = product.imgPosition.split('_');
      const posStr = parts[0];
      if (parts[1]) defaultScale = parseFloat(parts[1]);

      if (posStr === 'top') { defaultX = 50; defaultY = 0; }
      else if (posStr === 'bottom') { defaultX = 50; defaultY = 100; }
      else if (posStr === 'left') { defaultX = 0; defaultY = 50; }
      else if (posStr === 'right') { defaultX = 100; defaultY = 50; }
      else if (posStr.includes('%')) {
        const matches = posStr.match(/\d+/g);
        if (matches && matches.length >= 2) {
          defaultX = parseInt(matches[0]);
          defaultY = parseInt(matches[1]);
        } else if (matches && matches.length === 1) {
          defaultX = 50;
          defaultY = parseInt(matches[0]);
        }
      }
    }
    
    setImgPosX(defaultX);
    setImgPosY(defaultY);
    setImgScale(defaultScale);
    setIsFormOpen(true);
  };

  const handleRemoveExistingImage = (indexToRemove: number) => {
    const updatedImages = currentImages.filter((_, idx) => idx !== indexToRemove);
    setCurrentImages(updatedImages);
    if (updatedImages.length > 0) setPreviewImage(updatedImages[0]);
    else if (selectedFiles.length > 0) setPreviewImage(URL.createObjectURL(selectedFiles[0]));
    else setPreviewImage(null);
  };

  // Fixed: Allow removal of newly uploaded files from the preview queue
  const handleRemoveSelectedFile = (indexToRemove: number) => {
    const updatedFiles = selectedFiles.filter((_, idx) => idx !== indexToRemove);
    setSelectedFiles(updatedFiles);
    if (updatedFiles.length > 0) setPreviewImage(URL.createObjectURL(updatedFiles[0]));
    else if (currentImages.length > 0) setPreviewImage(currentImages[0]);
    else setPreviewImage(newProduct.image || null);
  };

  const resetForm = () => {
    setIsFormOpen(false); 
    setEditingProductId(null);
    setNewProduct({ name: '', price: '', desc: '', image: '', imgPosition: '50% 50%_1' });
    setCurrentImages([]);
    setSelectedFiles([]);
    setPreviewImage(null);
    setImgPosX(50);
    setImgPosY(50);
    setImgScale(1);
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
    const finalImgPosition = `${imgPosX}% ${imgPosY}%_${imgScale}`; 

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
          images: uploadedUrls,
          imgPosition: finalImgPosition
        }),
      });

      if (res.ok) {
        fetchProducts();
        resetForm();
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

  // --------------------------------------------------------
  // DRAG AND PINCH-TO-ZOOM LOGIC FOR IMAGE ADJUSTER
  // --------------------------------------------------------
  const getTouchDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setPinchStartDist(getTouchDistance(e.touches));
      setScaleStart(imgScale);
    } else if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setPosStart({ x: imgPosX, y: imgPosY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDist) {
      const currentDist = getTouchDistance(e.touches);
      const scaleDiff = (currentDist / pinchStartDist) - 1;
      const newScale = Math.min(Math.max(1, scaleStart + scaleDiff), 3);
      setImgScale(Number(newScale.toFixed(2)));
    } else if (e.touches.length === 1 && isDragging) {
      const deltaX = e.touches[0].clientX - dragStart.x;
      const deltaY = e.touches[0].clientY - dragStart.y;
      const sensitivity = 0.3; 
      const newX = Math.min(Math.max(0, posStart.x - deltaX * sensitivity), 100);
      const newY = Math.min(Math.max(0, posStart.y - deltaY * sensitivity), 100);
      setImgPosX(Math.round(newX));
      setImgPosY(Math.round(newY));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setPinchStartDist(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setPosStart({ x: imgPosX, y: imgPosY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    const sensitivity = 0.3; 
    const newX = Math.min(Math.max(0, posStart.x - deltaX * sensitivity), 100);
    const newY = Math.min(Math.max(0, posStart.y - deltaY * sensitivity), 100);
    setImgPosX(Math.round(newX));
    setImgPosY(Math.round(newY));
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    const scaleChange = e.deltaY * -0.002;
    setImgScale((prev) => Number(Math.min(Math.max(1, prev + scaleChange), 3).toFixed(2)));
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
        
        {/* Responsive Admin Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 sm:mb-10 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-[#f5e1df]">
          <h1 className="text-2xl sm:text-3xl font-serif text-[#4a2c2a]">Admin Dashboard</h1>
          <div className="flex flex-wrap justify-center gap-3 w-full sm:w-auto">
            <button onClick={handleAddProductClick} className="flex-1 sm:flex-none px-6 py-2.5 bg-[#a35d58] text-white rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm shadow-md hover:bg-[#4a2c2a] transition-all text-center">
              + Add Product
            </button>
            <button onClick={handleLogout} className="flex-1 sm:flex-none px-6 py-2.5 bg-transparent text-[#4a2c2a] border border-[#4a2c2a] rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm hover:bg-[#fceceb] transition-all text-center">
              Logout
            </button>
          </div>
        </div>

        {/* Add / Edit Modal Form */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-[#f5e1df] max-h-[92vh] overflow-y-auto">
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif text-[#4a2c2a]">{editingProductId ? 'Edit Creation' : 'Add New Creation'}</h3>
                <button onClick={resetForm} className="text-[#a35d58] hover:text-red-500 font-bold text-xl">✕</button>
              </div>

              <form onSubmit={handleSaveProduct} className="flex flex-col gap-5">
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#6b4441] uppercase tracking-wider">Product Name *</label>
                  <input type="text" placeholder="e.g. Daisy Handcrafted Hair Clip" required value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="p-3 border border-[#eed6d3] rounded-lg bg-[#fdf7f7] outline-none focus:border-[#a35d58] text-[#4a2c2a]" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#6b4441] uppercase tracking-wider">Price (Optional)</label>
                  <input type="text" placeholder="e.g. 299" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="p-3 border border-[#eed6d3] rounded-lg bg-[#fdf7f7] outline-none focus:border-[#a35d58] text-[#4a2c2a]" />
                </div>
                
                {/* Image Upload Section */}
                <div className="flex flex-col gap-3 p-4 bg-[#fdf7f7] border border-[#eed6d3] rounded-xl">
                  <label className="text-sm text-[#4a2c2a] font-bold">Upload Photos</label>
                  
                  {/* Fixed: Display BOTH existing images and newly selected files */}
                  {(currentImages.length > 0 || selectedFiles.length > 0) && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {/* Existing DB Images */}
                      {currentImages.map((imgUrl, idx) => (
                        <div key={`existing-${idx}`} className="relative w-14 h-14 rounded-md overflow-hidden border border-[#a35d58]/40 shadow-sm cursor-pointer" onClick={() => setPreviewImage(imgUrl)}>
                          <img src={imgUrl} alt={`Current ${idx}`} className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); handleRemoveExistingImage(idx); }}
                            className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-[10px] font-bold hover:bg-red-700"
                          >✕</button>
                        </div>
                      ))}
                      {/* Newly Uploaded Files */}
                      {selectedFiles.map((file, idx) => {
                        const tempUrl = URL.createObjectURL(file);
                        return (
                          <div key={`new-${idx}`} className="relative w-14 h-14 rounded-md overflow-hidden border border-[#a35d58]/40 shadow-sm cursor-pointer" onClick={() => setPreviewImage(tempUrl)}>
                            <img src={tempUrl} alt={`New ${idx}`} className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={(e) => { e.stopPropagation(); handleRemoveSelectedFile(idx); }}
                              className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-[10px] font-bold hover:bg-red-700"
                            >✕</button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="text-sm text-[#4a2c2a] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-[#4a2c2a] file:text-white hover:file:bg-[#a35d58] cursor-pointer" />
                  
                  <div className="text-center text-xs text-[#a35d58] font-bold">OR</div>
                  
                  <input type="text" placeholder="Paste Image URL here..." value={newProduct.image} onChange={(e) => { 
                    setNewProduct({...newProduct, image: e.target.value}); 
                    setPreviewImage(e.target.value); 
                  }} className="p-2.5 border border-[#eed6d3] rounded-lg bg-white text-sm outline-none focus:border-[#a35d58]" />
                </div>

                {/* 3D Live Image Position Preview & Adjuster */}
                <div className="flex flex-col gap-3 p-4 bg-white border border-[#eed6d3] rounded-xl shadow-sm">
                  <div className="flex flex-col">
                    <label className="text-sm text-[#4a2c2a] font-bold">Interactive Adjuster</label>
                    <p className="text-[10px] text-[#6b4441] mt-0.5">Drag to move or pinch to zoom (works on mobile too), or use the sliders.</p>
                  </div>

                  <div 
                    ref={previewRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onWheel={handleWheel}
                    className="relative w-full h-44 sm:h-80 bg-[#fdf7f7] rounded-lg overflow-hidden border border-[#eed6d3] cursor-move touch-none shadow-inner"
                  >
                    {previewImage ? (
                      /* Fixed: Replaced Next.js <Image> with native <img> in admin preview to prevent URL crashing errors instantly */
                      <img
                        src={previewImage}
                        alt="Live Preview"
                        className="absolute w-full h-full object-cover pointer-events-none"
                        style={{ 
                          objectPosition: `${imgPosX}% ${imgPosY}%`,
                          transformOrigin: `${imgPosX}% ${imgPosY}%`, 
                          transform: `scale(${imgScale})`
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-xs text-[#a35d58]/60 font-bold">
                        <span className="text-3xl mb-2">🖼️</span> No image selected
                      </div>
                    )}
                  </div>

                  {previewImage && (
                    <div className="flex flex-col gap-4 mt-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-bold text-[#a35d58] uppercase tracking-widest px-1">
                          <span>Left</span><span>Horizontal (X)</span><span>Right</span>
                        </div>
                        <input type="range" min="0" max="100" value={imgPosX} onChange={(e) => setImgPosX(Number(e.target.value))} className="w-full h-2 bg-[#eed6d3] rounded-lg appearance-none cursor-pointer accent-[#a35d58]" />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-bold text-[#a35d58] uppercase tracking-widest px-1">
                          <span>Top</span><span>Vertical (Y)</span><span>Bottom</span>
                        </div>
                        <input type="range" min="0" max="100" value={imgPosY} onChange={(e) => setImgPosY(Number(e.target.value))} className="w-full h-2 bg-[#eed6d3] rounded-lg appearance-none cursor-pointer accent-[#a35d58]" />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-bold text-[#a35d58] uppercase tracking-widest px-1">
                          <span>Default</span><span>Zoom (3D Scale)</span><span>Zoomed In</span>
                        </div>
                        <input type="range" min="1" max="3" step="0.05" value={imgScale} onChange={(e) => setImgScale(Number(e.target.value))} className="w-full h-2 bg-[#eed6d3] rounded-lg appearance-none cursor-pointer accent-[#a35d58]" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#6b4441] uppercase tracking-wider">Short Description *</label>
                  <textarea placeholder="Tell your customers about this beautiful creation..." required rows={3} value={newProduct.desc} onChange={(e) => setNewProduct({...newProduct, desc: e.target.value})} className="p-3 border border-[#eed6d3] rounded-lg bg-[#fdf7f7] outline-none focus:border-[#a35d58] text-[#4a2c2a] resize-none"></textarea>
                </div>
                
                <div className="flex gap-4 mt-2">
                  <button type="button" onClick={resetForm} className="flex-1 py-3.5 text-[#4a2c2a] bg-[#fdf7f7] border border-[#eed6d3] rounded-xl font-bold hover:bg-[#fceceb] hover:border-[#a35d58] transition-colors uppercase tracking-widest text-xs">Cancel</button>
                  <button type="submit" className="flex-1 py-3.5 text-white bg-[#a35d58] rounded-xl font-bold hover:bg-[#4a2c2a] transition-colors uppercase tracking-widest text-xs shadow-md">Save Creation</button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Product Grid */}
        {isLoading ? (
          <div className="text-center text-[#a35d58] font-bold my-20 animate-pulse text-lg tracking-widest uppercase">Loading creations...</div>
        ) : products.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-2xl border border-[#f5e1df] max-w-lg mx-auto mt-10 shadow-sm">
            <p className="text-3xl mb-3">🧶</p>
            <p className="text-[#4a2c2a] font-serif text-lg">No products added yet.</p>
            <p className="text-sm text-[#6b4441] mt-1">Click '+ Add Product' to build your collection.</p>
          </div>
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

// Admin Product Card Component
function AdminProductCard({ product, handleDeleteProduct, handleOpenEdit }: { product: ProductType, handleDeleteProduct: (id: string) => void, handleOpenEdit: (p: ProductType) => void }) {
  const [activeImage, setActiveImage] = useState(product.images?.[0] || product.image || "/logo.jpg.jpeg");

  const posParts = (product.imgPosition || "50% 50%_1").split('_');
  const objPos = posParts[0];
  const objScale = posParts[1] || '1';

  return (
    <div className="group bg-white rounded-2xl p-3 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-500 border border-[#f5e1df] flex flex-col relative overflow-hidden">
      
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-2 z-20">
        <button onClick={() => handleOpenEdit(product)} className="w-8 h-8 sm:w-9 sm:h-9 bg-white/90 backdrop-blur text-[#4a2c2a] border border-[#eed6d3] rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#4a2c2a] hover:text-white hover:border-transparent shadow-sm text-sm" title="Edit Product">
          ✎
        </button>
        <button onClick={() => handleDeleteProduct(product._id)} className="w-8 h-8 sm:w-9 sm:h-9 bg-white/90 backdrop-blur text-red-500 border border-[#eed6d3] rounded-full flex items-center justify-center transition-all duration-300 hover:bg-red-500 hover:text-white hover:border-transparent shadow-sm text-sm font-bold" title="Delete Product">
          ✕
        </button>
      </div>
      
      <div className="w-full h-44 sm:h-80 bg-[#fdf7f7] mb-3 sm:mb-4 relative overflow-hidden rounded-lg flex items-center justify-center border border-[#f5e1df]">
        <Image 
          src={activeImage} 
          alt={product.name} 
          fill 
          sizes="(max-width: 768px) 50vw, 33vw" 
          style={{ 
            objectFit: "cover", 
            objectPosition: objPos,
            transformOrigin: objPos, 
            transform: `scale(${objScale})` 
          }} 
          className="transition-transform duration-500 group-hover:opacity-90" 
        />  
      </div>

      {product.images && product.images.length > 1 && (
        <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4 overflow-x-auto pb-1 scrollbar-thin">
          {product.images.map((imgUrl, i) => (
            <div 
              key={i} 
              onClick={() => setActiveImage(imgUrl)}
              className={`relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-lg border-2 overflow-hidden bg-[#fdf7f7] cursor-pointer transition-all ${activeImage === imgUrl ? 'border-[#a35d58] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <Image src={imgUrl} alt={`Thumb ${i}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="text-center flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-base sm:text-xl font-serif text-[#4a2c2a] mb-1 line-clamp-1">{product.name}</h3>
          {product.price && product.price.trim() !== '' && (
            <span className="text-sm sm:text-lg font-medium text-[#8c4f4a] tracking-wide">{formatPrice(product.price)}</span>
          )}
        </div>
        <p className="text-[10px] sm:text-xs text-[#a35d58] mt-3 font-bold uppercase tracking-widest bg-[#fceceb] inline-block px-3 py-1 rounded-full mx-auto">
          {product.images && product.images.length > 1 ? `${product.images.length} Photos` : '1 Photo'}
        </p>
      </div>
    </div>
  );
}