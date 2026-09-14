export interface Ingredient {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface UserIngredient extends Ingredient {
  pivot: {
    user_id: number;
    ingredient_id: number;
  };
}
