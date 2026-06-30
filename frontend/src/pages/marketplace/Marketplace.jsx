import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, Tag, MessageCircle, Plus, X, Upload, Edit, Trash2 } from 'lucide-react';
import api from '../../lib/api.js';
import { useAuthStore } from '../../store/authStore.js';
import toast from 'react-hot-toast';

const Marketplace = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('book');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('good');
  const [location, setLocation] = useState('');
  const [negotiable, setNegotiable] = useState(false);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeCategory) params.category = activeCategory;
      if (search) params.search = search;
      
      const response = await api.get('/marketplace', { params });
      setItems(response.data.data);
    } catch (error) {
      console.error('Error fetching marketplace items:', error);
      toast.error('Failed to load marketplace listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const openCreateModal = () => {
    setEditId(null);
    setTitle('');
    setDescription('');
    setCategory('book');
    setPrice('');
    setCondition('good');
    setLocation('');
    setNegotiable(false);
    setImages([]);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditId(item._id);
    setTitle(item.title);
    setDescription(item.description);
    setCategory(item.category);
    setPrice(item.price.toString());
    setCondition(item.condition);
    setLocation(item.location);
    setNegotiable(item.negotiable);
    setImages([]); // Editing images not supported in simple PUT route yet
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.delete(`/marketplace/${id}`);
      toast.success('Listing deleted successfully');
      fetchItems();
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error(error.response?.data?.message || 'Failed to delete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to create or edit a listing');
      return;
    }

    setSubmitting(true);
    try {
      if (editId) {
        // Send JSON for PUT request since backend route doesn't have multer for PUT
        const payload = {
          title,
          description,
          category,
          price: parseFloat(price),
          condition,
          location,
          negotiable,
        };
        await api.put(`/marketplace/${editId}`, payload);
        toast.success('Listing updated successfully!');
      } else {
        // Send FormData for POST request
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('condition', condition);
        formData.append('location', location);
        formData.append('negotiable', negotiable);
        
        images.forEach((image) => {
          formData.append('images', image);
        });

        await api.post('/marketplace', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Listing created successfully!');
      }
      
      setShowModal(false);
      fetchItems();
    } catch (error) {
      console.error('Failed to create/edit listing:', error);
      toast.error(error.response?.data?.message || 'Failed to process request');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { value: '', label: 'All Items' },
    { value: 'book', label: 'Books' },
    { value: 'calculator', label: 'Calculators' },
    { value: 'lab-equipment', label: 'Lab Tools' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Buy & Sell Marketplace</h1>
          <p className="text-gray-400 mt-1">Buy or sell second-hand course books, calculators, and lab equipments.</p>
        </div>
        {isAuthenticated && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-full font-medium transition-colors shadow-lg shadow-violet-500/20"
          >
            <Plus className="h-4 w-4" /> Create Listing
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setActiveCategory(c.value)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                activeCategory === c.value
                  ? 'bg-violet-600 text-white border-violet-500 shadow-md'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
        </form>
      </div>

      {/* Listing Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-[#0F0F23] border border-white/5 rounded-2xl">
          <ShoppingBag className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">No Listings Found</h3>
          <p className="text-gray-400 mt-1">Be the first to list a second-hand item for sale.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-[#0F0F23] border border-white/5 hover:border-violet-500/25 rounded-2xl p-6 flex flex-col justify-between gap-4 transition-all">
              <div className="space-y-3">
                <div className="relative aspect-video bg-[#0A0A1B] rounded-xl flex items-center justify-center border border-white/5 overflow-hidden">
                  {item.images && item.images.length > 0 ? (
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingBag className="h-10 w-10 text-violet-500" />
                  )}
                  
                  {/* Edit/Delete Buttons */}
                  {((user?._id === item.seller?._id || user?.id === item.seller?._id) || user?.role === 'admin') && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button 
                        onClick={() => openEditModal(item)} 
                        className="p-1.5 bg-black/60 backdrop-blur-sm text-gray-300 hover:text-white rounded-md transition-colors"
                        title="Edit Listing"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)} 
                        className="p-1.5 bg-black/60 backdrop-blur-sm text-gray-300 hover:text-rose-500 rounded-md transition-colors"
                        title="Delete Listing"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                <h4 className="text-lg font-bold text-white leading-snug line-clamp-1">{item.title}</h4>
                <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="font-semibold text-violet-400 text-sm">₹{item.price}</span>
                  <span className="px-2.5 py-0.5 bg-white/5 text-gray-400 rounded-full border border-white/10 text-[10px] uppercase font-semibold">
                    {item.condition}
                  </span>
                </div>
              </div>
              <div className="border-t border-white/5 pt-4 flex justify-between items-center text-xs">
                <span className="text-gray-400">Seller: {item.seller?.name || 'Student'}</span>
                {item.seller?.profile?.phone ? (
                  <a href={`tel:${item.seller.profile.phone}`} className="flex items-center gap-1 text-violet-400 hover:underline">
                    <MessageCircle className="h-4 w-4" /> Call Seller
                  </a>
                ) : (
                  <span className="text-gray-500 italic">No contact set</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Listing Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F0F23] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">{editId ? 'Edit' : 'Create New'} Listing</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Product Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. CASIO Scientific Calculator fx-991EX"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</label>
                <textarea
                  placeholder="Provide details about condition, usage time, and pick-up details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 h-24 resize-none transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                  >
                    <option value="book" className="bg-[#0F0F23]">Book</option>
                    <option value="calculator" className="bg-[#0F0F23]">Calculator</option>
                    <option value="lab-equipment" className="bg-[#0F0F23]">Lab Tool / Equipment</option>
                    <option value="electronics" className="bg-[#0F0F23]">Electronics</option>
                    <option value="other" className="bg-[#0F0F23]">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                  >
                    <option value="new" className="bg-[#0F0F23]">Brand New</option>
                    <option value="like-new" className="bg-[#0F0F23]">Like New</option>
                    <option value="good" className="bg-[#0F0F23]">Good</option>
                    <option value="fair" className="bg-[#0F0F23]">Fair</option>
                    <option value="poor" className="bg-[#0F0F23]">Poor</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pick-up Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Hostel-3 Lobby or Campus Gate"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Image Picker (Only for Create) */}
              {!editId && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Upload Product Images</label>
                  <div className="border border-dashed border-white/10 hover:border-violet-500/30 rounded-xl p-4 text-center bg-white/5 cursor-pointer relative transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="h-6 w-6 text-violet-500" />
                      <p className="text-xs text-white font-medium">
                        {images.length > 0 ? `${images.length} files selected` : 'Click to select product photos'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={negotiable}
                  onChange={(e) => setNegotiable(e.target.checked)}
                  className="h-4 w-4 rounded border-white/10 bg-white/5 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
                <label htmlFor="negotiable" className="text-sm text-gray-300 cursor-pointer select-none">
                  Price is Negotiable
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 mt-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50"
              >
                {submitting ? 'Processing...' : (editId ? 'Update Listing' : 'List Item for Sale')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
