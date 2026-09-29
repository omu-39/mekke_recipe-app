<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

#[Fillable(['name', 'user_id', 'image_path', 'cooking_time'])]
class Recipe extends Model
{
    use HasFactory;

    /**
     * DBには公開ディスク上の相対パスのみを保存し、
     * APIレスポンスでは公開URLに変換して返す。
     */
    protected function imagePath(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value ? Storage::disk('public')->url($value) : null,
        );
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ingredients(): BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class, 'recipe_ingredient')->withPivot('quantity');
    }

    public function recipeSteps(): HasMany
    {
        return $this->hasMany(RecipeStep::class)->orderBy('step_number');
    }
}
