import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api.js';
import { useAuthStore } from '../../store/authStore.js';
import { FileUp, Info, AlertCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const UploadResource = () => {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [resourceType, setResourceType] = useState('notes');
  const [semester, setSemester] = useState('1');
  const [branch, setBranch] = useState('MnC');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds the 10MB limit');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!file) { setError('Please select a file to upload'); return; }
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('resourceType', resourceType);
    formData.append('semester', semester);
    formData.append('branch', branch);
    formData.append('description', description);
    formData.append('tags', tags);

    try {
      await api.post('/resources', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Resource uploaded successfully!');
      navigate('/resources');
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed. Try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const resourceTypes = [
    { value: 'notes', label: 'Lecture Notes' },
    { value: 'pyq', label: 'Previous Year Papers' },
    { value: 'mid-sem', label: 'Mid Semester Papers' },
    { value: 'end-sem', label: 'End Semester Papers' },
    { value: 'assignment', label: 'Assignments' },
    { value: 'lab-file', label: 'Lab Records & Reports' },
    { value: 'reference-book', label: 'Reference Books' },
    { value: 'youtube-playlist', label: 'YouTube Playlists' },
  ];

  // Admin guard
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="bg-[#0F0F23] border border-rose-500/20 rounded-2xl p-16 text-center space-y-4">
          <ShieldAlert className="h-16 w-16 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Admin Only Area</h2>
          <p className="text-gray-400 max-w-sm mx-auto">Only admins and moderators can upload academic resources. Please contact an administrator if you need access.</p>
          <button onClick={() => navigate('/resources')} className="mt-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors">
            Back to Resources
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Main Upload Box */}
      <div className="bg-[#0F0F23] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Upload New Resource</h2>
          <p className="text-gray-400 text-sm mt-1">Share lecture guides, papers, or lab records with students.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-lg text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Picker */}
          <div className="border-2 border-dashed border-white/10 hover:border-violet-500/30 rounded-2xl p-8 text-center bg-white/5 cursor-pointer relative transition-colors">
            <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
            <div className="flex flex-col items-center gap-2">
              <FileUp className="h-10 w-10 text-violet-500" />
              <p className="text-sm text-white font-medium">
                {file ? file.name : 'Drag & drop file or click to select'}
              </p>
              <p className="text-xs text-gray-400">PDF, Word, Powerpoint, Text or Zip files up to 10MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Document Title</label>
              <input type="text" placeholder="e.g. Unit 3 Compiler Design Notes" value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors" required />
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Subject Name</label>
              <input type="text" placeholder="e.g. Compiler Design" value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors" required />
            </div>

            {/* Resource Type */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Resource Category</label>
              <select value={resourceType} onChange={(e) => setResourceType(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer">
                {resourceTypes.map((t) => (
                  <option key={t.value} value={t.value} className="bg-[#0F0F23]">{t.label}</option>
                ))}
              </select>
            </div>

            {/* Branch + Semester */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Branch</label>
                <select value={branch} onChange={(e) => setBranch(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer">
                  <option value="MnC" className="bg-[#0F0F23]">Mathematics & Computing (MnC)</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Semester</label>
                <select value={semester} onChange={(e) => setSemester(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s} className="bg-[#0F0F23]">Sem {s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Short Description</label>
            <textarea placeholder="Provide a brief summary of the contents..." value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 h-24 resize-none" required />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tags (comma separated)</label>
            <input type="text" placeholder="e.g. mid-sem, compiler, parsing" value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500" />
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 bg-violet-500/10 border border-violet-500/30 text-violet-400 p-3 rounded-lg text-xs leading-relaxed">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <span>By submitting this file, you confirm you have the rights to distribute it. Plagiarized or spammed documents will be removed.</span>
          </div>

          <button type="submit" disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-violet-500/20 disabled:opacity-50">
            {isLoading ? 'Uploading...' : 'Submit Resource'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadResource;
