<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectUserController;
use App\Http\Controllers\TaskController;
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
Route::prefix('tasks')->group(function(){
    Route::get('/', [TaskController::class, 'show']);
    Route::get('/{id}', [TaskController::class, 'getTask']);
    Route::post('/create', [TaskController::class, 'create']);
    Route::delete('/{id}', [TaskController::class, 'delete']);
    Route::put('{/{id}', [TaskController::class, 'update']);
});
Route::prefix('project-users')->group(function () {
    Route::get('/', [ProjectUserController::class, 'show']);
    Route::get('/user/{id}', [ProjectUserController::class, 'getUser']);
    Route::get('/project/{id}', [ProjectUserController::class, 'getProject']);
    Route::post('/attach', [ProjectUserController::class, 'attach']);
    Route::post('/attach-multiple', [ProjectUserController::class, 'attachMultiple']);
    Route::post('/detach', [ProjectUserController::class, 'dettach']);
    Route::post('/detach-multiple', [ProjectUserController::class, 'detachMultiple']);
    Route::post('/detach-all', [ProjectUserController::class, 'detachAll']);
});
 
