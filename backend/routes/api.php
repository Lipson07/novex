<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/create', [AuthController::class, 'create']);
Route::get('/check-user', [AuthController::class, 'checkUser']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/createProj', [ProjectController::class, 'create']); 