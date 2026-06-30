import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Briefcase, Lightbulb, GraduationCap, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import api from '../lib/api.js';

const Home = () => {
  const [platformStats, setPlatformStats] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadPlatformStats = async () => {
      try {
        const response = await api.get('/stats/platform');
        if (isMounted) {
          setPlatformStats(response.data.data);
        }
      } catch (error) {
        console.error('Error loading platform stats:', error);
      }
    };

    loadPlatformStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const formatStat = (value) => {
      if (typeof value !== 'number') return '--';
      return new Intl.NumberFormat('en-IN').format(value);
    };

    return [
      {
        label: 'Resources Uploaded',
        value: formatStat(platformStats?.resourcesUploaded),
        color: 'text-violet-400',
      },
      {
        label: 'Active Students',
        value: formatStat(platformStats?.activeStudents),
        color: 'text-purple-400',
      },
      {
        label: 'Senior Mentors',
        value: formatStat(platformStats?.seniorMentors),
        color: 'text-cyan-400',
      },
      {
        label: 'Projects Showcased',
        value: formatStat(platformStats?.projectsShowcased),
        color: 'text-rose-400',
      },
    ];
  }, [platformStats]);

  return (
    <div className="relative overflow-hidden bg-[#0A0A1B] text-white">
      {/* Background Orbs */}
      <div className="absolute top-10 left-1/4 h-72 w-72 rounded-full bg-violet-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 self-center bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-semibold text-violet-400">
            <Zap className="h-4 w-4" /> Sharing resources just got smarter
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Your College. Your Resources.{' '}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              One Platform.
            </span>
          </h1>
          <p className="text-lg text-gray-400 sm:text-xl">
            MnCHub is a comprehensive resource sharing platform designed for students. Explore notes, PYQs, placement roadmaps, mentorship networks, and showcase your research and projects.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 rounded-full font-medium transition-all shadow-lg shadow-violet-500/20 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/resources"
              className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full font-medium transition-colors"
            >
              Explore Resources
            </Link>
          </div>
        </div>

        {/* Counter Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20 border-t border-white/5 pt-12">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Features Built For Students
          </h2>
          <p className="text-gray-400 mt-2">Everything you need to navigate through semester exams, internship preparation, and research projects.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:scale-[1.02] hover:border-violet-500/30 transition-all flex flex-col gap-4">
            <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">Academic Repository</h3>
            <p className="text-sm text-gray-400">
              Browse semester-wise notes, previous year question papers (PYQs), end-semester guides, lab records, and subject reference materials.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:scale-[1.02] hover:border-purple-500/30 transition-all flex flex-col gap-4">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">Ask Seniors Forum</h3>
            <p className="text-sm text-gray-400">
              Connect directly with seniors from different branches. Ask doubt questions, request study sessions, or get mentor recommendations.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:scale-[1.02] hover:border-cyan-500/30 transition-all flex flex-col gap-4">
            <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">Placement & Internships</h3>
            <p className="text-sm text-gray-400">
              Read interview and online assessment logs shared by students. Prepare using topic-wise sheets and verified DSA roadmaps.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:scale-[1.02] hover:border-rose-500/30 transition-all flex flex-col gap-4">
            <div className="h-12 w-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
              <Lightbulb className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">Projects Showcase</h3>
            <p className="text-sm text-gray-400">
              Upload your projects, collaborate on open-source repositories, seek team members, or browse ideas for your next hackathon.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:scale-[1.02] hover:border-amber-500/30 transition-all flex flex-col gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">College Bulletins</h3>
            <p className="text-sm text-gray-400">
              Keep track of official academic schedules, registrations, notices, exam dates, club recruitments, and scholarship updates.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:scale-[1.02] hover:border-emerald-500/30 transition-all flex flex-col gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">Contribution Badges</h3>
            <p className="text-sm text-gray-400">
              Earn reputation points by sharing helpful resources or answering forum questions. Climb the leaderboard and unlock cool badges!
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative bg-gradient-to-r from-violet-950 via-[#0A0A1B] to-cyan-950 border-t border-white/5 py-24 text-center">
        <div className="max-w-2xl mx-auto px-4 flex flex-col gap-6">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to Elevate Your College Journey?</h2>
          <p className="text-gray-400">Join thousands of students who share study files, collaborate on code, and guide one another.</p>
          <div className="self-center mt-2">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-white text-black hover:bg-gray-100 rounded-full font-semibold transition-all shadow-xl hover:scale-[1.02]"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
