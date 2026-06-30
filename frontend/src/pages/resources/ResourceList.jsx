import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useResourceStore } from '../../store/resourceStore.js';
import { useAuthStore } from '../../store/authStore.js';
import { Search, Filter, BookOpen, Clock, Download, ArrowUp, Bookmark } from 'lucide-react';
import Loader from '../../components/ui/Loader.jsx';

const ResourceList = () => {
  const { resources, filters, fetchResources, setFilters, isLoading } = useResourceStore();
  const { isAuthenticated, user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  // Load search query from URL parameter if present
  useEffect(() => {
    const urlQuery = searchParams.get('search');
    if (urlQuery) {
      setLocalSearch(urlQuery);
      setFilters({ search: urlQuery });
    } else {
      fetchResources(1);
    }
  }, [searchParams]);

  const handleFilterChange = (field, value) => {
    setFilters({ [field]: value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters({ search: localSearch });
  };

  const resourceTypes = [
    { value: '', label: 'All Types' },
    { value: 'notes', label: 'Notes' },
    { value: 'pyq', label: 'Previous Year Papers' },
    { value: 'mid-sem', label: 'Mid Semester Papers' },
    { value: 'end-sem', label: 'End Semester Papers' },
    { value: 'assignment', label: 'Assignments' },
    { value: 'lab-file', label: 'Lab Files & Reports' },
    { value: 'reference-book', label: 'Reference Books' },
    { value: 'youtube-playlist', label: 'YouTube Playlists' },
  ];

  const branches = [
    { value: '', label: 'All Branches' },
    { value: 'MnC', label: 'Mathematics & Computing' },
  ];

  const semesters = [
    { value: '', label: 'All Semesters' },
    { value: '1', label: 'Semester 1' },
    { value: '2', label: 'Semester 2' },
    { value: '3', label: 'Semester 3' },
    { value: '4', label: 'Semester 4' },
    { value: '5', label: 'Semester 5' },
    { value: '6', label: 'Semester 6' },
    { value: '7', label: 'Semester 7' },
    { value: '8', label: 'Semester 8' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Academic Resources</h1>
          <p className="text-gray-400 mt-1">Browse notes, lab records, assignments, and exam logs shared by peers.</p>
        </div>
        {isAuthenticated && (user?.role === 'admin' || user?.role === 'moderator') && (
          <Link
            to="/resources/upload"
            className="self-start sm:self-auto px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-full font-medium transition-colors shadow-lg shadow-violet-500/20"
          >
            Upload Document
          </Link>
        )}
      </div>

      {/* Filter and Search Section */}
      <div className="bg-[#0F0F23] border border-white/5 rounded-2xl p-6 space-y-6">
        <form onSubmit={handleSearchSubmit} className="flex gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search resources by title, subject, tags..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
            />
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-colors text-sm"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Branch Select */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Branch</label>
            <select
              value={filters.branch}
              onChange={(e) => handleFilterChange('branch', e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
            >
              {branches.map((b) => (
                <option key={b.value} value={b.value} className="bg-[#0F0F23]">
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Select */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Semester</label>
            <select
              value={filters.semester}
              onChange={(e) => handleFilterChange('semester', e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
            >
              {semesters.map((s) => (
                <option key={s.value} value={s.value} className="bg-[#0F0F23]">
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Resource Type */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Resource Type</label>
            <select
              value={filters.resourceType}
              onChange={(e) => handleFilterChange('resourceType', e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
            >
              {resourceTypes.map((t) => (
                <option key={t.value} value={t.value} className="bg-[#0F0F23]">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sort By</label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
            >
              <option value="" className="bg-[#0F0F23]">Latest Added</option>
              <option value="downloads" className="bg-[#0F0F23]">Most Downloaded</option>
              <option value="upvotes" className="bg-[#0F0F23]">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resource Cards Grid */}
      {isLoading ? (
        <Loader />
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => (
            <div
              key={res._id}
              className="bg-[#0F0F23] border border-white/5 hover:border-violet-500/30 rounded-2xl p-6 transition-all hover:scale-[1.01] flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-violet-500/10 text-violet-400 rounded-full uppercase">
                    {res.resourceType}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{res.branch}</span>
                    <span>•</span>
                    <span>Sem {res.semester}</span>
                  </div>
                </div>

                <Link
                  to={`/resources/${res.slug}`}
                  className="block text-lg font-bold text-white hover:text-violet-400 transition-colors line-clamp-2"
                >
                  {res.title}
                </Link>

                <p className="text-sm text-gray-400 line-clamp-2">{res.description}</p>
                <div className="text-xs font-semibold text-gray-400 bg-white/5 inline-block px-2 py-1 rounded-md">
                  Subject: {res.subject}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white">{res.uploader?.name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Download className="h-3.5 w-3.5" /> {res.metrics?.downloads || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <ArrowUp className="h-3.5 w-3.5" /> {res.upvotes?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#0F0F23] border border-white/5 rounded-2xl">
          <BookOpen className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">No Resources Found</h3>
          <p className="text-gray-400 mt-1">Try resetting your search query or modifying filters.</p>
        </div>
      )}
    </div>
  );
};

export default ResourceList;
