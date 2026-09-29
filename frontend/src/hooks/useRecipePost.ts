import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Ingredient } from "../types/Ingredient.types";
import { fetchIngredients } from "../api/ingredient.api";
import { createRecipe } from "../api/recipe.api";

/**
 * レシピ投稿画面（UC-06-01）のフォーム状態とロジックを管理するフック。
 */
export function useRecipePost() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [cookingTime, setCookingTime] = useState("");

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
        null,
    );

    const [masterIngredients, setMasterIngredients] = useState<Ingredient[]>(
        [],
    );
    const [selectedIngredients, setSelectedIngredients] = useState<
        Ingredient[]
    >([]);
    const [isIngredientPickerOpen, setIsIngredientPickerOpen] =
        useState(false);

    const [steps, setSteps] = useState<string[]>(["", ""]);

    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchIngredients()
            .then(setMasterIngredients)
            .catch(() => setErrorMessage("食材の取得に失敗しました。"));
    }, []);

    const handleImageSelect = (file: File) => {
        setImageFile(file);
        setImagePreviewUrl(URL.createObjectURL(file));
    };

    const handleToggleIngredientPicker = () => {
        setIsIngredientPickerOpen(!isIngredientPickerOpen);
    };

    const handleAddIngredient = (ingredientId: number) => {
        if (selectedIngredients.some((i) => i.id === ingredientId)) {
            return;
        }
        const ingredient = masterIngredients.find(
            (i) => i.id === ingredientId,
        );
        if (ingredient) {
            setSelectedIngredients([...selectedIngredients, ingredient]);
        }
    };

    const handleRemoveIngredient = (ingredientId: number) => {
        setSelectedIngredients(
            selectedIngredients.filter((i) => i.id !== ingredientId),
        );
    };

    const handleStepChange = (index: number, value: string) => {
        setSteps(steps.map((step, i) => (i === index ? value : step)));
    };

    const handleAddStep = () => {
        setSteps([...steps, ""]);
    };

    const handleRemoveStep = (index: number) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!name || !cookingTime || selectedIngredients.length === 0) {
            setErrorMessage("レシピ名・材料・調理時間を入力してください。");
            return;
        }

        const filledSteps = steps
            .map((step) => step.trim())
            .filter((step) => step.length > 0);

        if (filledSteps.length === 0) {
            setErrorMessage("調理手順を1件以上入力してください。");
            return;
        }

        setIsSubmitting(true);
        try {
            const recipe = await createRecipe({
                name,
                cooking_time: Number(cookingTime),
                image: imageFile,
                ingredients: selectedIngredients.map((ingredient) => ({
                    ingredient_id: ingredient.id,
                })),
                steps: filledSteps,
            });
            navigate(`/recipes/${recipe.id}`);
        } catch {
            setErrorMessage("レシピの投稿に失敗しました。");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        name,
        setName,
        cookingTime,
        setCookingTime,
        imageFile,
        imagePreviewUrl,
        handleImageSelect,
        masterIngredients,
        selectedIngredients,
        isIngredientPickerOpen,
        handleToggleIngredientPicker,
        handleAddIngredient,
        handleRemoveIngredient,
        steps,
        handleStepChange,
        handleAddStep,
        handleRemoveStep,
        errorMessage,
        isSubmitting,
        handleSubmit,
    };
}
