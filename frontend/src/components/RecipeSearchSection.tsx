import { useState } from "react";
import type {
  RecipeSearchItem,
} from "../types/Recipe.types";
import RecipeCard from "./RecipeCard";

interface RecipeSearchSectionProps {
  title: string;
  items: RecipeSearchItem[];
}

function RecipeSearchSection({ title, items }: RecipeSearchSectionProps) {
  const [isExpanded, setExpanded] = useState(false);
  const handleExpanded = () => {
    setExpanded(!isExpanded);
  };

  return (
    <div className="mb-8">
      <h2 className="font-bold text-app-ink mb-4">{title}</h2>
      <div className="flex">
        {items.length > 0 ? (
          <ul className="grid grid-cols-3 w-full gap-4">
            {items.map((item, index) => {
              if (!isExpanded && index >= 3) {
                return null;
              }

              return (
                <RecipeCard
                  key={item.recipe.id}
                  name={item.recipe.name}
                  ingredients={item.recipe.ingredients}
                  cooking_time={item.recipe.cooking_time}
                  image_path={item.recipe.image_path}
                  missingIngredientNames={item.missingIngredientNames}
                />
              );
            })}
          </ul>
        ) : (
          <p className="font-bold border rounded py-2 w-full text-app-white bg-[#837c7a] text-center">レシピが見つかりませんでした。</p>
        )}
      </div>
      {items.length > 3 && (
        <button
          type="button"
          onClick={handleExpanded}
          className="px-21 py-2 font-bold w-full bg-app-ink text-app-white mt-5 rounded"
        >
          {isExpanded ? "一覧を閉じる" : "一覧を表示する"}
        </button>
      )}
    </div>
  );
}

export default RecipeSearchSection;
