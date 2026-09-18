import type { RecipeIngredient } from "../types/Ingredient.types";

export interface RecipeCardProps {
    name: string;
    ingredients: RecipeIngredient[];
    cooking_time: number;
    image_path: string | null;
    missingIngredientNames?: string[];
}

function RecipeCard({
    name,
    ingredients,
    cooking_time,
    image_path,
    missingIngredientNames,
}: RecipeCardProps) {
    return (
        <div className="w-90 h-52.5 rounded-2xl bg-app-white">
            <div className="w-85 h-27.5 rounded-2xl m-3">
                {image_path ? (
                    <img src={image_path} alt={name} className="w-full h-full" />
                ) : (
                    <div className="w-full h-full bg-gray-200"></div>
                )}
                <h3 className="text-[15px] font-bold text-black">{name}</h3>
                <p className="text-[12px] text-app-gray">
                    {ingredients.map((ingredient) => ingredient.name).join(",")}
                </p>
                <p className="items-end text-app-gray">{cooking_time}分</p>
                {missingIngredientNames && missingIngredientNames.length > 0 && (
                    <div className="bg-red-400 w-full">
                        <p className="text-red-800">
                            不足:{missingIngredientNames.join(",")}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecipeCard;