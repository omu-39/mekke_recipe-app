import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchRecipe } from "../api/recipe.api";
import { useIngredients } from "../hooks/useIngredients";
import type { Recipe } from "../types/Recipe.types";

function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { ownedIds } = useIngredients();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchRecipe(Number(id))
      .then(setRecipe)
      .catch(() => setErrorMessage("レシピの取得に失敗しました。"));
  }, [id]);

  if (errorMessage) {
    return <p className="text-red-500 text-sm">{errorMessage}</p>;
  }

  if (!recipe) {
    return <p>読み込み中...</p>;
  }

  return (
    <div>
      <div className="bg-app-white rounded-2xl shadow-md overflow-hidden mb-6">
        {recipe.image_path ? (
          <img
            src={recipe.image_path}
            alt={recipe.name}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200" />
        )}
      </div>

      <div className="bg-app-white rounded-2xl shadow-md p-8 mb-6">
        <h2 className="font-bold text-app-ink mb-4">調理手順</h2>
        <ol className="space-y-3">
          {recipe.recipe_steps.map((step) => (
            <li key={step.id} className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-app-ink text-white text-sm shrink-0">
                {step.step_number}
              </span>
              <p className="text-app-ink">{step.content}</p>
            </li>
          ))}
        </ol>
      </div>

      {recipe.user && (
        <div className="bg-app-background rounded-2xl p-4 mb-6">
          <p className="text-sm text-app-gray">投稿者: {recipe.user.name}</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-app-ink">{recipe.name}</h1>
      </div>
      <p className="text-sm text-app-gray mb-6">
        調理時間: {recipe.cooking_time}分
      </p>

      <div className="bg-app-white rounded-2xl shadow-md p-8">
        <h2 className="font-bold text-app-ink mb-4">材料</h2>
        <ul className="divide-y divide-gray-200">
          {recipe.ingredients.map((ingredient) => {
            const isOwned = ownedIds.has(ingredient.id);
            return (
              <li
                key={ingredient.id}
                className="flex items-center justify-between py-3"
              >
                <span className="flex items-center gap-2 text-app-ink">
                  <span className={isOwned ? "text-green-600" : "text-red-500"}>
                    {isOwned ? "✓" : "×"}
                  </span>
                  {ingredient.name}
                </span>
                <span className="text-sm text-app-gray">
                  {ingredient.pivot.quantity}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default RecipeDetailPage;
