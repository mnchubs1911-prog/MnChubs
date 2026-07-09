import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Bell, Shield, Award, Plus, X, AlertCircle, Edit, Trash2, Upload, FileText, Download } from 'lucide-react';
import api from '../../lib/api.js';
import { useAuthStore } from '../../store/authStore.js';
import toast from 'react-hot-toast';

const CollegeInfo = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('notices');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('notice');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [branch, setBranch] = useState('MnC');
  const [semester, setSemester] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching college info:', error);
      toast.error('Failed to load college info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreateModal = () => {
    setEditId(null);
    setTitle('');
    setDescription('');
    setType('notice');
    setDate('');
    setEndDate('');
    setBranch('MnC');
    setSemester('');
    setIsImportant(false);
    setFile(null);
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setEditId(event._id);
    setTitle(event.title);
    setDescription(event.description);
    setType(event.type);
    setDate(event.date ? new Date(event.date).toISOString().split('T')[0] : '');
    setEndDate(event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '');
    setBranch(event.branch || '');
    setSemester(event.semester ? event.semester.toString() : '');
    setIsImportant(event.isImportant || false);
    setFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this information?')) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success('Information deleted successfully');
      fetchEvents();
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error(error.response?.data?.message || 'Failed to delete');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to upload college info');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('type', type);
      formData.append('date', date);
      if (endDate) formData.append('endDate', endDate);
      if (branch) formData.append('branch', branch);
      if (semester) formData.append('semester', semester);
      formData.append('isImportant', isImportant);
      if (file) {
        formData.append('file', file);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (editId) {
        await api.put(`/events/${editId}`, formData, config);
        toast.success('College info updated successfully!');
      } else {
        await api.post('/events', formData, config);
        toast.success('College info uploaded successfully!');
      }
      
      setShowModal(false);
      fetchEvents();
    } catch (error) {
      console.error('Upload/Update failed:', error);
      toast.error(error.response?.data?.message || 'Failed to process request');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter events based on active tab
  const filteredEvents = events.filter((event) => {
    if (activeTab === 'notices') {
      return event.type === 'notice' || event.type === 'club-recruitment';
    }
    if (activeTab === 'calendar') {
      return event.type === 'event' || event.type === 'exam' || event.type === 'deadline';
    }
    if (activeTab === 'scholarships') {
      return event.type === 'scholarship';
    }
    return false;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">College Information</h1>
          <p className="text-gray-400 mt-1">Academic calendar deadlines, notices, scholarships database, and club updates.</p>
        </div>
        {isAuthenticated && (user?.role === 'admin' || user?.role === 'moderator') && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-full font-medium transition-colors shadow-lg shadow-violet-500/20"
          >
            <Plus className="h-4 w-4" /> Upload Info
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('notices')}
          className={`pb-4 border-b-2 transition-colors ${
            activeTab === 'notices' ? 'text-violet-400 border-violet-500' : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          Important Notices & Clubs
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`pb-4 border-b-2 transition-colors ${
            activeTab === 'calendar' ? 'text-violet-400 border-violet-500' : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          Academic Calendar & Deadlines
        </button>
        <button
          onClick={() => setActiveTab('scholarships')}
          className={`pb-4 border-b-2 transition-colors ${
            activeTab === 'scholarships' ? 'text-violet-400 border-violet-500' : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          Scholarships
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-[#0F0F23] border border-white/5 rounded-2xl">
          <CalendarIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">No Information Available</h3>
          <p className="text-gray-400 mt-1">Be the first to upload college information for your peers.</p>
        </div>
      ) : (
        /* Contents */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-[#0F0F23] border border-white/5 hover:border-violet-500/25 rounded-2xl p-6 space-y-4 flex flex-col justify-between transition-all"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-violet-500/10 text-violet-400 rounded-full uppercase">
                    {event.type.replace('-', ' ')}
                  </span>
                  <div className="flex gap-2 items-center">
                    {event.isImportant && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded">
                        Important
                      </span>
                    )}
                    {((user?._id === event.postedBy || user?.id === event.postedBy) || user?.role === 'admin') && (
                      <div className="flex gap-2 ml-2">
                        <button onClick={() => openEditModal(event)} className="text-gray-400 hover:text-white transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(event._id)} className="text-gray-400 hover:text-rose-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white">{event.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{event.description}</p>
                
                {event.attachments && event.attachments.length > 0 && (
                  <div className="pt-2">
                    <a 
                      href={event.attachments[0].url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      View Attachment
                      <Download className="h-3 w-3 ml-1 opacity-70" />
                    </a>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center border-t border-white/5 pt-4 text-xs text-gray-400">
                <span>Date: {new Date(event.date).toLocaleDateString()}</span>
                {event.branch && <span>Branch: {event.branch}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F0F23] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">{editId ? 'Edit' : 'Upload'} College Information</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Mid Semester Exam Schedule"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</label>
                <textarea
                  placeholder="Provide all relevant details, links, or instructions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 h-24 resize-none transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                  >
                    <option value="notice" className="bg-[#0F0F23]">Notice</option>
                    <option value="exam" className="bg-[#0F0F23]">Exam</option>
                    <option value="deadline" className="bg-[#0F0F23]">Deadline</option>
                    <option value="scholarship" className="bg-[#0F0F23]">Scholarship</option>
                    <option value="club-recruitment" className="bg-[#0F0F23]">Club Recruitment</option>
                    <option value="event" className="bg-[#0F0F23]">Event</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">End Date (Optional)</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Target Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                  >
                    <option value="" className="bg-[#0F0F23]">All Semesters</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s} className="bg-[#0F0F23]">Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Attachment Picker */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Attachment (PDF, Image) - Optional</label>
                <div className="border border-dashed border-white/10 hover:border-violet-500/30 rounded-xl p-4 text-center bg-white/5 cursor-pointer relative transition-colors">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-1">
                    <Upload className="h-5 w-5 text-violet-500" />
                    <p className="text-xs text-white font-medium">
                      {file ? file.name : 'Click to select an attachment'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isImportant"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="h-4 w-4 rounded border-white/10 bg-white/5 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
                <label htmlFor="isImportant" className="text-sm text-gray-300 cursor-pointer select-none">
                  Mark as High Priority / Important notice
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 mt-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50"
              >
                {submitting ? 'Processing...' : (editId ? 'Update Information' : 'Submit Information')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeInfo;
