import { Link } from "react-router-dom";
import type { RecipeIngredient } from "../types/Ingredient.types";

export interface RecipeCardProps {
    id: number;
    name: string;
    ingredients: RecipeIngredient[];
    cooking_time: number;
    image_path: string | null;
    missingIngredientNames?: string[];
}

function RecipeCard({
    id,
    name,
    ingredients,
    cooking_time,
    image_path,
    missingIngredientNames,
}: RecipeCardProps) {
    return (
      <Link
        to={`/recipes/${id}`}
        className="w-full h-auto rounded-2xl bg-app-white block shadow"
      >
        <div className="w-auto h-auto rounded-2xl mx-3 my-2">
          {image_path ? (
            <div className="w-auto h-25 border border-app-background rounded">
              <img src={image_path} alt={name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full h-25 bg-gray-200 rounded-lg mb-2"></div>
          )}
          <h3 className="text-[15px] font-bold text-black">{name}</h3>
          <p className="text-[12px] text-app-gray mb-2">
            {ingredients.map((ingredient) => ingredient.name).join(",")}
          </p>
          <p className="items-end text-app-gray">{cooking_time}分</p>
          {missingIngredientNames && missingIngredientNames.length > 0 && (
            <p className="text-[#992a1b] text-[12px] font-bold bg-[#f8e4e2] rounded px-3 py-1">
              不足: {missingIngredientNames.join(",")}
            </p>
          )}
        </div>
      </Link>
    );
}

export default RecipeCard;