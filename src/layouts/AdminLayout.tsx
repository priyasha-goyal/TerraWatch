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
    <div className="flex h-screen bg-[#FAFAF8] text-[#1F2937] overflow-hidden">
      {/* Mobile Sidebar Toggle Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar Component */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#E5EDE8] bg-white transition-transform duration-300 md:static md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-[#E5EDE8]">
          <Link to={ROUTES.LANDING} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F5E9] border border-[#CCDCD1]">
              <ShieldAlert className="h-4.5 w-4.5 text-[#2E7D32]" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight text-[#1F2937]">
              Terra<span className="text-[#2E7D32]">Watch</span>
            </span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F5F7F5] hover:text-[#1F2937] md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          <div className="mb-4 text-[10px] font-bold uppercase tracking-wider text-[#6B7280] px-3">
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
                    ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#CCDCD1]' 
                    : 'text-[#6B7280] hover:bg-[#F5F7F5] hover:text-[#1F2937] border border-transparent'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            );
          })}

          <div className="border-t border-[#E5EDE8] my-6 pt-6" />
          
          <Link
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#6B7280] hover:bg-[#F5F7F5] hover:text-[#1F2937] transition-colors"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            Back to User Portal
          </Link>
        </nav>

        {/* User Footer Profile */}
        <div className="border-t border-[#E5EDE8] bg-[#FAFAF8] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              {user?.avatarUrl && (
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="h-9 w-9 rounded-full object-cover border border-[#CCDCD1]"
                />
              )}
              <div className="truncate max-w-[120px]">
                <p className="text-xs font-semibold text-[#1F2937] leading-none mb-0.5">{user?.name}</p>
                <p className="text-[10px] text-[#6B7280] capitalize">{user?.role.toLowerCase()}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F5F7F5] hover:text-rose-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Content wrapper */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between px-6 border-b border-[#E5EDE8] bg-white">
          {/* Mobile sidebar toggle button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-lg p-2 text-[#6B7280] hover:bg-[#F5F7F5] hover:text-[#1F2937] md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-[#6B7280]">
            <span className="font-semibold text-[#2E7D32]">TerraWatch Municipal Dashboard</span>
            <span className="text-[#CCDCD1]">•</span>
            <span>Local Jurisdiction Node</span>
          </div>

          <div className="flex items-center gap-4">
            {/* EcoCoin counter */}
            {user && (
              <div className="flex items-center gap-1.5 rounded-full border border-[#FDE68A] bg-[#FEF3C7] px-3 py-1 text-xs font-semibold text-[#B45309]">
                <Coins className="h-3.5 w-3.5 text-[#B45309]" />
                <span>{user.ecoCoinBalance} Coins</span>
              </div>
            )}
            
            {/* Notification bell */}
            <button className="relative rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F5F7F5] hover:text-[#1F2937] transition-colors">
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
