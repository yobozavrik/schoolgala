export type CatalogAvailability = "in-stock" | "backorder";

export interface CatalogObjection {
  id: string;
  question: string;
  answer: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  image: string;
  url: string;
  videoUrl?: string;
  segment: string;
  availability: CatalogAvailability;
  badge: string;
  highlights: string[];
  servingTips: string[];
  objections: CatalogObjection[];
  pairingIdeas?: string[];
  allergens?: string[];
  storageNotes?: string;
}
