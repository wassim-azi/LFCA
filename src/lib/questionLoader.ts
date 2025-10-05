import { Question, QuestionJSON, CategoryData } from '@/types/quiz';

// Map category IDs to JSON file paths
const categoryFiles: Record<string, string> = {
  linux: '/src/data/linux.json',
  system: '/src/data/system.json',
  cloud: '/src/data/cloud.json',
  security: '/src/data/security.json',
  devops: '/src/data/devops.json',
  it: '/src/data/it.json',
};

// Convert letter indices (a, b, c, d) to numeric indices (0, 1, 2, 3)
const letterToIndex = (letter: string): number => {
  return letter.toLowerCase().charCodeAt(0) - 97; // 'a' = 0, 'b' = 1, etc.
};

// Transform JSON question format to internal Question type
export const transformQuestion = (jsonQuestion: QuestionJSON, index: number): Question => {
  const correctIndices = jsonQuestion.correct_response.map((letter) =>
    letterToIndex(letter.trim()),
  );

  const choices = jsonQuestion.answers.map((answer, idx) => ({
    id: `q${index + 1}c${idx + 1}`,
    text: answer,
  }));

  return {
    id: `q${index + 1}`,
    text: jsonQuestion.question,
    choices,
    correctIndices,
    multiple: correctIndices.length > 1,
    explanation: jsonQuestion.explanation,
  };
};

// Load questions for a specific category
export const loadCategoryQuestions = async (category: string): Promise<Question[]> => {
  const filePath = categoryFiles[category];

  if (!filePath) {
    throw new Error(`Unknown category: ${category}`);
  }

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load category: ${category}`);
    }

    const data: CategoryData = await response.json();
    return data.questions.map((q, idx) => transformQuestion(q, idx));
  } catch (error) {
    console.error(`Error loading category ${category}:`, error);
    throw error;
  }
};

// Get all available categories
export const getAvailableCategories = (): string[] => {
  return Object.keys(categoryFiles);
};
