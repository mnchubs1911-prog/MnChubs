import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, X, Edit, Trash2, ExternalLink } from 'lucide-react';
import api from '../../lib/api.js';
import { useAuthStore } from '../../store/authStore.js';
import toast from 'react-hot-toast';

const VERDICT_COLORS = {
  selected: 'bg-emerald-500/10 text-emerald-400',
  rejected: 'bg-rose-500/10 text-rose-400',
  pending: 'bg-yellow-500/10 text-yellow-400',
};

const DSA_SHEETS = [
  { title: 'Striver SDE Sheet', platform: 'Leetcode / GFG', count: '180 Problems', url: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/' },
  { title: 'Love Babbar DSA Sheet', platform: 'GFG', count: '450 Problems', url: 'https://450dsa.com/' },
  { title: 'Neetcode 150', platform: 'Neetcode.io', count: '150 Problems', url: 'https://neetcode.io/practice' },
  { title: 'Blind 75', platform: 'Leetcode', count: '75 Problems', url: 'https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions' },
];

const ROADMAPS = [
  { title: 'Web Development', desc: 'Full-stack development path from HTML to React & Node.js', url: 'https://roadmap.sh/full-stack' },
  { title: 'Machine Learning', desc: 'ML & AI fundamentals to advanced model deployment', url: 'https://roadmap.sh/mlops' },
  { title: 'Android Development', desc: 'Android app development with Kotlin and Jetpack', url: 'https://roadmap.sh/android' },
  { title: 'Cyber Security', desc: 'Ethical hacking, networking, cryptography essentials', url: 'https://roadmap.sh/cyber-security' },
];

const initialForm = {
  companyName: '', role: '', type: 'internship', experience: '',
  stipend: '', duration: '', verdict: 'selected', tips: '', tags: '', year: new Date().getFullYear().toString(),
};

const PlacementHub = () => {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';
  const [activeTab, setActiveTab] = useState('experiences');
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const res = await api.get('/placements');
      setExperiences(res.data.data || []);
    } catch {
      toast.error('Failed to load placement experiences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExperiences(); }, []);

  const openCreate = () => { setEditId(null); setForm(initialForm); setShowModal(true); };

  const openEdit = (exp) => {
    setEditId(exp._id);
    setForm({
      companyName: exp.companyName || '',
      role: exp.role || '',
      type: exp.type || 'internship',
      experience: exp.experience || '',
      stipend: exp.stipend || '',
      duration: exp.duration || '',
      verdict: exp.verdict || 'selected',
      tips: exp.tips || '',
      tags: (exp.tags || []).join(', '),
      year: exp.year?.toString() || new Date().getFullYear().toString(),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this placement experience?')) return;
    try {
      await api.delete(`/placements/${id}`);
      toast.success('Deleted successfully');
      fetchExperiences();
    } catch (e) { toast.error(e.response?.data?.message || 'Delete failed'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, year: parseInt(form.year), tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      if (editId) {
        await api.put(`/placements/${editId}`, payload);
        toast.success('Experience updated!');
      } else {
        await api.post('/placements', payload);
        toast.success('Experience posted!');
      }
      setShowModal(false);
      fetchExperiences();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to save'); }
    finally { setSubmitting(false); }
  };

  const tabs = [
    { key: 'experiences', label: 'Interview & OA Experiences' },
    { key: 'dsa', label: 'DSA & Aptitude' },
    { key: 'roadmaps', label: 'Roadmaps & Templates' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Placements & Internships</h1>
          <p className="text-gray-400 mt-1">Access interview logs, OA experiences, DSA sheets, and career roadmaps.</p>
        </div>
        {isAdmin && activeTab === 'experiences' && (
          <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-full font-medium transition-colors shadow-lg shadow-violet-500/20">
            <Plus className="h-4 w-4" /> Add Experience
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 space-x-6 text-sm font-semibold overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`pb-4 border-b-2 whitespace-nowrap transition-colors ${activeTab === t.key ? 'text-violet-400 border-violet-500' : 'text-gray-400 border-transparent hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Experiences Tab */}
      {activeTab === 'experiences' && (
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500" />
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-20 bg-[#0F0F23] border border-white/5 rounded-2xl">
              <Briefcase className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white">No Experiences Yet</h3>
              <p className="text-gray-400 mt-1">{isAdmin ? 'Click "Add Experience" to post the first one.' : 'Check back soon for interview experiences.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {experiences.map(exp => (
                <div key={exp._id} className="bg-[#0F0F23] border border-white/5 hover:border-violet-500/25 rounded-2xl p-6 space-y-4 flex flex-col justify-between transition-all">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="text-lg font-bold text-white">{exp.companyName} — {exp.role}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">{exp.year} • {exp.type} {exp.stipend ? `• ₹${exp.stipend}/mo` : ''}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${VERDICT_COLORS[exp.verdict] || 'bg-white/5 text-gray-400'}`}>
                          {exp.verdict}
                        </span>
                        {isAdmin && (
                          <>
                            <button onClick={() => openEdit(exp)} className="text-gray-400 hover:text-white transition-colors"><Edit className="h-4 w-4" /></button>
                            <button onClick={() => handleDelete(exp._id)} className="text-gray-400 hover:text-rose-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-3">{exp.experience}</p>
                    {exp.tips && <p className="text-xs text-violet-400 italic">💡 Tip: {exp.tips}</p>}
                    {exp.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {exp.tags.map(tag => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 bg-white/5 text-gray-400 rounded-full border border-white/5">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="border-t border-white/5 pt-4 text-xs text-gray-400">
                    Shared by: <span className="text-white font-medium">{exp.author?.name || 'Admin'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DSA Tab */}
      {activeTab === 'dsa' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DSA_SHEETS.map((sheet, i) => (
            <div key={i} className="bg-[#0F0F23] border border-white/5 hover:border-violet-500/25 rounded-2xl p-6 flex flex-col justify-between gap-4 transition-all">
              <div>
                <h4 className="text-base font-bold text-white">{sheet.title}</h4>
                <p className="text-xs text-gray-400 mt-1">Platform: {sheet.platform}</p>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-4 text-xs">
                <span className="text-gray-400 font-semibold">{sheet.count}</span>
                <a href={sheet.url} target="_blank" rel="noopener noreferrer" className="text-violet-400 flex items-center gap-1 hover:underline">
                  Practice <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Roadmaps Tab */}
      {activeTab === 'roadmaps' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROADMAPS.map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
              className="bg-[#0F0F23] border border-white/5 hover:border-violet-500/30 rounded-2xl p-6 text-center cursor-pointer transition-colors group">
              <Briefcase className="h-10 w-10 text-violet-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-white">{r.title}</h4>
              <p className="text-xs text-gray-400 mt-1">{r.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs text-violet-400">View Roadmap <ExternalLink className="h-3 w-3" /></span>
            </a>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F0F23] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">{editId ? 'Edit' : 'Add'} Placement Experience</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {[
                { label: 'Company Name', key: 'companyName', placeholder: 'e.g. Google', required: true },
                { label: 'Role', key: 'role', placeholder: 'e.g. SDE Intern', required: true },
                { label: 'Stipend (₹/mo)', key: 'stipend', placeholder: 'e.g. 80000' },
                { label: 'Duration', key: 'duration', placeholder: 'e.g. 2 months' },
                { label: 'Tags (comma separated)', key: 'tags', placeholder: 'e.g. DSA, System Design' },
                { label: 'Year', key: 'year', placeholder: '2026' },
              ].map(f => (
                <div key={f.key} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{f.label}</label>
                  <input type="text" value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder} required={f.required}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer">
                    <option value="internship" className="bg-[#0F0F23]">Internship</option>
                    <option value="placement" className="bg-[#0F0F23]">Full-time Placement</option>
                    <option value="oa" className="bg-[#0F0F23]">Online Assessment</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Verdict</label>
                  <select value={form.verdict} onChange={e => setForm(p => ({ ...p, verdict: e.target.value }))}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer">
                    <option value="selected" className="bg-[#0F0F23]">Selected</option>
                    <option value="rejected" className="bg-[#0F0F23]">Rejected</option>
                    <option value="pending" className="bg-[#0F0F23]">Pending</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Detailed Experience *</label>
                <textarea value={form.experience} onChange={e => setForm(p => ({ ...p, experience: e.target.value }))}
                  placeholder="Describe the interview rounds, questions asked, your approach..." required
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 h-28 resize-none transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tips for Future Students</label>
                <textarea value={form.tips} onChange={e => setForm(p => ({ ...p, tips: e.target.value }))}
                  placeholder="Key tips to crack this company's interview..."
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 h-20 resize-none transition-colors" />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50">
                {submitting ? 'Saving...' : (editId ? 'Update Experience' : 'Post Experience')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementHub;
