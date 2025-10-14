export interface TestQuestionOption {
  id: string;
  text: string;
}

export interface TestQuestion {
  id: string;
  text: string;
  options: TestQuestionOption[];
  correctOptionId: string;
  hint?: string;
  explanation?: string;
}

export interface TestModule {
  id: string;
  title: string;
  duration: string;
  questionsCount: number;
  description: string;
  questions: TestQuestion[];
  recommendedChecklists?: string[];
  recommendedArticles?: string[];
  recommendedTests?: string[];
  badges?: string[];
}
