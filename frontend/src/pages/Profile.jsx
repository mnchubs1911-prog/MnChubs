import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { User, Mail, BookOpen, GraduationCap, Github, Linkedin, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [branch, setBranch] = useState(user?.profile?.branch || 'MnC');
  const [semester, setSemester] = useState(user?.profile?.semester || '1');
  const [skills, setSkills] = useState(user?.profile?.skills?.join(', ') || '');
  const [linkedin, setLinkedin] = useState(user?.profile?.linkedin || '');
  const [github, setGithub] = useState(user?.profile?.github || '');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.profile?.bio || '');
      setBranch(user.profile?.branch || 'MnC');
      setSemester(user.profile?.semester || '1');
      setSkills(user.profile?.skills?.join(', ') || '');
      setLinkedin(user.profile?.linkedin || '');
      setGithub(user.profile?.github || '');
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);

    const result = await updateProfile({
      name,
      bio,
      branch,
      semester: parseInt(semester, 10),
      skills: skillsArray,
      linkedin,
      github,
    });

    if (result.success) {
      toast.success('Profile updated successfully!');
      setEditing(false);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Card */}
      <div className="bg-[#0F0F23] border border-white/5 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-violet-600/5 blur-[50px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-white/5 pb-8">
          <img
            src={user?.avatar || 'https://via.placeholder.com/150'}
            alt="Avatar"
            className="h-24 w-24 rounded-full border-2 border-violet-500"
          />
          <div className="flex-grow text-center md:text-left space-y-2">
            <h2 className="text-2xl font-extrabold text-white">{user?.name}</h2>
            <p className="text-sm text-gray-400 flex items-center justify-center md:justify-start gap-1">
              <Mail className="h-4 w-4" /> {user?.email}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
              <span className="text-xs font-semibold px-2.5 py-1 bg-violet-500/10 text-violet-400 rounded-full">
                Branch: {user?.profile?.branch || 'Not Set'}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-white/5 text-gray-300 rounded-full">
                Semester: {user?.profile?.semester || 'Not Set'}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-cyan-500/10 text-cyan-400 rounded-full">
                Reputation: {user?.reputation?.points || 0} pts
              </span>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="px-5 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-sm transition-colors"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Display / Form */}
        {editing ? (
          <form onSubmit={handleSave} className="space-y-6 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Skills (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, Java, UI Design"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                >
                  <option value="MnC" className="bg-[#0F0F23]">Mathematics & Computing</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s} className="bg-[#0F0F23]">Sem {s}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">LinkedIn URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">GitHub URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bio Description</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 h-20 resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h4 className="text-xs uppercase font-semibold tracking-wider text-gray-500">Bio</h4>
                <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                  {user?.profile?.bio || 'No bio descriptions written yet.'}
                </p>
              </div>

              <div>
                <h4 className="text-xs uppercase font-semibold tracking-wider text-gray-500">Skills</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user?.profile?.skills && user.profile.skills.length > 0 ? (
                    user.profile.skills.map(s => (
                      <span key={s} className="text-xs font-medium px-2.5 py-1 bg-white/5 border border-white/5 rounded-md">
                        {s}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">No skills added</p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Connect columns */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-semibold tracking-wider text-gray-500">Social Connections</h4>
              
              {user?.profile?.linkedin && (
                <a
                  href={user.profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl hover:border-violet-500/30 transition-colors"
                >
                  <Linkedin className="h-5 w-5 text-cyan-400" />
                  <span className="text-xs text-gray-300 font-medium line-clamp-1">{user.profile.linkedin}</span>
                </a>
              )}

              {user?.profile?.github && (
                <a
                  href={user.profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl hover:border-violet-500/30 transition-colors"
                >
                  <Github className="h-5 w-5 text-white" />
                  <span className="text-xs text-gray-300 font-medium line-clamp-1">{user.profile.github}</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
