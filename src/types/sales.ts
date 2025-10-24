export interface SalesPlaybookStep {
  title: string;
  prompt: string;
  example: string;
}

export interface SalesPlaybook {
  id: string;
  title: string;
  scenario: string;
  goal: string;
  triggers: string[];
  steps: SalesPlaybookStep[];
  closing: string;
  upsellIdeas: string[];
}

export interface ObjectionResponse {
  id: string;
  objection: string;
  empathy: string;
  answer: string;
  followUp: string;
}

export interface BundleIdea {
  id: string;
  name: string;
  description: string;
  heroProduct: string;
  contents: string[];
  priceAnchor: string;
  pitch: string;
}

export interface DailyFocus {
  id: string;
  title: string;
  context: string;
  actions: string[];
  metric: string;
}
