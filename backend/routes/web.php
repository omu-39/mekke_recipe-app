<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AccountController;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware('auth:sanctum')->delete('/account', [AccountController::class, 'destroy']);
