import React, { useEffect, useState } from 'react';
import { Lightbulb, Code, Plus, X, Edit, Trash2, ExternalLink, Github, Users } from 'lucide-react';
import api from '../../lib/api.js';
import { useAuthStore } from '../../store/authStore.js';
import toast from 'react-hot-toast';

const DIFFICULTY_COLORS = {
  beginner: 'bg-emerald-500/10 text-emerald-400',
  intermediate: 'bg-cyan-500/10 text-cyan-400',
  advanced: 'bg-rose-500/10 text-rose-400',
};

const initialForm = {
  title: '', description: '', type: 'project', difficulty: 'intermediate',
  techStack: '', githubUrl: '', liveUrl: '', isOpen: false,
};

const ResearchHub = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';
  const [activeTab, setActiveTab] = useState('projects');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const typeFilter = activeTab === 'projects' ? 'project' : activeTab === 'collab' ? 'collaboration' : 'idea';

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/research', { params: { type: typeFilter } });
      setItems(res.data.data || []);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [activeTab]);

  const openCreate = () => {
    setEditId(null);
    setForm({ ...initialForm, type: typeFilter });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditId(item._id);
    setForm({
      title: item.title || '',
      description: item.description || '',
      type: item.type || typeFilter,
      difficulty: item.difficulty || 'intermediate',
      techStack: (item.techStack || []).join(', '),
      githubUrl: item.githubUrl || '',
      liveUrl: item.liveUrl || '',
      isOpen: item.isOpen || false,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await api.delete(`/research/${id}`);
      toast.success('Deleted successfully');
      fetchItems();
    } catch (e) { toast.error(e.response?.data?.message || 'Delete failed'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (editId) {
        await api.put(`/research/${editId}`, payload);
        toast.success('Updated successfully!');
      } else {
        await api.post('/research', payload);
        toast.success('Posted successfully!');
      }
      setShowModal(false);
      fetchItems();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to save'); }
    finally { setSubmitting(false); }
  };

  const tabs = [
    { key: 'projects', label: 'Student Projects' },
    { key: 'collab', label: 'Open Collaborations' },
    { key: 'ideas', label: 'Project Ideas' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Research & Student Projects</h1>
          <p className="text-gray-400 mt-1">Discover projects, find collaborators, and explore innovative ideas.</p>
        </div>
        {isAdmin && (
          <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-full font-medium transition-colors shadow-lg shadow-violet-500/20">
            <Plus className="h-4 w-4" /> Add Entry
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

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-[#0F0F23] border border-white/5 rounded-2xl">
          <Lightbulb className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">No Entries Yet</h3>
          <p className="text-gray-400 mt-1">{isAdmin ? 'Click "Add Entry" to post the first one.' : 'Check back soon!'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item._id} className="bg-[#0F0F23] border border-white/5 hover:border-violet-500/25 rounded-2xl p-6 flex flex-col justify-between gap-4 transition-all">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase ${DIFFICULTY_COLORS[item.difficulty] || 'bg-white/5 text-gray-400'}`}>
                    {item.difficulty}
                  </span>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(item)} className="text-gray-400 hover:text-white transition-colors"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(item._id)} className="text-gray-400 hover:text-rose-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  )}
                </div>
                <h4 className="text-lg font-bold text-white">{item.title}</h4>
                <p className="text-sm text-gray-400 line-clamp-3">{item.description}</p>
                {item.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.techStack.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 bg-violet-500/10 text-violet-400 rounded-full">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t border-white/5 pt-4 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="h-3.5 w-3.5" />
                  <span>{item.teamMembers?.length || 1} member{item.teamMembers?.length !== 1 ? 's' : ''}</span>
                  {item.isOpen && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full">Open</span>}
                </div>
                <div className="flex gap-2">
                  {item.githubUrl && (
                    <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Github className="h-4 w-4" /></a>
                  )}
                  {item.liveUrl && (
                    <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline flex items-center gap-1 text-xs">View <ExternalLink className="h-3 w-3" /></a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F0F23] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">{editId ? 'Edit' : 'Add'} Entry</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. AI Attendance System" required
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description *</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Describe the project, collaboration, or idea..." required
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 h-24 resize-none transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer">
                    <option value="project" className="bg-[#0F0F23]">Project</option>
                    <option value="collaboration" className="bg-[#0F0F23]">Collaboration</option>
                    <option value="idea" className="bg-[#0F0F23]">Idea</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Difficulty</label>
                  <select value={form.difficulty} onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer">
                    <option value="beginner" className="bg-[#0F0F23]">Beginner</option>
                    <option value="intermediate" className="bg-[#0F0F23]">Intermediate</option>
                    <option value="advanced" className="bg-[#0F0F23]">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tech Stack (comma separated)</label>
                <input type="text" value={form.techStack} onChange={e => setForm(p => ({ ...p, techStack: e.target.value }))}
                  placeholder="e.g. React, Node.js, MongoDB"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">GitHub URL</label>
                  <input type="url" value={form.githubUrl} onChange={e => setForm(p => ({ ...p, githubUrl: e.target.value }))}
                    placeholder="https://github.com/..."
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Live URL</label>
                  <input type="url" value={form.liveUrl} onChange={e => setForm(p => ({ ...p, liveUrl: e.target.value }))}
                    placeholder="https://..."
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isOpen" checked={form.isOpen} onChange={e => setForm(p => ({ ...p, isOpen: e.target.checked }))}
                  className="h-4 w-4 rounded border-white/10 bg-white/5 text-violet-600 focus:ring-violet-500 cursor-pointer" />
                <label htmlFor="isOpen" className="text-sm text-gray-300 cursor-pointer">Open for Collaboration</label>
              </div>
              <button type="submit" disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50">
                {submitting ? 'Saving...' : (editId ? 'Update Entry' : 'Post Entry')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchHub;
