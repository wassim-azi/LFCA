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
      setGotoValue('');
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
      <div className="mx-auto flex max-w-4xl items-center justify-center gap-4 px-4 py-2">
        {/* left column intentionally removed; question number is shown in the input box */}

        <div className="flex items-center gap-3">
          <Button
            onClick={() => onFirst?.()}
            disabled={!canGoPrevious}
            variant="outline"
            size="sm"
            className="gap-2 rounded-md px-3 py-2 text-[0.95rem] transition hover:shadow-md"
            aria-label="First question"
            aria-disabled={!canGoPrevious}
          >
            <SkipBack className="h-5 w-5 text-muted-foreground" />
            <span className="hidden text-sm text-muted-foreground sm:inline">First</span>
          </Button>

          <Button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            size="sm"
            className="gap-2 rounded-md bg-gradient-to-r from-primary to-primary/80 px-3 py-2 text-white shadow-md transition hover:opacity-95"
            aria-label="Previous question"
            aria-disabled={!canGoPrevious}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="hidden text-sm font-semibold sm:inline">Prev</span>
          </Button>

          <div className="flex items-center gap-2">
            <input
              id="goto-question"
              name="goto-question"
              type="number"
              inputMode="numeric"
              autoComplete="off"
              min={1}
              max={totalQuestions}
              value={gotoValue}
              onChange={(e) => setGotoValue(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Go to question number"
              placeholder="#"
              className="w-20 rounded-lg border border-border bg-background px-3 py-1 text-center text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              onClick={handleGoto}
              size="sm"
              className="rounded-md bg-primary px-3 py-2 text-white shadow-sm hover:opacity-95"
            >
              Go
            </Button>
            <div className="ml-2 flex items-center gap-1">
              <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-sm font-semibold text-primary">
                {currentQuestion}
              </span>
              <span className="text-sm text-muted-foreground">/</span>
              <span className="text-sm text-muted-foreground">{totalQuestions}</span>
            </div>
          </div>

          <Button
            onClick={onNext}
            disabled={!canGoNext}
            size="sm"
            className="gap-2 rounded-md bg-gradient-to-r from-primary/80 to-primary px-3 py-2 text-white shadow-md transition hover:opacity-95"
            aria-label="Next question"
            aria-disabled={!canGoNext}
          >
            <span className="hidden text-sm font-semibold sm:inline">Next</span>
            <ChevronRight className="h-5 w-5" />
          </Button>

          <Button
            onClick={() => onLast?.()}
            disabled={!canGoNext}
            variant="outline"
            size="sm"
            className="gap-2 rounded-md px-3 py-2 text-[0.95rem] transition hover:shadow-md"
            aria-label="Last question"
            aria-disabled={!canGoNext}
          >
            <span className="hidden text-sm text-muted-foreground sm:inline">Last</span>
            <SkipForward className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        {/* small progress bar */}
        <div className="absolute bottom-0 left-0 right-0 mx-auto mt-2 flex w-full max-w-4xl justify-center px-4">
          <div className="h-1 w-full rounded-full bg-border">
            <div
              className="h-1 rounded-full bg-primary"
              style={{ width: `${Math.round((currentQuestion / totalQuestions) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
