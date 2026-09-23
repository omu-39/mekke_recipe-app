import { useState, useEffect } from "react";
import type { Ingredient, UserIngredient } from "../types/Ingredient.types";
import {
    addUserIngredient,
    fetchIngredients,
    fetchUserIngredients,
    removeUserIngredient,
} from "../api/ingredient.api";

export function useIngredients() {
    const [userIngredients, setUserIngredients] = useState<UserIngredient[]>(
        [],
    );
    const [masterIngredients, setMasterIngredients] = useState<Ingredient[]>(
        [],
    );
    const [errorMessage, setErrorMessage] = useState("");
    const ownedIds = new Set(userIngredients.map((i) => i.id));
    const [searchQuery, setSearchQuery] = useState("");

    const loadUserIngredients = async () => {
        try {
            const data = await fetchUserIngredients();
            setUserIngredients(data);
        } catch {
            setErrorMessage("所持食材の取得に失敗しました。");
        }
    };

    const handleRemove = async (ingredientId: number) => {
        try {
            await removeUserIngredient(ingredientId);
            await loadUserIngredients();
        } catch {
            setErrorMessage("食材の削除に失敗しました。");
        }
    };

    const handleAdd = async (ingredientId: number) => {
        try {
            await addUserIngredient(ingredientId);
            await loadUserIngredients();
        } catch {
            setErrorMessage("食材の追加に失敗しました。");
        }
    };

    useEffect(() => {
        loadUserIngredients();
    }, []);

    useEffect(() => {
        fetchIngredients(searchQuery || undefined)
            .then(setMasterIngredients)
            .catch(() => setErrorMessage("食材の検索に失敗しました。"));
    }, [searchQuery]);

    const handleToggle = async (ingredientId: number) => {
        if (ownedIds.has(ingredientId)) {
            await handleRemove(ingredientId);
        } else {
            await handleAdd(ingredientId);
        }
    };

    return {
        userIngredients,
        masterIngredients,
        errorMessage,
        ownedIds,
        searchQuery,
        handleToggle,
        setSearchQuery,
        handleRemove,
        handleAdd,
    };
}
