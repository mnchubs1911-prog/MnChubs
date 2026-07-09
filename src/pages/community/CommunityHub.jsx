import React, { useEffect, useState } from 'react';
import { MessageSquare, Users, Plus, X, Edit, Trash2, Search, BookOpen } from 'lucide-react';
import api from '../../lib/api.js';
import { useAuthStore } from '../../store/authStore.js';
import toast from 'react-hot-toast';

const CATEGORY_COLORS = {
  announcement: 'bg-rose-500/10 text-rose-400',
  doubt: 'bg-cyan-500/10 text-cyan-400',
  general: 'bg-violet-500/10 text-violet-400',
  discussion: 'bg-amber-500/10 text-amber-400',
};

const initialPostForm = { title: '', content: '', category: 'general', isAnonymous: false };

const CommunityHub = () => {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';
  const [activeTab, setActiveTab] = useState('forum');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialPostForm);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      const res = await api.get('/forum', { params });
      setPosts(res.data.data || []);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const openCreate = () => { setEditId(null); setForm(initialPostForm); setShowModal(true); };

  const openEdit = (post) => {
    setEditId(post._id);
    setForm({
      title: post.title || '',
      content: post.content || '',
      category: post.category || 'general',
      isAnonymous: post.isAnonymous || false,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/forum/${id}`);
      toast.success('Post deleted');
      fetchPosts();
    } catch (e) { toast.error(e.response?.data?.message || 'Delete failed'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        await api.put(`/forum/${editId}`, form);
        toast.success('Post updated!');
      } else {
        await api.post('/forum', form);
        toast.success('Post created!');
      }
      setShowModal(false);
      fetchPosts();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to save'); }
    finally { setSubmitting(false); }
  };

  const handleVote = async (postId) => {
    if (!isAuthenticated) { toast.error('Please log in to vote'); return; }
    try {
      await api.post(`/forum/${postId}/upvote`);
      fetchPosts();
    } catch { toast.error('Vote failed'); }
  };

  const tabs = [
    { key: 'forum', label: 'Ask Seniors Forum' },
    { key: 'branch', label: 'Branch Boards' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Student Community</h1>
          <p className="text-gray-400 mt-1">Ask doubts, discuss topics, and connect with your branch peers.</p>
        </div>
        {isAuthenticated && (
          <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-full font-medium transition-colors shadow-lg shadow-violet-500/20">
            <Plus className="h-4 w-4" /> New Post
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 space-x-6 text-sm font-semibold">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`pb-4 border-b-2 transition-colors ${activeTab === t.key ? 'text-violet-400 border-violet-500' : 'text-gray-400 border-transparent hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Forum Tab */}
      {activeTab === 'forum' && (
        <div className="space-y-4">
          {/* Search */}
          <form onSubmit={e => { e.preventDefault(); fetchPosts(); }} className="relative">
            <input type="text" placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors" />
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          </form>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-[#0F0F23] border border-white/5 rounded-2xl">
              <BookOpen className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white">No Posts Yet</h3>
              <p className="text-gray-400 mt-1">Be the first to ask a question or start a discussion!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post._id} className="bg-[#0F0F23] border border-white/5 hover:border-violet-500/25 rounded-2xl p-6 flex justify-between items-center gap-4 transition-all">
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase ${CATEGORY_COLORS[post.category] || 'bg-white/5 text-gray-400'}`}>
                        {post.category}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white hover:text-violet-400 cursor-pointer transition-colors">{post.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-2">{post.content}</p>
                    <p className="text-xs text-gray-500">
                      By <span className="text-gray-300">{post.isAnonymous ? 'Anonymous' : (post.author?.name || 'Student')}</span>
                      {' • '}{post.comments?.length || 0} replies
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3 shrink-0">
                    <button onClick={() => handleVote(post._id)}
                      className="text-center bg-white/5 hover:bg-violet-500/10 px-4 py-2 rounded-xl border border-white/5 hover:border-violet-500/20 transition-all cursor-pointer">
                      <p className="text-lg font-extrabold text-white">{post.upvotes?.length || 0}</p>
                      <p className="text-[10px] text-gray-400">Votes</p>
                    </button>
                    {(user?.id === post.author?._id || user?._id === post.author?._id || isAdmin) && (
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(post)} className="text-gray-400 hover:text-white transition-colors"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(post._id)} className="text-gray-400 hover:text-rose-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Branch Board Tab */}
      {activeTab === 'branch' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {['MnC'].map(branch => (
            <div key={branch} className="bg-[#0F0F23] border border-white/5 hover:border-violet-500/30 rounded-2xl p-8 text-center cursor-pointer transition-colors">
              <MessageSquare className="h-12 w-12 text-violet-400 mx-auto mb-4" />
              <h4 className="font-bold text-white text-xl">Mathematics & Computing (MnC)</h4>
              <p className="text-sm text-gray-400 mt-2">Discuss topics, ask doubts, and share updates specific to the MnC branch.</p>
              <button onClick={() => setActiveTab('forum')} className="mt-4 px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm transition-colors">
                Go to Forum
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F0F23] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">{editId ? 'Edit Post' : 'New Post'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. How to prepare for Compiler Design?" required
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Content *</label>
                <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  placeholder="Describe your question or discussion topic..." required
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 h-28 resize-none transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer">
                  <option value="general" className="bg-[#0F0F23]">General</option>
                  <option value="doubt" className="bg-[#0F0F23]">Doubt</option>
                  <option value="discussion" className="bg-[#0F0F23]">Discussion</option>
                  <option value="announcement" className="bg-[#0F0F23]">Announcement</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isAnon" checked={form.isAnonymous} onChange={e => setForm(p => ({ ...p, isAnonymous: e.target.checked }))}
                  className="h-4 w-4 rounded border-white/10 bg-white/5 text-violet-600 focus:ring-violet-500 cursor-pointer" />
                <label htmlFor="isAnon" className="text-sm text-gray-300 cursor-pointer">Post Anonymously</label>
              </div>
              <button type="submit" disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50">
                {submitting ? 'Posting...' : (editId ? 'Update Post' : 'Post')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityHub;
