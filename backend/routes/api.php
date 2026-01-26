<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'show']);
    Route::get('/{id}',[UserController::class,'getUser']);
    Route::post('/register', [UserController::class, 'register']);
    Route::delete('/{id}',[UserController::class,'deleteUser']);
    Route::put('{/{id}',[UserController::class,'update']);
});
