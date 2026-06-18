import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';
import { 
  ShieldAlert, 
  Menu, 
  X, 
  LayoutDashboard, 
  ArrowLeft, 
  LogOut,
  Bell,
  Coins
} from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LANDING);
  };

  const menuItems = [
    { label: 'Incident Moderation', path: ROUTES.ADMIN, icon: ShieldAlert },
    { label: 'Impact Dashboard', path: ROUTES.IMPACT, icon: LayoutDashboard },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Mobile Sidebar Toggle Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/* Sidebar Component */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-forest-900/30 bg-slate-900 transition-transform duration-300 md:static md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-forest-900/20">
          <Link to={ROUTES.LANDING} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-forest-600">
              <ShieldAlert className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight text-white">
              Terra<span className="text-emerald-400">Watch</span>
            </span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          <div className="mb-4 text-[10px] font-bold uppercase tracking-wider text-forest-500 px-3">
            Municipal Operations
          </div>
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active 
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            );
          })}

          <div className="border-t border-forest-900/20 my-6 pt-6" />
          
          <Link
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            Back to User Portal
          </Link>
        </nav>

        {/* User Footer Profile */}
        <div className="border-t border-forest-900/20 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              {user?.avatarUrl && (
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="h-9 w-9 rounded-full object-cover border border-forest-800"
                />
              )}
              <div className="truncate max-w-[120px]">
                <p className="text-xs font-semibold text-white leading-none mb-0.5">{user?.name}</p>
                <p className="text-[10px] text-slate-400 capitalize">{user?.role.toLowerCase()}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Content wrapper */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between px-6 border-b border-forest-900/20 bg-slate-900/50 backdrop-blur-md">
          {/* Mobile sidebar toggle button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
            <span className="font-semibold text-emerald-400">TerraWatch Municipal Dashboard</span>
            <span className="text-slate-600">•</span>
            <span>Local Jurisdiction Node</span>
          </div>

          <div className="flex items-center gap-4">
            {/* EcoCoin counter */}
            {user && (
              <div className="flex items-center gap-1.5 rounded-full border border-yellow-500/10 bg-yellow-500/5 px-3 py-1 text-xs font-semibold text-yellow-400">
                <Coins className="h-3.5 w-3.5 text-yellow-500" />
                <span>{user.ecoCoinBalance} Coins</span>
              </div>
            )}
            
            {/* Notification bell */}
            <button className="relative rounded-lg p-1.5 text-slate-400 hover:bg-slate-850 hover:text-white transition-colors">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </button>
          </div>
        </header>

        {/* Dynamic page content container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-6xl animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
