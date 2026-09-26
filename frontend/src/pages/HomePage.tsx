import { useState } from "react";
import cross from "../assets/cross.png";
import { useIngredients } from "../hooks/useIngredients";
import { searchRecipes } from "../api/recipe.api";
import type { RecipeSearchResult } from "../types/Recipe.types";
import RecipeSearchSection from "../components/RecipeSearchSection";

function HomePage() {
  const {
    userIngredients,
    masterIngredients,
    errorMessage,
    ownedIds,
    setErrorMessage,
    handleRemove,
    handleToggle,
  } = useIngredients();

  const [searchResults, setSearchResults] = useState<RecipeSearchResult>();

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchRecipe = async () => {
    try {
      const ingredientIds = userIngredients.map((ingredient) => ingredient.id);
      const recipes = await searchRecipes(ingredientIds);
      setSearchResults(recipes);
    } catch {
      setErrorMessage("レシピの検索に失敗しました。");
    }
  };

  return (
    <div className="m-8">
      <div className="mb-8">
        <h1 className="text-black text-[24px] font-bold">
          すぐに作れるレシピを検索！
        </h1>
        <p className="text-app-gray text-[14px]">
          材料に合わせて自動でマッチング！
        </p>
      </div>

      <div className="bg-app-white rounded-2xl p-6">
        <h2 className="font-bold text-black mb-5">所持している食材</h2>

        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}

        <ul className="flex flex-wrap gap-2 pb-6">
          {userIngredients.map((ingredient) => (
            <li
              key={ingredient.id}
              onClick={() => handleRemove(ingredient.id)}
              className="flex items-center gap-2 text-app-ink text-sm px-3 py-2 rounded-full cursor-pointer border border-app-ink bg-app-white"
            >
              {ingredient.name}
              <img src={cross} alt="cross" />
            </li>
          ))}
          <div className="py-2 px-3 border text-app-gray bg-app-background flex rounded-full">
            <button onClick={handleOpen} className="font-bold m-auto">
              {isOpen ? "食材一覧を閉じる" : "食材を追加する"}
            </button>
          </div>
        </ul>

        {isOpen && (
          <ul className="flex flex-wrap gap-2 mt-1 mb-3">
            {masterIngredients.map((ingredient) => {
              const isOwned = ownedIds.has(ingredient.id);
              return (
                <li key={ingredient.id}>
                  <button
                    type="button"
                    onClick={() => handleToggle(ingredient.id)}
                    className={`text-sm px-3 py-2 rounded-lg cursor-pointer ${
                      isOwned
                        ? "bg-app-background text-app-ink border border-gray-300"
                        : "bg-app-ink text-white"
                    }`}
                  >
                    {ingredient.name}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <button
          type="button"
          onClick={() => handleSearchRecipe()}
          className="w-full font-bold bg-app-ink text-app-white py-3 rounded-lg"
        >
          この食材でレシピを検索
        </button>
      </div>
      {searchResults && (
        <div>
          <RecipeSearchSection
            title={"①今作れるレシピ"}
            items={searchResults.makeable}
          />
          <RecipeSearchSection
            title={"②材料が一種類足りないレシピ"}
            items={searchResults.oneShort}
          />
          <RecipeSearchSection
            title={"③材料が複数足りないレシピ"}
            items={searchResults.multiShortage}
          />
        </div>
      )}
    </div>
  );
}

export default HomePage;
