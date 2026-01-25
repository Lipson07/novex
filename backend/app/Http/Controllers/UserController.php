<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller {

    public function show() {
        $user = User::all();
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    public function register(Request $request) {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'password' => 'required|string|min:6',
                'email' => 'required|email|max:255|uniq:users',
                'role' => 'nullable|string',
                'avatar_path' => 'nullable|string'

            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'user',
            'avatar' => false,
            'avatar_path' => $validated['avatar_path'],
            'last_seen_at' => now(),
            'is_online' => true
        ]);
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            "success" => true,
            'message' => 'Пользователь создан',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'avatar_path' => $user->avatar_path,
                    'is_online' => $user->is_online,
                ],
                'access_token' => $token,
                'token_type' => 'Bearer',


            ]
        ]);
    }
}
