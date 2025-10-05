export type Choice = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  text: string;
  choices: Choice[];
  correctIndices: number[];
  multiple: boolean;
  explanation?: string;
};

export type QuestionState = {
  selectedIndices: number[];
  submitted: boolean;
};

// New types for JSON format
export type QuestionJSON = {
  question: string;
  answers: string[];
  explanation: string;
  correct_response: string[];
};

export type CategoryData = {
  questions: QuestionJSON[];
};
