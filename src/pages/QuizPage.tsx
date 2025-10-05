import { useSearchParams, useNavigate } from 'react-router-dom';
import { Quiz } from '@/components/Quiz';
import { useEffect } from 'react';

const QuizPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get('category');

  useEffect(() => {
    // If no category is specified, redirect to home
    if (!category) {
      navigate('/');
    }
  }, [category, navigate]);

  if (!category) {
    return null;
  }

  return <Quiz category={category} />;
};

export default QuizPage;
