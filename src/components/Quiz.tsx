import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { Question } from '@/types/quiz';
import { loadCategoryQuestions } from '@/lib/questionLoader';
import { QuestionCard } from './QuestionCard';
import { QuizNavigation } from './QuizNavigation';

interface QuizProps {
  category?: string;
}

export const Quiz = ({ category }: QuizProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!category) return;

      setLoading(true);
      setError(null);
      setCurrentQuestionIndex(0);

      try {
        const loadedQuestions = await loadCategoryQuestions(category);
        setQuestions(loadedQuestions);

        // Read initial question param directly from the URL to avoid depending on the
        // router's `searchParams` object identity (which can cause effect loops).
        const qp = new URLSearchParams(window.location.search).get('question');
        if (qp) {
          const parsed = parseInt(qp, 10);
          if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= loadedQuestions.length) {
            setCurrentQuestionIndex(parsed - 1);
          } else {
            setCurrentQuestionIndex(0);
          }
        } else {
          setCurrentQuestionIndex(0);
        }
      } catch (err) {
        setError('Failed to load quiz questions. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
    // Only load when category changes
  }, [category]);

  // Keep the `question` query param in sync when the user navigates questions
  useEffect(() => {
    if (!questions || questions.length === 0) return;

    const oneBased = currentQuestionIndex + 1;
    const currentQp = new URLSearchParams(window.location.search).get('question');
    if (currentQp !== String(oneBased)) {
      // Build a safe params object that always includes the category prop so we don't
      // accidentally remove it and trigger a redirect in QuizPage.
      const next = new URLSearchParams();
      if (category) next.set('category', category);
      next.set('question', String(oneBased));
      setSearchParams(next);
    }
  }, [currentQuestionIndex, questions, setSearchParams, category]);

  const handleFirst = () => {
    setCurrentQuestionIndex(0);
  };

  const handleLast = () => {
    setCurrentQuestionIndex(questions.length - 1);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="max-w-md px-4 text-center">
          <p className="mb-4 text-lg text-destructive">{error}</p>
          <button onClick={() => window.location.reload()} className="text-primary hover:underline">
            Reload page
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p className="text-muted-foreground">No questions available for this category.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const canGoPrevious = currentQuestionIndex > 0;
  const canGoNext = currentQuestionIndex < questions.length - 1;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <header className="border-b border-border bg-card shadow-sm" role="banner">
        {/* three-column layout: left placeholder (for back button), centered title, right placeholder */}
        <div className="mx-auto max-w-4xl px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex w-10 items-center sm:w-12">
              {category && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  aria-label="Back to categories"
                  className="-ml-1 h-8 w-8 transform-gpu p-1.5 shadow-md transition duration-150 ease-in-out hover:scale-105 hover:bg-accent/70 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring sm:h-10 sm:w-10 sm:p-2"
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="h-4 w-4 text-foreground sm:h-5 sm:w-5"
                  />
                </Button>
              )}
            </div>
            <div className="flex-1 text-center">
              <h1 className="text-lg font-bold text-foreground sm:text-2xl md:text-3xl">LFCA</h1>
              <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1 sm:text-sm">
                {category
                  ? `Category: ${category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}`
                  : 'Linux Foundation Certified IT Associate (LFCA)'}
              </p>
            </div>
            <div className="w-10 sm:w-10" aria-hidden />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden" role="main">
        <div className="mx-auto h-full max-w-4xl px-3 py-3 sm:px-4 sm:py-6">
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
          />
        </div>
      </main>

      <QuizNavigation
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onFirst={handleFirst}
        onLast={handleLast}
        onGoto={(n: number) => {
          if (n >= 1 && n <= questions.length) setCurrentQuestionIndex(n - 1);
        }}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
      />
    </div>
  );
};
