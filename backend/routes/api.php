<?php

use App\Http\Controllers\IngredientController;
use App\Http\Controllers\UserIngredientController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/ingredients', [IngredientController::class, 'index']);

    Route::get('/user-ingredients', [UserIngredientController::class, 'index']);
    Route::post('/user-ingredients', [UserIngredientController::class, 'store']);
    Route::delete('/user-ingredients/{ingredient}', [UserIngredientController::class, 'destroy']);
});
