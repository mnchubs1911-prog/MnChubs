import React, { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import { ShieldCheck, UserMinus, Check, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader.jsx';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingResources, setPendingResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [resStats, resPending, resUsers] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/resources/pending'),
          api.get('/admin/users'),
        ]);

        setStats(resStats.data.data);
        setPendingResources(resPending.data.data);
        setUsers(resUsers.data.data);
      } catch (error) {
        console.error('Error loading admin details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/resources/${id}/approve`);
      setPendingResources(prev => prev.filter(r => r._id !== id));
      toast.success('Resource approved successfully');
    } catch (error) {
      toast.error('Approve operation failed');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/admin/resources/${id}/reject`);
      setPendingResources(prev => prev.filter(r => r._id !== id));
      toast.success('Resource rejected and removed');
    } catch (error) {
      toast.error('Reject operation failed');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Delete user failed');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Admin Management Panel</h1>
        <p className="text-gray-400 mt-1">Approve uploaded resource materials, monitor users, and check system statistics.</p>
      </div>

      {/* Grid Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-[#0F0F23] border border-white/5 rounded-2xl p-6">
            <p className="text-3xl font-extrabold text-white">{stats.totalUsers}</p>
            <p className="text-xs text-gray-400 mt-1">Total Users</p>
          </div>
          <div className="bg-[#0F0F23] border border-white/5 rounded-2xl p-6">
            <p className="text-3xl font-extrabold text-white">{stats.totalResources}</p>
            <p className="text-xs text-gray-400 mt-1">Approved Files</p>
          </div>
          <div className="bg-[#0F0F23] border border-white/5 rounded-2xl p-6">
            <p className="text-3xl font-extrabold text-rose-400">{stats.pendingResources}</p>
            <p className="text-xs text-gray-400 mt-1">Pending Approvals</p>
          </div>
          <div className="bg-[#0F0F23] border border-white/5 rounded-2xl p-6">
            <p className="text-3xl font-extrabold text-white">{stats.totalDiscussions}</p>
            <p className="text-xs text-gray-400 mt-1">Forum Posts</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resource approvals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0F0F23] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Pending Uploads Approval</h3>
            <div className="space-y-4">
              {pendingResources.length > 0 ? (
                pendingResources.map((res) => (
                  <div key={res._id} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-white text-sm line-clamp-1">{res.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        {res.subject} • Sem {res.semester} • {res.branch}
                      </p>
                      <p className="text-xs text-violet-400 mt-0.5">Uploader: {res.uploader?.name}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(res._id)}
                        className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition-colors"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleReject(res._id)}
                        className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">No resources pending approval.</p>
              )}
            </div>
          </div>
        </div>

        {/* User list */}
        <div className="space-y-6">
          <div className="bg-[#0F0F23] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Manage Users</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {users.map(u => (
                <div key={u._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <h5 className="font-semibold text-white text-sm line-clamp-1">{u.name}</h5>
                    <p className="text-[10px] text-gray-400 mt-0.5">{u.email}</p>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 bg-white/5 rounded text-gray-300 inline-block mt-1">
                      {u.role}
                    </span>
                  </div>
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg"
                    >
                      <UserMinus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
