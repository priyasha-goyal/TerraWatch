import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import { Menu, X, Coins, Shield, BarChart3, PlusCircle, LayoutDashboard, LogOut, ShieldAlert, Users } from 'lucide-react';

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
    { label: 'Community', path: ROUTES.COMMUNITY_FEED, icon: Users },
  ];

  const loggedInLinks = [
    { label: 'My Workspace', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Report Dumping', path: ROUTES.REPORT_WASTE, icon: PlusCircle },
    { label: 'My Wallet', path: ROUTES.ECOCOIN_WALLET, icon: Coins },
  ];

  const hasAdminAccess = user?.role === 'ADMIN' || user?.role === 'MUNICIPALITY';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E5EDE8] bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={ROUTES.LANDING} className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F5E9] border border-[#CCDCD1]">
                <ShieldAlert className="h-5 w-5 text-[#2E7D32]" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-[#1F2937]">
                Terra<span className="text-[#2E7D32]">Watch</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-[#2E7D32] ${
                  isActive(link.path) ? 'text-[#2E7D32] font-semibold' : 'text-[#6B7280]'
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
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[#2E7D32] ${
                      isActive(link.path) ? 'text-[#2E7D32] font-semibold' : 'text-[#6B7280]'
                    }`}
                  >
                    {link.icon && <link.icon className="h-4 w-4" />}
                    {link.label}
                  </Link>
                ))}

                {hasAdminAccess && (
                  <Link
                    to={ROUTES.ADMIN}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[#B45309] ${
                      isActive(ROUTES.ADMIN) ? 'text-[#B45309] font-semibold' : 'text-[#6B7280]'
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
                <Link
                  to={ROUTES.ECOCOIN_WALLET}
                  className="flex items-center gap-1.5 rounded-full border border-[#FDE68A] bg-[#FEF3C7] px-3 h-8 text-xs font-semibold text-[#B45309] hover:bg-[#FDE68A]/80 transition-colors"
                >
                  <Coins className="h-4 w-4 text-[#B45309]" />
                  <span>{user.ecoCoinBalance} Coins</span>
                </Link>

                {/* User Info & LogOut */}
                <div className="flex items-center gap-3">
                  {user.avatarUrl && (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-8 w-8 rounded-full border border-[#CCDCD1] object-cover"
                    />
                  )}
                  <div className="text-right">
                    <p className="text-xs font-medium text-[#1F2937]">{user.name}</p>
                    <p className="text-[10px] text-[#6B7280] capitalize">{user.role.toLowerCase()}</p>
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
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="flex items-center justify-center rounded-lg bg-[#2E7D32] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1B5E20] shadow-sm transition-all active:scale-[0.98]"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-[#6B7280] hover:bg-[#F5F7F5] hover:text-[#1F2937] focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5EDE8] bg-white px-2 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                isActive(link.path)
                  ? 'bg-[#E8F5E9] text-[#2E7D32]'
                  : 'text-[#6B7280] hover:bg-[#F5F7F5] hover:text-[#1F2937]'
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
                      ? 'bg-[#E8F5E9] text-[#2E7D32]'
                      : 'text-[#6B7280] hover:bg-[#F5F7F5] hover:text-[#1F2937]'
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
                      ? 'bg-[#FEF3C7] text-[#B45309]'
                      : 'text-[#6B7280] hover:bg-[#F5F7F5] hover:text-[#1F2937]'
                  }`}
                >
                  <Shield className="h-5 w-5" />
                  Admin Panel
                </Link>
              )}

              <div className="border-t border-[#E5EDE8] pt-4 mt-4 px-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {user.avatarUrl && (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-9 w-9 rounded-full border border-[#CCDCD1] object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-[#1F2937]">{user.name}</p>
                    <p className="text-xs text-[#6B7280] capitalize">{user.role.toLowerCase()}</p>
                  </div>
                </div>
                <Link
                  to={ROUTES.ECOCOIN_WALLET}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 rounded-full border border-[#FDE68A] bg-[#FEF3C7] px-2.5 py-1 text-xs font-semibold text-[#B45309] hover:bg-[#FDE68A]/80 transition-colors"
                >
                  <Coins className="h-3.5 w-3.5 text-[#B45309]" />
                  <span>{user.ecoCoinBalance}</span>
                </Link>
              </div>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-rose-600 hover:bg-rose-50 mt-2"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-4 mt-4 border-t border-[#E5EDE8] px-3">
              <Link
                to={ROUTES.LOGIN}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-lg bg-[#2E7D32] py-2.5 text-center text-sm font-medium text-white hover:bg-[#1B5E20] shadow-sm"
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
