import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api.js';
import { useAuthStore } from '../../store/authStore.js';
import {
  ArrowLeft,
  Download,
  ArrowUp,
  ArrowDown,
  Bookmark,
  MessageSquare,
  FileText,
  User as UserIcon,
  Clock,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import Loader from '../../components/ui/Loader.jsx';
import toast from 'react-hot-toast';

const getDownloadFileName = (contentDisposition, fallbackName) => {
  if (!contentDisposition) {
    return fallbackName || 'download';
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return utf8Match[1];
    }
  }

  const plainMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  if (plainMatch) {
    return plainMatch[1];
  }

  return fallbackName || 'download';
};

const ResourceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [resource, setResource] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [voteStatus, setVoteStatus] = useState(0); // 1 = upvoted, -1 = downvoted, 0 = none

  // Edit states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editResourceType, setEditResourceType] = useState('notes');
  const [editBranch, setEditBranch] = useState('MnC');
  const [editSemester, setEditSemester] = useState('1');
  const [editSubject, setEditSubject] = useState('');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const fetchResourceAndComments = async () => {
    try {
      const response = await api.get(`/resources/${slug}`);
      const resourceData = response.data.data;
      setResource(resourceData);
      
      // Populate vote status
      if (user) {
        if (resourceData.upvotes.includes(user.id)) setVoteStatus(1);
        else if (resourceData.downvotes.includes(user.id)) setVoteStatus(-1);
        
        const bookmarksResponse = await api.get('/users/bookmarks');
        const bookmarkedIds = bookmarksResponse.data.data.map(b => b._id);
        setHasBookmarked(bookmarkedIds.includes(resourceData._id));
      }

      // Fetch comments - mock for now
      setComments([
        {
          _id: '1',
          content: 'Very detailed notes. Helped me clear my mid-semester exams!',
          author: { name: 'Aryan Sharma', avatar: null },
          createdAt: new Date(Date.now() - 24 * 3600 * 1000),
        },
        {
          _id: '2',
          content: 'Could you please upload the lab records for CSE-204 as well?',
          author: { name: 'Tanya Goel', avatar: null },
          createdAt: new Date(Date.now() - 2 * 3600 * 1000),
        }
      ]);

    } catch (error) {
      console.error('Error fetching resource details:', error);
      toast.error('Failed to load resource details');
      navigate('/resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResourceAndComments();
  }, [slug, user, navigate]);

  const handleDownload = async () => {
    try {
      // Determine the best available filename from the already-loaded resource data.
      // No extra API call needed — originalName is populated when the page loads.
      const filename =
        resource.originalName ||
        resource.downloadName ||
        resource.fileName ||
        `${resource.title || 'download'}.${resource.fileExtension || 'pdf'}`;

      // Ask the backend for the signed Cloudinary URL that includes
      // fl_attachment:<filename> — this tells Cloudinary to serve the file
      // with Content-Disposition: attachment; filename="Notes.pdf".
      const response = await api.get(`/resources/${resource._id}/download`, {
        params: { json: 'true' },
      });

      const downloadUrl = response.data?.url;
      const serverFilename = response.data?.filename || filename;

      if (!downloadUrl) throw new Error('No download URL returned by server');

      // Navigate the current tab to the download URL.
      // Because the URL carries fl_attachment (Cloudinary) or our backend sets
      // Content-Disposition: attachment, the browser triggers a file download
      // instead of navigating away. This works on ALL browsers including
      // mobile Safari, Chrome Android, and desktop browsers.
      window.location.href = downloadUrl;

      // Optimistically update the local download counter
      setResource((prev) => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          downloads: (prev.metrics?.downloads || 0) + 1,
        },
      }));

      toast.success(`Downloading ${serverFilename}`);
    } catch (error) {
      toast.error('Failed to start download. Please try again.');
      console.error('Download error:', error);
    }
  };

  const handleVote = async (type) => {
    if (!isAuthenticated) {
      toast.error('Please log in to rate resources');
      return;
    }

    try {
      const endpoint = type === 'up' ? `/resources/${resource._id}/upvote` : `/resources/${resource._id}/downvote`;
      const response = await api.post(endpoint);
      
      setResource(prev => ({
        ...prev,
        upvotes: type === 'up' ? (voteStatus === 1 ? prev.upvotes.filter(id => id !== user.id) : [...prev.upvotes, user.id]) : prev.upvotes,
        downvotes: type === 'down' ? (voteStatus === -1 ? prev.downvotes.filter(id => id !== user.id) : [...prev.downvotes, user.id]) : prev.downvotes,
      }));

      setVoteStatus(response.data.voted);
      toast.success('Vote updated');
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save bookmarks');
      return;
    }

    try {
      if (hasBookmarked) {
        await api.delete(`/users/bookmarks/${resource._id}`);
        setHasBookmarked(false);
        toast.success('Bookmark removed');
      } else {
        await api.post(`/users/bookmarks/${resource._id}`);
        setHasBookmarked(true);
        toast.success('Resource saved to bookmarks');
      }
    } catch (error) {
      toast.error('Bookmark update failed');
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    // Simulate comment upload
    setTimeout(() => {
      const addedComment = {
        _id: Math.random().toString(),
        content: newComment,
        author: { name: user?.name || 'Student', avatar: user?.avatar },
        createdAt: new Date(),
      };
      setComments(prev => [...prev, addedComment]);
      setNewComment('');
      setSubmittingComment(false);
      toast.success('Comment posted');
    }, 500);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      await api.delete(`/resources/${resource._id}`);
      toast.success('Resource deleted successfully');
      navigate('/resources');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error(error.response?.data?.message || 'Failed to delete resource');
    }
  };

  const openEditModal = () => {
    setEditTitle(resource.title);
    setEditDescription(resource.description);
    setEditResourceType(resource.resourceType);
    setEditBranch(resource.branch);
    setEditSemester(resource.semester.toString());
    setEditSubject(resource.subject);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmittingEdit(true);
    try {
      const payload = {
        title: editTitle,
        description: editDescription,
        resourceType: editResourceType,
        branch: editBranch,
        semester: parseInt(editSemester, 10),
        subject: editSubject,
      };
      
      await api.put(`/resources/${resource._id}`, payload);
      toast.success('Resource updated successfully');
      setShowEditModal(false);
      fetchResourceAndComments(); // Refetch to get updated data and possibly new slug
    } catch (error) {
      console.error('Edit failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update resource');
    } finally {
      setSubmittingEdit(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/resources')}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Resources
      </button>

      {/* Main Info Card */}
      <div className="bg-[#0F0F23] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-semibold px-2.5 py-1 bg-violet-500/10 text-violet-400 rounded-full uppercase">
                {resource.resourceType}
              </span>
              <span className="text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-full">
                Semester {resource.semester}
              </span>
              <span className="text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-full">
                {resource.branch}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">{resource.title}</h1>
            <p className="text-gray-400 text-sm">{resource.description}</p>
          </div>

          {/* Quick Stats & Actions */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVote('up')}
                className={`p-2.5 rounded-xl border border-white/5 transition-colors ${
                  voteStatus === 1 ? 'bg-violet-500/10 text-violet-400 border-violet-500/30' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <ArrowUp className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleVote('down')}
                className={`p-2.5 rounded-xl border border-white/5 transition-colors ${
                  voteStatus === -1 ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <ArrowDown className="h-5 w-5" />
              </button>
              <button
                onClick={handleBookmarkToggle}
                className={`p-2.5 rounded-xl border border-white/5 transition-colors ${
                  hasBookmarked ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <Bookmark className="h-5 w-5" />
              </button>
            </div>
            
            {/* Edit/Delete Actions */}
            {((user?._id === resource.uploader?._id || user?.id === resource.uploader?._id) || user?.role === 'admin') && (
              <div className="flex items-center gap-2">
                <button
                  onClick={openEditModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 bg-white/5 hover:bg-white/10 hover:text-white rounded-lg transition-colors border border-white/5"
                >
                  <Edit className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors border border-rose-500/20"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Preview Frame */}
        <div className="aspect-[16/9] bg-[#0A0A1B] border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-4 text-center p-6">
          <FileText className="h-16 w-16 text-violet-500" />
          <div>
            <p className="text-white font-semibold">Document Preview Ready</p>
            <p className="text-xs text-gray-400 mt-1">Download the PDF file to read the complete content offline.</p>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-violet-500/20"
          >
            <Download className="h-5 w-5" /> Download File
          </button>
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/5 pt-6 text-sm text-gray-400">
          <div>
            <span className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-0.5">Subject</span>
            <span className="text-white font-medium">{resource.subject}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-0.5">Uploader</span>
            <span className="text-white font-medium">{resource.uploader?.name || 'Anonymous'}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-0.5">Downloads</span>
            <span className="text-white font-medium">{resource.metrics?.downloads || 0}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-0.5">Views</span>
            <span className="text-white font-medium">{resource.metrics?.views || 0}</span>
          </div>
        </div>
      </div>

      {/* Discussion / Comments Section */}
      <div className="bg-[#0F0F23] border border-white/5 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-violet-500" /> Comments & Reviews ({comments.length})
        </h3>

        {/* Comment input */}
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="flex gap-3">
            <textarea
              placeholder="Leave a comment or review..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors h-20 resize-none"
              required
            />
            <button
              type="submit"
              disabled={submittingComment}
              className="px-5 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-colors text-sm self-end h-10 disabled:opacity-50"
            >
              Post
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-400 bg-white/5 p-4 rounded-xl border border-white/5 text-center">
            Please <Link to="/login" className="text-violet-400 hover:underline">log in</Link> to post comments.
          </p>
        )}

        {/* Comments Feed */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white">{comment.author.name}</span>
                <span className="text-gray-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-300">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F0F23] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">Edit Resource</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 h-24 resize-none transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Resource Type</label>
                  <select
                    value={editResourceType}
                    onChange={(e) => setEditResourceType(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                  >
                    <option value="notes" className="bg-[#0F0F23]">Notes</option>
                    <option value="pyq" className="bg-[#0F0F23]">Previous Year Papers</option>
                    <option value="mid-sem" className="bg-[#0F0F23]">Mid Semester Papers</option>
                    <option value="end-sem" className="bg-[#0F0F23]">End Semester Papers</option>
                    <option value="assignment" className="bg-[#0F0F23]">Assignments</option>
                    <option value="lab-file" className="bg-[#0F0F23]">Lab Files & Reports</option>
                    <option value="reference-book" className="bg-[#0F0F23]">Reference Books</option>
                    <option value="youtube-playlist" className="bg-[#0F0F23]">YouTube Playlists</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Branch</label>
                  <select
                    value={editBranch}
                    onChange={(e) => setEditBranch(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                  >
                    <option value="MnC" className="bg-[#0F0F23]">Mathematics & Computing</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Semester</label>
                  <select
                    value={editSemester}
                    onChange={(e) => setEditSemester(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s.toString()} className="bg-[#0F0F23]">Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingEdit}
                className="w-full py-3 mt-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50"
              >
                {submittingEdit ? 'Updating...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceDetail;
