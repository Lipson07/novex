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

    public function getUser($id){
            $user=User::find($id);
            if(!$user){
                return response()->json([
                    'success'=>false,
                    'message'=>'пользователь не найден'
                ],404);
            }
            return response()->json([
                'success'=>true,
                'data'=>$user
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
    public function update(Request $request,$id){
        $user=User::find($id);
        if (!$user){
            return response()->json(['error'=>'Пользователь не найден'],404);
        }
        $user->update($request->all());
        return response()->json([
            'message'=>'Пользователь обновлен',
            'user'=>$user
        ]);


    }
    public function deleteUser($id){
        $user=User::find($id);
        if(!$user){
            return response()->json([
                'success'=>false,
                'message'=>'пользователь не найден'

            ]);
        }
        $user->delete();
        return response()->json([
            'message'=>"Пользователь удален"
        ]);

    }
}
