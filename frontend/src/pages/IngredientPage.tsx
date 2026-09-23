import { useIngredients } from "../hooks/useIngredients";

function IngredientPage() {
    const {
        userIngredients,
        masterIngredients,
        errorMessage,
        ownedIds,
        searchQuery,
        setSearchQuery,
        handleRemove,
        handleToggle,
    } = useIngredients();

    return (
        <div>
            <h1 className="text-2xl font-bold text-app-ink">食材管理</h1>
            <p className="text-sm text-app-gray mt-1 mb-6">
                現在お持ちの食材の管理を行います。自動レシピマッチングに利用されます。
            </p>

            {errorMessage && (
                <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}

            <div className="bg-app-white rounded-2xl shadow-md p-8">
                <input
                    type="text"
                    placeholder="食材を絞り込む..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-app-white border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-1 focus:ring-app-focus"
                />

                <p className="text-sm text-app-ink mb-3">
                    登録済みの食材 ({userIngredients.length}件)
                </p>

                <ul className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-gray-200">
                    {userIngredients.map((ingredient) => (
                        <li
                            key={ingredient.id}
                            onClick={() => handleRemove(ingredient.id)}
                            className="flex items-center gap-2 bg-app-background text-app-ink text-sm px-3 py-2 rounded-lg cursor-pointer"
                        >
                            {ingredient.name}
                            <button
                                type="button"
                                className="text-app-gray cursor-pointer"
                                aria-label={`${ingredient.name}を削除`}
                            >
                                ×
                            </button>
                        </li>
                    ))}
                </ul>

                <p className="text-sm text-app-ink mb-3">食材一覧</p>
                <ul className="flex flex-wrap gap-2">
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
            </div>
        </div>
    );
}

export default IngredientPage;
