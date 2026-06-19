import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import { PageHeader } from '../../components/common/PageHeader';
import { ReportForm } from '../../components/reports/ReportForm';
import { reportsServiceShell } from '../../services/reports';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ReportWastePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [newReportId, setNewReportId] = useState('');

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN);
    }
  }, [user, navigate]);

  const handleFormSubmit = async (formData: any) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      const newReport = await reportsServiceShell.createReport({
        ...formData,
        reporterId: user.id,
        reporterName: user.name,
      });

      setNewReportId(newReport.id);
      setIsSuccess(true);
    } catch (e: any) {
      console.error('FULL ERROR');
      console.error(e);
      console.error(JSON.stringify(e, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Back button */}
      <button
        onClick={() => navigate(ROUTES.DASHBOARD)}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to My Workspace</span>
      </button>

      {/* Success Modal state */}
      {isSuccess ? (
        <div className="glass-panel rounded-2xl p-8 border-emerald-500/25 bg-emerald-950/5 text-center space-y-6 animate-fade-in-up max-w-xl mx-auto my-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-8 w-8 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black font-heading text-white">Incident Successfully Logged!</h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
              Your report <strong>#{newReportId}</strong> has been logged to the TerraWatch municipal coordination pool.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="rounded-lg bg-emerald-500 hover:bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/10 transition-colors"
            >
              Go to Workspace
            </button>
            <button
              onClick={() => {
                setIsSuccess(false);
                setNewReportId('');
              }}
              className="rounded-lg bg-slate-900 hover:bg-slate-800 border border-forest-900/40 px-6 py-2.5 text-xs font-semibold text-slate-300 transition-colors"
            >
              Report Another Incident
            </button>
          </div>
        </div>
      ) : (
        <>
          <PageHeader
            title="Log Environmental Incident"
            description="Upload photographs of waste piles, toxic leakage, or illegal dumps. TerraWatch AI analyzes composition and directs coordinates directly to conservation authorities."
          />

          <div className="glass-panel rounded-2xl p-6 md:p-8 border-forest-900/30">
            <ReportForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
          </div>
        </>
      )}

    </div>
  );
};
