import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Github, Linkedin, Mail, ShieldAlert } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0A0A1B] border-t border-white/5 pt-12 pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-violet-500" />
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent">
                MnCHub
              </span>
            </Link>
            <p className="text-sm text-gray-400">
              The premier resource sharing and networking platform for college students. Build, share, and grow together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/resources" className="hover:text-violet-400">Notes & Papers</Link></li>
              <li><Link to="/community" className="hover:text-violet-400">Student Forums</Link></li>
              <li><Link to="/placements" className="hover:text-violet-400">Placement Prep</Link></li>
              <li><Link to="/research" className="hover:text-violet-400">Research Projects</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/community/seniors" className="hover:text-violet-400">Ask Seniors</Link></li>
              <li><Link to="/marketplace" className="hover:text-violet-400">Buy/Sell Books</Link></li>
              <li><Link to="/college" className="hover:text-violet-400">Academic Notices</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Support</h4>
            <p className="text-sm text-gray-400 mb-4">Have questions? Reach out to our admin team.</p>
            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" className="hover:text-white"><Github className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white"><Linkedin className="h-5 w-5" /></a>
              <a href="mailto:support@mnchub.com" className="hover:text-white"><Mail className="h-5 w-5" /></a>
            </div>
          </div>
        </div>

        <hr className="border-white/5 my-6" />

        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} MnCHub. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
