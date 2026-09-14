<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['name'])]
class Ingredient extends Model
{
    use HasFactory;

    /**
     * この食材を所持しているユーザー一覧。
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_ingredients');
    }

    public function recipes(): BelongsToMany
    {
        return $this->belongsToMany(Recipe::class, 'recipe_ingredient');
    }
}
