import { useState } from 'react';
import { Question } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
}

export const QuestionCard = ({ question, questionNumber }: QuestionCardProps) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleCheckboxChange = (index: number) => {
    if (submitted) return;

    if (question.multiple) {
      setSelectedIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
      );
    } else {
      setSelectedIndices([index]);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCheckboxChange(index);
    }
  };

  const getChoiceStyle = (index: number) => {
    if (!submitted) {
      return selectedIndices.includes(index)
        ? 'border-primary bg-accent'
        : 'border-border hover:border-primary/50 hover:bg-accent/50';
    }

    const isCorrect = question.correctIndices.includes(index);
    const isSelected = selectedIndices.includes(index);

    if (isCorrect && isSelected) {
      return 'border-success bg-success-light';
    }
    if (isCorrect && !isSelected) {
      return 'border-success bg-success-light';
    }
    if (!isCorrect && isSelected) {
      return 'border-destructive bg-error-light';
    }
    return 'border-border';
  };

  const getFeedback = () => {
    const correctCount = selectedIndices.filter((idx) =>
      question.correctIndices.includes(idx),
    ).length;
    const incorrectCount = selectedIndices.filter(
      (idx) => !question.correctIndices.includes(idx),
    ).length;

    if (correctCount === question.correctIndices.length && incorrectCount === 0) {
      return { message: 'Correct!', color: 'text-success' };
    }
    if (correctCount > 0 && incorrectCount === 0 && correctCount < question.correctIndices.length) {
      return { message: 'Partially correct', color: 'text-primary' };
    }
    return { message: 'Incorrect', color: 'text-destructive' };
  };

  return (
    <div
      className="overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-lg sm:p-8"
      style={{ maxHeight: 'calc(100vh - 180px)' }}
      role="article"
      aria-labelledby={`question-${questionNumber}`}
    >
      <div className="mb-6">
        <h2
          id={`question-${questionNumber}`}
          className="mb-2 text-xl font-semibold text-foreground sm:text-2xl"
        >
          {question.text}
        </h2>
        {question.multiple && (
          <p className="text-sm italic text-muted-foreground">Select all that apply</p>
        )}
      </div>

      <div className="mb-6 space-y-3" role="group" aria-label="Answer choices">
        {question.multiple ? (
          // Render checkboxes for multiple-choice questions
          question.choices.map((choice, index) => {
            const isCorrect = question.correctIndices.includes(index);
            const isSelected = selectedIndices.includes(index);

            return (
              <div
                key={choice.id}
                className={cn(
                  'flex items-start gap-3 rounded-md border-2 p-4 transition-all duration-300',
                  getChoiceStyle(index),
                  !submitted && 'cursor-pointer',
                )}
                onClick={() => handleCheckboxChange(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                tabIndex={submitted ? -1 : 0}
                role="checkbox"
                aria-checked={isSelected}
                aria-label={choice.text}
              >
                <Checkbox
                  id={choice.id}
                  checked={isSelected}
                  onCheckedChange={() => handleCheckboxChange(index)}
                  disabled={submitted}
                  className="mt-0.5 h-5 w-5"
                  tabIndex={-1}
                />
                <Label
                  htmlFor={choice.id}
                  className={cn(
                    'flex-1 cursor-pointer select-none text-base leading-relaxed',
                    submitted && 'cursor-default',
                  )}
                >
                  {choice.text}
                </Label>
                {submitted && (
                  <div className="flex-shrink-0">
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-success" aria-label="Correct answer" />
                    ) : isSelected ? (
                      <XCircle className="h-5 w-5 text-destructive" aria-label="Incorrect answer" />
                    ) : null}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          // Render radio buttons for single-choice questions
          <RadioGroup
            value={selectedIndices[0]?.toString() ?? ''}
            onValueChange={(value) => handleCheckboxChange(parseInt(value))}
            disabled={submitted}
          >
            {question.choices.map((choice, index) => {
              const isCorrect = question.correctIndices.includes(index);
              const isSelected = selectedIndices.includes(index);

              return (
                <div
                  key={choice.id}
                  className={cn(
                    'flex items-start gap-3 rounded-md border-2 p-4 transition-all duration-300',
                    getChoiceStyle(index),
                    !submitted && 'cursor-pointer',
                  )}
                  onClick={() => !submitted && handleCheckboxChange(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  tabIndex={submitted ? -1 : 0}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={choice.text}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={choice.id}
                    disabled={submitted}
                    className="mt-0.5 h-5 w-5"
                    tabIndex={-1}
                  />
                  <Label
                    htmlFor={choice.id}
                    className={cn(
                      'flex-1 cursor-pointer select-none text-base leading-relaxed',
                      submitted && 'cursor-default',
                    )}
                  >
                    {choice.text}
                  </Label>
                  {submitted && (
                    <div className="flex-shrink-0">
                      {isCorrect ? (
                        <CheckCircle2
                          className="h-5 w-5 text-success"
                          aria-label="Correct answer"
                        />
                      ) : isSelected ? (
                        <XCircle
                          className="h-5 w-5 text-destructive"
                          aria-label="Incorrect answer"
                        />
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </RadioGroup>
        )}
      </div>

      {!submitted && (
        <Button
          onClick={handleSubmit}
          disabled={selectedIndices.length === 0}
          className="w-full sm:w-auto"
          size="lg"
          aria-label="Submit answer"
        >
          Submit Answer
        </Button>
      )}

      {submitted && (
        <div className="mt-6 rounded-lg border border-border bg-secondary p-4">
          <div className="mb-2 flex items-center gap-2">
            <p className={cn('text-lg font-semibold', getFeedback().color)}>
              {getFeedback().message}
            </p>
          </div>
          <p className="mb-2 text-sm text-muted-foreground">
            You selected{' '}
            {selectedIndices.filter((idx) => question.correctIndices.includes(idx)).length}/
            {question.correctIndices.length} correct answer
            {question.correctIndices.length !== 1 ? 's' : ''}
          </p>
          {question.explanation && (
            <p className="mt-3 text-sm leading-relaxed text-foreground">
              <span className="font-medium">Explanation:</span> {question.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
