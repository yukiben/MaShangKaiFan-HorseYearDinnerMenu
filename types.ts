
export interface Dish {
  id: string;
  type: 'appetizer' | 'main' | 'soup' | 'staple' | 'dessert';
  name: string; // The auspicious horse-themed name
  originalName: string; // The common name
  meaning: string;
  ingredients: Ingredient[];
  steps: string[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
}

export interface Ingredient {
  item: string;
  amount: string;
  category: 'meat' | 'vegetable' | 'seafood' | 'pantry' | 'other';
}

export interface UserInput {
  peopleCount: number;
  tastes: string[];
  restrictions: string;
  nominatedDishes: string[];
  horseCreative: boolean;
}

export interface CookingTask {
  id: string;
  time: string;
  action: string;
  description: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface MenuData {
  dishes: Dish[];
  overallMeaning: string;
}
