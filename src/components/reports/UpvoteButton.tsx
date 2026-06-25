import React, { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { upvotesService } from '../../services/upvotes';

interface UpvoteButtonProps {
  reportId: string;
  initialCount: number;
  initialHasUpvoted: boolean;
  disabled: boolean;
}

export const UpvoteButton: React.FC<UpvoteButtonProps> = ({
  reportId,
  initialCount,
  initialHasUpvoted,
  disabled,
}) => {
  const { user, refreshUser } = useAuth();
  const [hasUpvoted, setHasUpvoted] = useState(initialHasUpvoted);
  const [upvoteCount, setUpvoteCount] = useState(initialCount);
  const [isPending, setIsPending] = useState(false);

  const handleUpvoteClick = async () => {
    if (disabled || !user || isPending) return;

    // Optimistic UI updates
    const nextHasUpvoted = !hasUpvoted;
    const nextCount = nextHasUpvoted ? upvoteCount + 1 : upvoteCount - 1;

    setHasUpvoted(nextHasUpvoted);
    setUpvoteCount(nextCount);
    setIsPending(true);

    try {
      if (nextHasUpvoted) {
        await upvotesService.addUpvote(reportId, user.id);
        await refreshUser();
      } else {
        await upvotesService.removeUpvote(reportId, user.id);
      }
    } catch (error) {
      console.error('Failed to update upvote:', error);
      // Revert optimistic updates on failure
      setHasUpvoted(!nextHasUpvoted);
      setUpvoteCount(upvoteCount);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        onClick={handleUpvoteClick}
        disabled={disabled || isPending}
        title={disabled ? "Login to validate" : ""}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
          hasUpvoted
            ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/10 active:scale-[0.98]'
            : disabled
            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-350 hover:bg-slate-50 active:scale-[0.98]'
        }`}
      >
        <ThumbsUp className={`h-4 w-4 ${hasUpvoted ? 'fill-current text-white' : ''}`} />
        <span>{hasUpvoted ? 'Validated' : 'Validate'}</span>
      </button>
      <span className="text-[11px] text-slate-500 font-medium">
        {upvoteCount} Community {upvoteCount === 1 ? 'Validation' : 'Validations'}
      </span>
    </div>
  );
};
