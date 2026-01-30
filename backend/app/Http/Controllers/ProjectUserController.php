<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ProjectUserController extends Controller {

    public function attach(Request $request) {
        try {
            $validated = $request->validate(
                [
                    'project_id' => 'required|integer|exist:projects,id',
                    'user_id' => 'required|integer|exist:usesrs,id',
                    'role' => 'nullable|string|max:50'
                ]

            );
            $project = Project::find($validated['project_id']);
            $user = User::find($validated['user_id']);
            $existing = DB::table('project_user')
                ->where('project_id', $project->id)
                ->where('user_id', $user->id)
                ->first();

            if ($existing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Пользователь уже прикреплен к проекту'
                ], 409);
            }
            $project->users()->attach($user->id, [
                'role' => $validate['role'] ?? 'member'
            ]);
            $attachment = DB::table('project_user')
                ->where('project_id', $project->id)
                ->where('user_id', $user->id)
                ->first();
            return response()->json([
                'success' => true,
                'message' => 'Пользователь прикреплен к проекту',
                'data' => $attachment
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка валидации',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при прикреплении пользователя',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function dettach(Request $request) {
        try {
            $validated = $request->validate(
                [
                    'project_id' => 'required|integer|exist:projects,id',
                    'user_id' => 'required|integer|exist:usesrs,id',

                ]

            );
            $project = Project::find($validated['project_id']);
            $user = User::find($validated['user_id']);


            $existing = DB::table('project_user')
                ->where('project_id', $project->id)
                ->where('user_id', $user->id)
                ->first();

            if (!$existing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Связь не найдена'
                ], 404);
            }
            $project->users()->detach($user->id);
            return response()->json([
                'success' => true,
                'message' => 'Пользователь откреплен от проекта',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка валидации',
                'errors' => $e->errors()
            ], 422);
        }
    }
}
