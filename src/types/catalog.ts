export interface CatalogAvailability {
  location: string;
  stock: number;
  replenishmentEta?: string;
}

export type CatalogInstructionType = "video" | "ar";

export interface CatalogInstruction {
  id: string;
  title: string;
  type: CatalogInstructionType;
  description?: string;
  source: string;
  thumbnail?: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  image: string;
  url: string;
  videoUrl?: string;
  availability: CatalogAvailability[];
  crossSellIds?: string[];
  instructions?: CatalogInstruction[];
}
