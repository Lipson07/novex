<?php

use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Models\Project;

Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'show']);
    Route::get('/{id}', [UserController::class, 'getUser']);
    Route::post('/register', [UserController::class, 'register']);
    Route::delete('/{id}', [UserController::class, 'deleteUser']);
    Route::put('{/{id}', [UserController::class, 'update']);
});
Route::prefix('projects')->group(function () {
    Route::get('/', [ProjectController::class, 'show']);
    Route::get('/{id}', [ProjectController::class, 'getProject']);
    Route::post('/create', [ProjectController::class, 'create']);
    Route::delete('/{id}', [ProjectController::class, 'deleteProject']);
    Route::put('{/{id}', [ProjectController::class, 'update']);
});
Route::prefix('project-users')->group(function () {
    Route::post('/attach', [ProjectUserController::class, 'attach']);
    Route::post('/detach', [ProjectUserController::class, 'detach']);
});
