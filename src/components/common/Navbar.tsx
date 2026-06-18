import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import { Menu, X, Coins, Shield, BarChart3, PlusCircle, LayoutDashboard, LogOut, ShieldAlert } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LANDING);
  };

  const navLinks = [
    { label: 'Home', path: ROUTES.LANDING, icon: null },
    { label: 'Impact Tracker', path: ROUTES.IMPACT, icon: BarChart3 },
  ];

  const loggedInLinks = [
    { label: 'My Workspace', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Report Dumping', path: ROUTES.REPORT_WASTE, icon: PlusCircle },
  ];

  const hasAdminAccess = user?.role === 'ADMIN' || user?.role === 'MUNICIPALITY';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-forest-900/30 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={ROUTES.LANDING} className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-forest-600 shadow-lg shadow-emerald-500/20">
                <ShieldAlert className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-white">
                Terra<span className="text-emerald-400">Watch</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-emerald-400 ${
                  isActive(link.path) ? 'text-emerald-400' : 'text-slate-300'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <>
                {loggedInLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-emerald-400 ${
                      isActive(link.path) ? 'text-emerald-400' : 'text-slate-300'
                    }`}
                  >
                    {link.icon && <link.icon className="h-4 w-4" />}
                    {link.label}
                  </Link>
                ))}

                {hasAdminAccess && (
                  <Link
                    to={ROUTES.ADMIN}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-amber-400 ${
                      isActive(ROUTES.ADMIN) ? 'text-amber-400' : 'text-slate-300'
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Section & Action Button */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {/* EcoCoin Indicator */}
                <div className="flex items-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-3 h-8 text-xs font-semibold text-yellow-400">
                  <Coins className="h-4 w-4 text-yellow-500 animate-pulse" />
                  <span>{user.ecoCoinBalance} Coins</span>
                </div>

                {/* User Info & LogOut */}
                <div className="flex items-center gap-3">
                  {user.avatarUrl && (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-8 w-8 rounded-full border border-forest-700 object-cover"
                    />
                  )}
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-200">{user.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{user.role.toLowerCase()}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-rose-400 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/10 transition-all active:scale-[0.98]"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-900 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-forest-900/20 bg-slate-950 px-2 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                isActive(link.path)
                  ? 'bg-emerald-950/40 text-emerald-400'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              {loggedInLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-emerald-950/40 text-emerald-400'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  {link.icon && <link.icon className="h-5 w-5" />}
                  {link.label}
                </Link>
              ))}

              {hasAdminAccess && (
                <Link
                  to={ROUTES.ADMIN}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium ${
                    isActive(ROUTES.ADMIN)
                      ? 'bg-amber-950/40 text-amber-400'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Shield className="h-5 w-5" />
                  Admin Panel
                </Link>
              )}

              <div className="border-t border-slate-900 pt-4 mt-4 px-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {user.avatarUrl && (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{user.role.toLowerCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-2.5 py-1 text-xs font-semibold text-yellow-400">
                  <Coins className="h-3.5 w-3.5 text-yellow-500" />
                  <span>{user.ecoCoinBalance}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-rose-400 hover:bg-rose-950/20"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-4 mt-4 border-t border-slate-900 px-3">
              <Link
                to={ROUTES.LOGIN}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-lg bg-emerald-500 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/10"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
