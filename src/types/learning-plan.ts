export interface LearningPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  checklistIds: string[];
  articleIds: string[];
  testIds: string[];
}
