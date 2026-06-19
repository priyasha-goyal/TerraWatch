import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { ShieldAlert, Globe, Heart, MessageSquare, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#E5EDE8] bg-white text-[#6B7280] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to={ROUTES.LANDING} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F5E9] border border-[#CCDCD1]">
                <ShieldAlert className="h-4 w-4 text-[#2E7D32]" />
              </div>
              <span className="font-heading text-lg font-bold tracking-tight text-[#1F2937]">
                Terra<span className="text-[#2E7D32]">Watch</span>
              </span>
            </Link>
            <p className="text-xs text-[#6B7280] leading-relaxed max-w-xs">
              AI-powered environmental intelligence protecting biodiversity through decentralized community reports and real-time incident tracking.
            </p>
            <div className="flex items-center gap-4 text-[#CCDCD1]">
              <a href="#" className="hover:text-[#2E7D32] transition-colors">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-[#2E7D32] transition-colors">
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#1F2937] mb-4">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to={ROUTES.LANDING} className="hover:text-[#2E7D32] transition-colors">Home Landing</Link>
              </li>
              <li>
                <Link to={ROUTES.IMPACT} className="hover:text-[#2E7D32] transition-colors">Impact Analytics</Link>
              </li>
              <li>
                <Link to={ROUTES.DASHBOARD} className="hover:text-[#2E7D32] transition-colors">My Workspace</Link>
              </li>
              <li>
                <Link to={ROUTES.REPORT_WASTE} className="hover:text-[#2E7D32] transition-colors">Report Dumping</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#1F2937] mb-4">Legal & Civic</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#" className="hover:text-[#2E7D32] transition-colors">Privacy Charter</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2E7D32] transition-colors">Municipal API Docs</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2E7D32] transition-colors">Terms of Operations</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2E7D32] transition-colors">Security Audit Report</a>
              </li>
            </ul>
          </div>

          {/* Trust Seal */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#1F2937] mb-4">Municipal Integration</h4>
            <div className="flex items-start gap-2 rounded-lg border border-[#E5EDE8] bg-[#FAFAF8] p-3">
              <ShieldCheck className="h-5 w-5 text-[#2E7D32] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-[#1F2937]">Open Data Standard Compliant</p>
                <p className="text-[10px] text-[#6B7280] mt-1">
                  Engineered to synchronize natively with standard open-civic JSON APIs and municipal database schemas.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#F5F7F5] mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TerraWatch Environmental Intelligence. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for biodiversity conservation with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> & Civic Tech.
          </p>
        </div>
      </div>
    </footer>
  );
};
