import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import api from '../lib/api.js';
import {
  FileText,
  Bookmark,
  Award,
  Clock,
  Briefcase,
  MessageSquare,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import Loader from '../components/ui/Loader.jsx';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    viewedCount: 0,
    contributionPoints: 0,
    savedCount: 0,
    badgeCount: 0,
  });
  const [recentResources, setRecentResources] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [resRecent, resBookmarks, resPlacements, resEvents] = await Promise.all([
          api.get('/resources/recent'),
          api.get('/users/bookmarks'),
          api.get('/placements'),
          api.get('/events/upcoming'),
        ]);

        setRecentResources(resRecent.data.data.slice(0, 5));
        setBookmarks(resBookmarks.data.data.slice(0, 5));
        setPlacements(resPlacements.data.data.slice(0, 3));
        setEvents(resEvents.data.data.slice(0, 4));
        
        setStats({
          viewedCount: user?.recentlyViewed?.length || 0,
          contributionPoints: user?.reputation?.points || 0,
          savedCount: resBookmarks.data.data.length,
          badgeCount: user?.reputation?.badges?.length || 0,
        });
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            Hello, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-gray-400 mt-1">Here is what is happening on your campus campus hub today.</p>
        </div>
        <Link
          to="/resources/upload"
          className="self-start md:self-auto bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-full font-medium transition-colors shadow-lg shadow-violet-500/20"
        >
          Upload Resource
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0F0F23] border border-white/5 rounded-2xl p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.viewedCount}</p>
            <p className="text-xs text-gray-400 mt-0.5">Recently Viewed</p>
          </div>
        </div>

        <div className="bg-[#0F0F23] border border-white/5 rounded-2xl p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.contributionPoints}</p>
            <p className="text-xs text-gray-400 mt-0.5">Reputation Points</p>
          </div>
        </div>

        <div className="bg-[#0F0F23] border border-white/5 rounded-2xl p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <Bookmark className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.savedCount}</p>
            <p className="text-xs text-gray-400 mt-0.5">Saved Resources</p>
          </div>
        </div>

        <div className="bg-[#0F0F23] border border-white/5 rounded-2xl p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.badgeCount}</p>
            <p className="text-xs text-gray-400 mt-0.5">Badges Earned</p>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Resources and Placements */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Resources */}
          <div className="bg-[#0F0F23] border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Recently Added Resources</h3>
              <Link to="/resources" className="text-xs text-violet-400 hover:underline flex items-center gap-1">
                See All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentResources.length > 0 ? (
                recentResources.map((res) => (
                  <div key={res._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-violet-500/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-violet-500/10 text-violet-400 rounded-lg">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <Link to={`/resources/${res.slug}`} className="text-sm font-medium hover:text-violet-400 transition-colors line-clamp-1">
                          {res.title}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {res.subject} • Semester {res.semester}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 bg-white/5 rounded-md text-gray-300">
                      {res.resourceType}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">No recent resources found</p>
              )}
            </div>
          </div>

          {/* Placement updates */}
          <div className="bg-[#0F0F23] border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Recent Interview Experiences</h3>
              <Link to="/placements" className="text-xs text-violet-400 hover:underline flex items-center gap-1">
                See All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-4">
              {placements.length > 0 ? (
                placements.map((exp) => (
                  <div key={exp._id} className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">{exp.companyName}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">{exp.role} • {exp.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        exp.verdict === 'selected'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {exp.verdict}
                      </span>
                      <Link to={`/placements/${exp._id}`} className="text-xs text-violet-400 hover:underline">
                        Read Story
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">No placement experiences reported yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Deadlines and Saved Resources */}
        <div className="space-y-8">
          {/* Deadlines & Calendar */}
          <div className="bg-[#0F0F23] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Upcoming Deadlines & Notices</h3>
            <div className="space-y-4">
              {events.length > 0 ? (
                events.map((evt) => (
                  <div key={evt._id} className="flex gap-4">
                    <div className="flex flex-col items-center justify-center h-12 w-12 rounded-lg bg-rose-500/10 text-rose-400 shrink-0 border border-rose-500/15">
                      <span className="text-[10px] uppercase font-bold">
                        {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg font-extrabold -mt-1">
                        {new Date(evt.date).getDate()}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white line-clamp-1">{evt.title}</h4>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{evt.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">No upcoming events or deadlines</p>
              )}
            </div>
          </div>

          {/* Bookmarks */}
          <div className="bg-[#0F0F23] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Your Bookmarked Resources</h3>
            <div className="space-y-4">
              {bookmarks.length > 0 ? (
                bookmarks.map((res) => (
                  <div key={res._id} className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/5">
                    <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
                      <Bookmark className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <Link to={`/resources/${res.slug}`} className="text-xs font-semibold text-white hover:text-violet-400 transition-colors line-clamp-1">
                        {res.title}
                      </Link>
                      <p className="text-[10px] text-gray-400 mt-0.5">{res.subject}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">No bookmarks saved yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
