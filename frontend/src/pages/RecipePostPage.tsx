import { useRecipePost } from "../hooks/useRecipePost";

function RecipePostPage() {
    const {
        name,
        setName,
        cookingTime,
        setCookingTime,
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
    } = useRecipePost();

    return (
        <div>
            <h1 className="text-2xl font-bold text-app-ink">
                レシピを投稿する
            </h1>
            <p className="text-sm text-app-gray mt-1 mb-6">
                お手持ちのアイデアレシピを入力して、みんなと共有しましょう
            </p>

            {errorMessage && (
                <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}

            <form
                onSubmit={handleSubmit}
                className="bg-app-white rounded-2xl shadow-md p-8"
            >
                <label className="block text-sm font-bold text-app-ink mb-3">
                    料理画像
                </label>
                <label className="flex flex-col items-center justify-center gap-2 w-full h-56 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer mb-8 overflow-hidden">
                    <input
                        type="file"
                        accept="image/jpeg,image/png"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                handleImageSelect(file);
                            }
                        }}
                    />
                    {imagePreviewUrl ? (
                        <img
                            src={imagePreviewUrl}
                            alt="料理画像プレビュー"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <>
                            <span className="text-2xl text-app-gray">⭱</span>
                            <span className="text-sm text-app-ink">
                                料理画像を追加
                            </span>
                            <span className="text-xs text-app-gray">
                                ドラッグ＆ドロップ、またはファイルを選択
                            </span>
                        </>
                    )}
                </label>

                <label className="block text-sm font-bold text-app-ink mb-3">
                    レシピ名
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例: 簡単コク旨親子丼"
                    className="w-full bg-app-white border border-gray-300 rounded-lg px-4 py-3 mb-8 focus:outline-none focus:ring-1 focus:ring-app-focus"
                />

                <label className="block text-sm font-bold text-app-ink mb-3">
                    材料
                </label>
                <div className="relative mb-8">
                    <ul className="flex flex-wrap items-center gap-2">
                        {selectedIngredients.map((ingredient) => (
                            <li
                                key={ingredient.id}
                                className="flex items-center gap-2 bg-app-background text-app-ink text-sm px-3 py-2 rounded-lg"
                            >
                                {ingredient.name}
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveIngredient(ingredient.id)
                                    }
                                    className="text-app-gray cursor-pointer"
                                    aria-label={`${ingredient.name}を削除`}
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                        <li>
                            <button
                                type="button"
                                onClick={handleToggleIngredientPicker}
                                className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg border border-dashed border-gray-300 text-app-gray cursor-pointer"
                            >
                                ＋ 追加
                            </button>
                        </li>
                    </ul>

                    {isIngredientPickerOpen && (
                        <ul className="flex flex-wrap gap-2 mt-4 p-4 bg-app-background rounded-lg">
                            {masterIngredients.map((ingredient) => (
                                <li key={ingredient.id}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAddIngredient(ingredient.id)
                                        }
                                        className="text-sm px-3 py-2 rounded-lg bg-app-white text-app-ink border border-gray-300 cursor-pointer"
                                    >
                                        {ingredient.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <label className="block text-sm font-bold text-app-ink mb-3">
                    調理手順
                </label>
                <div className="flex flex-col gap-4 mb-4">
                    {steps.map((step, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-app-ink">
                                    ステップ {index + 1}
                                </span>
                                {steps.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveStep(index)
                                        }
                                        className="text-xs text-app-gray cursor-pointer"
                                        aria-label={`ステップ${index + 1}を削除`}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                            <input
                                type="text"
                                value={step}
                                onChange={(e) =>
                                    handleStepChange(index, e.target.value)
                                }
                                placeholder={
                                    index === 0
                                        ? "材料の下準備や切り方を入力"
                                        : "炒める、煮るなどの調理方法を入力"
                                }
                                className="w-full bg-app-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-app-focus"
                            />
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={handleAddStep}
                    className="w-full text-sm font-bold text-app-ink border border-dashed border-gray-300 rounded-lg py-3 mb-8 cursor-pointer"
                >
                    ＋ ステップ追加
                </button>

                <label className="block text-sm font-bold text-app-ink mb-3">
                    調理時間 (分)
                </label>
                <input
                    type="number"
                    value={cookingTime}
                    onChange={(e) => setCookingTime(e.target.value)}
                    placeholder="例: 15"
                    className="w-full bg-app-white border border-gray-300 rounded-lg px-4 py-3 mb-8 focus:outline-none focus:ring-1 focus:ring-app-focus"
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full font-bold text-app-white bg-app-ink rounded-lg py-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "投稿中..." : "レシピを投稿する"}
                </button>
            </form>
        </div>
    );
}

export default RecipePostPage;
