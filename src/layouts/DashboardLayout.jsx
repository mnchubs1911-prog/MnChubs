import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  Lightbulb,
  Bell,
  ShoppingBag,
  User as UserIcon,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const sidebarLinks = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Resources', path: '/resources', icon: FileText },
    { label: 'Community', path: '/community', icon: Users },
    { label: 'Placements', path: '/placements', icon: Briefcase },
    { label: 'Research & Projects', path: '/research', icon: Lightbulb },
    { label: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A1B] text-white">
      <Navbar />
      <div className="flex flex-grow pt-16">
        {/* Sidebar */}
        <aside
          className={`bg-[#0F0F23] border-r border-white/5 transition-all duration-300 ${
            collapsed ? 'w-16' : 'w-64'
          } hidden md:flex flex-col justify-between`}
        >
          <div className="py-4">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex justify-end px-4 mb-4 text-gray-400 hover:text-white"
            >
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </button>

            <ul className="space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`flex items-center gap-4 px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-violet-400 bg-white/5 border-l-4 border-violet-500'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {!collapsed && <span>{link.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Content area */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
