import { Question, QuestionJSON, CategoryData } from '@/types/quiz';

// Import JSON files directly as modules
import linuxData from '@/data/Linux.json';
import systemData from '@/data/System.json';
import cloudData from '@/data/Cloud.json';
import securityData from '@/data/Security.json';
import devopsData from '@/data/DevOps.json';
import itData from '@/data/IT.json';

// Map category IDs to imported data
const categoryData: Record<string, CategoryData> = {
  linux: linuxData as CategoryData,
  system: systemData as CategoryData,
  cloud: cloudData as CategoryData,
  security: securityData as CategoryData,
  devops: devopsData as CategoryData,
  it: itData as CategoryData,
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
  const data = categoryData[category];

  if (!data) {
    throw new Error(`Unknown category: ${category}`);
  }

  try {
    return data.questions.map((q, idx) => transformQuestion(q, idx));
  } catch (error) {
    console.error(`Error loading category ${category}:`, error);
    throw error;
  }
};

// Get all available categories
export const getAvailableCategories = (): string[] => {
  return Object.keys(categoryData);
};
