import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase/client';
import { PageHeader } from '../../components/common/PageHeader';
import { upvotesService } from '../../services/upvotes';
import { 
  Coins, 
  Clock, 
  Bus, 
  TreePine, 
  Leaf, 
  Heart, 
  Award,
  Upload,
  CheckCircle,
  Calendar,
  Users,
  CheckSquare
} from 'lucide-react';

export const EcoWalletPage: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [valLeaderboard, setValLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const balance = user?.ecoCoinBalance ?? 0;

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch transactions
        const { data: txns, error: txnsError } = await supabase
          .from('eco_coin_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (txnsError) {
          console.error('Error fetching transactions:', txnsError);
        } else {
          setTransactions(txns || []);
        }

        // Fetch leaderboard
        const { data: leaders, error: leadersError } = await supabase
          .from('profiles')
          .select('id, full_name, eco_coins')
          .order('eco_coins', { ascending: false })
          .limit(5);

        if (leadersError) {
          console.error('Error fetching leaderboard:', leadersError);
        } else {
          setLeaderboard(leaders || []);
        }

        // Fetch validator leaderboard
        const valLeaders = await upvotesService.getValidatorLeaderboard();
        setValLeaderboard(valLeaders || []);
      } catch (err) {
        console.error('Error fetching wallet data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const anonymizeName = (fullName: string) => {
    if (!fullName) return 'Anonymous Citizen';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return 'Anonymous Citizen';
    if (parts.length === 1) return parts[0];
    const firstName = parts[0];
    const lastInitial = parts[parts.length - 1][0];
    return `${firstName} ${lastInitial}.`;
  };

  const getTierInfo = (coins: number) => {
    if (coins < 100) {
      return {
        current: "🌱 Eco Seedling",
        next: "🌿 Eco Guardian",
        nextThreshold: 100,
        progress: coins,
        max: 100,
        percentage: (coins / 100) * 100,
      };
    } else if (coins < 250) {
      return {
        current: "🌿 Eco Guardian",
        next: "🌳 Eco Champion",
        nextThreshold: 250,
        progress: coins - 100,
        max: 150,
        percentage: ((coins - 100) / 150) * 100,
      };
    } else if (coins < 500) {
      return {
        current: "🌳 Eco Champion",
        next: "🏆 Eco Legend",
        nextThreshold: 500,
        progress: coins - 250,
        max: 250,
        percentage: ((coins - 250) / 250) * 100,
      };
    } else {
      return {
        current: "🏆 Eco Legend",
        next: "",
        nextThreshold: 500,
        progress: 500,
        max: 500,
        percentage: 100,
      };
    }
  };

  const tier = getTierInfo(balance);

  const rewardCatalog = [
    { id: 'reward-1', name: 'BRTS Bus Day Pass', cost: 500, icon: Bus, desc: 'Unlimited travel on Ahmedabad BRTS corridors for a full day.' },
    { id: 'reward-2', name: 'Ahmedabad Zoo Entry', cost: 300, icon: TreePine, desc: 'Single-entry pass to Kamala Nehru Zoological Garden (Kankaria Zoo).' },
    { id: 'reward-3', name: 'Tree Plantation Certificate', cost: 200, icon: Leaf, desc: 'Have a native tree planted in your name in the urban forestry pool.' },
    { id: 'reward-4', name: 'Donate to Green Ahmedabad Fund', cost: 100, icon: Heart, desc: 'Contribute coins directly to the municipal green lungs restoration drive.' },
  ];

  if (!user) return null;

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <PageHeader
        title="EcoWallet Portal"
        description="Monitor your ecological token balance, track transaction logs, view regional leaders, and redeem certificates or transit passes."
      />

      {/* Wallet Header & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Large Balance Card */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border-amber-500/25 bg-amber-950/5 flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-500/80">Available Balance</p>
              <h2 className="text-4xl sm:text-5xl font-black text-amber-500 mt-2 flex items-center gap-3">
                <Coins className="h-10 w-10 text-amber-500 animate-pulse shrink-0" />
                <span>{balance.toLocaleString()} <span className="text-2xl font-bold text-amber-500/80">EcoCoins</span></span>
              </h2>
            </div>
            <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0">
              <Award className="h-3.5 w-3.5" />
              Active Profile
            </span>
          </div>

          <div className="mt-8 border-t border-amber-500/15 pt-5">
            <div className="flex justify-between items-center mb-2">
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Current Tier</p>
                <p className="text-sm font-black text-slate-200">{tier.current}</p>
              </div>
              {tier.next && (
                <div className="text-right space-y-0.5">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Next Tier</p>
                  <p className="text-sm font-black text-slate-400">{tier.next}</p>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${tier.percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
              {tier.next ? (
                <>
                  <span>{balance} coins accumulated</span>
                  <span>{tier.nextThreshold} coins to level up</span>
                </>
              ) : (
                <span>Level Maxed! 🏆 You are an Eco Legend.</span>
              )}
            </div>
          </div>
        </div>

        {/* Leaderboards Column */}
        <div className="space-y-6">
          
          {/* Community Leaderboard */}
          <div className="glass-panel rounded-2xl p-6 border-forest-900/30 bg-slate-950/20 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-green-900 uppercase tracking-wider font-heading mb-4 flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" />
                Community Leaderboard
              </h3>
              <div className="space-y-2.5">
                {leaderboard.map((item, index) => {
                  const isCurrentUser = item.id === user.id;
                  return (
                    <div 
                      key={item.id} 
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all ${
                        isCurrentUser 
                          ? 'bg-amber-500/10 border-amber-500/35 text-amber-500 font-bold scale-[1.01]' 
                          : 'bg-slate-900/30 border-slate-800/10 text-slate-350 hover:bg-slate-900/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`font-mono text-xs font-bold ${isCurrentUser ? 'text-amber-500' : 'text-slate-500'}`}>
                          #{index + 1}
                        </span>
                        <span className={`text-xs ${isCurrentUser ? 'text-amber-500 font-bold' : 'text-slate-200'}`}>
                          {anonymizeName(item.full_name)}
                        </span>
                      </div>
                      <span className="text-xs font-black flex items-center gap-1">
                        <Coins className="h-3.5 w-3.5 shrink-0" />
                        {item.eco_coins}
                      </span>
                    </div>
                  );
                })}
                {leaderboard.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-4">No data available</p>
                )}
              </div>
            </div>
          </div>

          {/* Validator Leaderboard */}
          <div className="glass-panel rounded-2xl p-6 border-forest-900/30 bg-slate-950/20 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-green-900 uppercase tracking-wider font-heading mb-4 flex items-center gap-2">
                <Award className="h-4 w-4 text-violet-400" />
                Top Community Validators 🌍
              </h3>
              <div className="space-y-2.5">
                {valLeaderboard.map((item, index) => {
                  const isCurrentUser = item.userId === user.id;
                  return (
                    <div 
                      key={item.userId} 
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all ${
                        isCurrentUser 
                          ? 'bg-violet-500/10 border-violet-500/35 text-violet-400 font-bold scale-[1.01]' 
                          : 'bg-slate-900/30 border-slate-800/10 text-slate-350 hover:bg-slate-900/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`font-mono text-xs font-bold ${isCurrentUser ? 'text-violet-400' : 'text-slate-500'}`}>
                          #{index + 1}
                        </span>
                        <span className={`text-xs ${isCurrentUser ? 'text-violet-400 font-bold' : 'text-slate-200'}`}>
                          {item.name}
                        </span>
                      </div>
                      <span className={`text-[10px] font-semibold ${isCurrentUser ? 'text-violet-400' : 'text-slate-400'}`}>
                        {item.validationCount} {item.validationCount === 1 ? 'report' : 'reports'} validated
                      </span>
                    </div>
                  );
                })}
                {valLeaderboard.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-4">No validations yet. Be the first!</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* How to Earn Strip */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-green-900 font-heading">How to Earn</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { action: 'Submit Report', coins: '+10', desc: 'Log an incident', icon: Upload },
            { action: 'Report Approved', coins: '+40', desc: 'Under investigation', icon: CheckSquare },
            { action: 'Cleanup Scheduled', coins: '+25', desc: 'Event scheduled', icon: Calendar },
            { action: 'Report Resolved', coins: '+50', desc: 'Dumping site cleared', icon: CheckCircle },
            { action: 'Volunteer Cleanup', coins: '+100', desc: 'Join cleanup efforts', icon: Users },
          ].map((rule) => {
            const Icon = rule.icon;
            return (
              <div key={rule.action} className="glass-panel p-4 rounded-xl border-slate-800/10 bg-slate-900/10 text-center flex flex-col justify-between items-center space-y-2 hover:scale-[1.02] transition-transform">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{rule.action}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{rule.desc}</p>
                </div>
                <span className="text-xs font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                  {rule.coins} Coins
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Sections: Transactions & Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Transaction History */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-green-900 font-heading flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-400" />
            Transaction History
          </h3>
          <div className="glass-panel rounded-2xl border-forest-900/30 overflow-hidden divide-y divide-slate-800/10 bg-slate-950/5">
            {loading ? (
              <div className="p-8 text-center text-slate-500 animate-pulse text-xs">
                Loading history...
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 space-y-2">
                <Coins className="h-8 w-8 text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-400">No transactions yet.</p>
                <p className="text-[10px] text-slate-500">Submit your first report to earn EcoCoins!</p>
              </div>
            ) : (
              transactions.map((txn) => {
                const formattedDate = new Date(txn.created_at).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                });
                return (
                  <div key={txn.id} className="p-4 flex items-center justify-between hover:bg-slate-900/5 transition-colors">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-200">{txn.reason}</p>
                      <p className="text-[10px] text-slate-400">{formattedDate}</p>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                      +{txn.amount} coins
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Mini Guide */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-green-900 font-heading">EcoCoin Guide</h3>
          <div className="rounded-xl border border-forest-900/40 bg-slate-900/10 p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">How to Redeem</h4>
            <div className="space-y-2.5 text-xs text-slate-400 leading-relaxed">
              <p>
                Redeem your earned tokens for local BRTS bus transport passes, municipal park and zoo tickets, or native tree plantation certificates.
              </p>
              <p>
                Simply check the catalogue below, click <strong>Redeem Now</strong> when you have accumulated enough tokens, and a virtual ticket and QR code will be generated for you.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Redemption Catalogue */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-green-900 font-heading">Redeem EcoCoins</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {rewardCatalog.map((reward) => {
            const Icon = reward.icon;
            const canRedeem = balance >= reward.cost;
            const diff = reward.cost - balance;

            return (
              <div key={reward.id} className="glass-panel p-5 rounded-2xl border-forest-900/30 bg-slate-900/10 flex flex-col justify-between space-y-4 hover:scale-[1.01] transition-transform">
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 w-fit">
                    <Icon className="h-6 w-6 shrink-0" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-200">{reward.name}</h4>
                  <p className="text-[10px] text-slate-400 leading-normal">{reward.desc}</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Cost:</span>
                    <span className="font-extrabold text-amber-500 flex items-center gap-1">
                      <Coins className="h-3.5 w-3.5 shrink-0" />
                      {reward.cost} Coins
                    </span>
                  </div>

                  <button
                    disabled={!canRedeem}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-center ${
                      canRedeem
                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/10 cursor-pointer active:scale-[0.98]'
                        : 'bg-slate-800 text-slate-500 border border-slate-700/10 cursor-not-allowed'
                    }`}
                  >
                    {canRedeem ? 'Redeem Now' : `Need ${diff} more coins`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
