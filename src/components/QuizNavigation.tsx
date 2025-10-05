import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SkipForward, SkipBack } from 'lucide-react';

interface QuizNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onFirst?: () => void;
  onLast?: () => void;
  onGoto?: (n: number) => void;
}

export const QuizNavigation = ({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  onFirst,
  onLast,
  onGoto,
}: QuizNavigationProps) => {
  const [gotoValue, setGotoValue] = React.useState<string>(String(currentQuestion));

  // keep the input in sync with the current question when navigation happens
  React.useEffect(() => {
    setGotoValue(String(currentQuestion));
  }, [currentQuestion]);

  const handleGoto = () => {
    const parsed = parseInt(gotoValue, 10);
    if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= totalQuestions) {
      onGoto?.(parsed);
      // Value will be synced by useEffect when currentQuestion changes
    } else {
      // Reset to current question if invalid
      setGotoValue(String(currentQuestion));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGoto();
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 border-t border-border bg-card shadow-lg"
      role="navigation"
      aria-label="Quiz navigation"
    >
      <div className="mx-auto flex max-w-4xl flex-col">
        {/* small progress bar at top */}
        <div className="h-1 w-full bg-border">
          <div
            className="h-1 bg-primary transition-all duration-300"
            style={{ width: `${Math.round((currentQuestion / totalQuestions) * 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-2 px-3 py-2 sm:gap-4 sm:px-4">
          <Button
            onClick={() => onFirst?.()}
            disabled={!canGoPrevious}
            variant="outline"
            size="sm"
            className="gap-1 rounded-md px-2 py-2 transition hover:shadow-md sm:px-3"
            aria-label="First question"
            aria-disabled={!canGoPrevious}
          >
            <SkipBack className="h-4 w-4 text-muted-foreground sm:h-5 sm:w-5" />
            <span className="hidden text-sm text-muted-foreground sm:inline">First</span>
          </Button>

          <Button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            size="sm"
            className="gap-1 rounded-md bg-gradient-to-r from-primary to-primary/80 px-2 py-2 text-white shadow-md transition hover:opacity-95 sm:gap-2 sm:px-3"
            aria-label="Previous question"
            aria-disabled={!canGoPrevious}
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden text-sm font-semibold sm:inline">Prev</span>
          </Button>

          {/* Center: Interactive question number input */}
          <div className="flex flex-1 items-center justify-center gap-1.5">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={totalQuestions}
              value={gotoValue}
              onChange={(e) => setGotoValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => setGotoValue(String(currentQuestion))}
              aria-label="Current question number - click to jump to question"
              className="w-10 rounded border border-border bg-background px-1 py-0.5 text-center text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary sm:w-12"
            />
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-medium text-muted-foreground">{totalQuestions}</span>
            {gotoValue !== String(currentQuestion) && (
              <Button
                onClick={handleGoto}
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs font-medium"
              >
                Go
              </Button>
            )}
          </div>

          <Button
            onClick={onNext}
            disabled={!canGoNext}
            size="sm"
            className="gap-1 rounded-md bg-gradient-to-r from-primary/80 to-primary px-2 py-2 text-white shadow-md transition hover:opacity-95 sm:gap-2 sm:px-3"
            aria-label="Next question"
            aria-disabled={!canGoNext}
          >
            <span className="hidden text-sm font-semibold sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <Button
            onClick={() => onLast?.()}
            disabled={!canGoNext}
            variant="outline"
            size="sm"
            className="gap-1 rounded-md px-2 py-2 transition hover:shadow-md sm:px-3"
            aria-label="Last question"
            aria-disabled={!canGoNext}
          >
            <span className="hidden text-sm text-muted-foreground sm:inline">Last</span>
            <SkipForward className="h-4 w-4 text-muted-foreground sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
