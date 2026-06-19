import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ShieldAlert, 
  Brain, 
  Coins, 
  Users, 
  TreePine, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  Zap
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-24 py-6">
      
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto space-y-6 pt-10">
        
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] border border-[#CCDCD1] px-3 py-1 text-xs font-semibold text-[#2E7D32]">
          <Sparkles className="h-3.5 w-3.5 text-[#2E7D32] animate-pulse" />
          <span>Empowering Cities with AI Environmental Intelligence</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl font-black font-heading text-[#1F2937] tracking-tight leading-[110%]">
          Detect Waste, Restore Habitat, <br />
          <span className="bg-gradient-to-r from-[#2E7D32] to-emerald-600 bg-clip-text text-transparent">
            Protect Biodiversity.
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-sm sm:text-base text-[#6B7280] max-w-2xl leading-relaxed">
          TerraWatch combines AI computer vision, local citizen action, and municipal triage channels to identify illegal waste dumping, track ecosystem health, and reward community cleanups.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 w-full max-w-md">
          <Link
            to={user ? ROUTES.REPORT_WASTE : ROUTES.LOGIN}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] px-6 py-3.5 text-sm font-bold text-white transition-all shadow-sm active:scale-[0.98]"
          >
            <span>Report Dumping Incident</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to={ROUTES.IMPACT}
            className="flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-[#F5F7F5] border border-[#CCDCD1] px-6 py-3.5 text-sm font-semibold text-[#374151] transition-all active:scale-[0.98]"
          >
            <span>Explore Eco-Impact</span>
          </Link>
        </div>
      </section>

      {/* Analytics KPI Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto px-4">
        {[
          { label: 'Incidents Cleared', val: '1,432', icon: ShieldCheck, color: 'text-[#2E7D32] bg-[#E8F5E9] border-[#CCDCD1]' },
          { label: 'Ecosystems Restored', val: '820 Acres', icon: TreePine, color: 'text-[#00796B] bg-[#E0F2F1] border-[#B2DFDB]' },
          { label: 'Citizen Volunteers', val: '2,950+', icon: Users, color: 'text-[#00838F] bg-[#E0F7FA] border-[#B2EBF2]' },
          { label: 'EcoCoins Rewarded', val: '345K', icon: Coins, color: 'text-[#B45309] bg-[#FEF3C7] border-[#FDE68A]' },
        ].map((stat, idx) => (
          <div key={idx} className="glass-panel rounded-xl p-5 text-center space-y-2 border-[#E5EDE8] bg-white shadow-sm">
            <div className={`mx-auto rounded-lg p-2 border w-fit ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-[#1F2937] font-heading">{stat.val}</p>
            <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Conceptual Pillars Section */}
      <section className="max-w-5xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-[#1F2937]">How TerraWatch Safeguards Ecotonal Buffers</h2>
          <p className="text-xs sm:text-sm text-[#6B7280] max-w-xl mx-auto">
            A comprehensive solution linking citizen observation with institutional remediation pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glass-panel rounded-2xl p-6 border-[#E5EDE8] bg-white hover:border-[#CCDCD1] hover:shadow-sm transition-all group shadow-sm">
            <div className="rounded-xl bg-[#E8F5E9] border border-[#CCDCD1] p-3 w-fit text-[#2E7D32] group-hover:scale-105 transition-transform">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937] mt-4 mb-2">OpenAI Vision Triage</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Upload photographs of dumping. Our integrated vision model instantly detects types (plastic, chemical, organic) and outputs severity estimates.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel rounded-2xl p-6 border-[#E5EDE8] bg-white hover:border-[#CCDCD1] hover:shadow-sm transition-all group shadow-sm">
            <div className="rounded-xl bg-[#FEF3C7] border border-[#FDE68A] p-3 w-fit text-[#B45309] group-hover:scale-105 transition-transform">
              <Coins className="h-6 w-6 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937] mt-4 mb-2">EcoCoin Incentives</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Earn EcoCoin rewards for reporting dumping or volunteering in cleanup campaigns. Exchange coins for local sustainable credits or municipal offsets.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel rounded-2xl p-6 border-[#E5EDE8] bg-white hover:border-[#CCDCD1] hover:shadow-sm transition-all group shadow-sm">
            <div className="rounded-xl bg-[#E0F2F1] border border-[#B2DFDB] p-3 w-fit text-[#00796B] group-hover:scale-105 transition-transform">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937] mt-4 mb-2">Municipal Accountability</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Direct routing to local sanitation and biodiversity protection teams. Incidents are tracked from report creation to resolution closure.
            </p>
          </div>
        </div>
      </section>

      {/* Habitat Restorations & Biodiversity Callout */}
      <section className="glass-panel rounded-3xl p-8 md:p-12 border-[#E5EDE8] max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white shadow-sm">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E0F2F1] border border-[#B2DFDB] px-2.5 py-0.5 text-[10px] font-bold text-[#00796B]">
            <Zap className="h-3.5 w-3.5" />
            <span>Habitats Protection</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-[#1F2937] leading-tight">
            Protecting Local Species From Anthropogenic Threats
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
            Unregulated dumping pollutes riparian corridors, degrades forest buffer regions, and poisons vulnerable fauna. By mapping incidents, TerraWatch builds safe sanctuaries for endangered local wildlife.
          </p>
          <div className="space-y-2">
            {[
              'Direct alerts sent to local wildlife sanctuaries upon toxic chemical dumps.',
              'Detailed microplastic threat assessment computed automatically.',
              'Community-driven reforestation following waste cleanup resolution.',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-[#374151]">
                <CheckCircle2 className="h-4.5 w-4.5 text-[#2E7D32] shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Graphic Representation */}
        <div className="relative rounded-2xl border border-[#E5EDE8] bg-[#FAFAF8] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5EDE8] pb-3">
            <span className="text-xs font-bold text-[#1F2937]">Ecosystem Restoration Grid</span>
            <span className="text-[10px] text-[#2E7D32] font-semibold bg-[#E8F5E9] border border-[#CCDCD1] rounded px-2 py-0.5">Active monitoring</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Ecotonal Buffer Zone', restoration: '85%', progress: 'w-[85%]', color: 'bg-[#2E7D32]' },
              { label: 'Riparian Watershed Quality', restoration: '72%', progress: 'w-[72%]', color: 'bg-[#00796B]' },
              { label: 'Canopy Habitat Density', restoration: '92%', progress: 'w-[92%]', color: 'bg-[#00838F]' },
            ].map((zone, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#4B5563]">{zone.label}</span>
                  <span className="font-semibold text-[#1F2937]">{zone.restoration}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white overflow-hidden border border-[#E5EDE8]">
                  <div className={`h-full rounded-full ${zone.progress} ${zone.color}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="text-center space-y-5 max-w-xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-black font-heading text-[#1F2937]">Ready to Secure Your Local Ecosystem?</h2>
        <p className="text-xs sm:text-sm text-[#6B7280]">
          Join municipal departments and environmental volunteers tracking pollution and restoring natural sanctuaries.
        </p>
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] px-8 py-3.5 text-sm font-bold text-white transition-all shadow-sm active:scale-[0.98]"
        >
          <span>Get Started Free</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
      
    </div>
  );
};
