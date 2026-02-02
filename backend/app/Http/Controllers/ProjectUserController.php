<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use GuzzleHttp\Handler\Proxy;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ProjectUserController extends Controller {
    public function show(Request $request) {
        try {

            $projectUsers = DB::table('project_user')->get();

            return response()->json([
                'success' => true,
                'message' => 'Список связей проектов и пользователей',
                'data' => $projectUsers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при получении данных',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getUser($id) {
        try {

            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Пользователь не найден'
                ], 404);
            }
            $project = $user->projects()->withPivot('role')->get();
            return response()->json([
                "success" => true,
                "data" => $project
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при получении данных',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getProject($id) {
        try {

            $project = Project::find($id);

            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Пользователь не найден'
                ], 404);
            }
            $user = $project->users()->get();
            return response()->json([
                "success" => true,
                "data" => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при получении данных',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function detachMultiple(Request $request) {
        try {
            $validated = $request->validate([
                'project_id' => 'required|integer|exists:projects,id',
                'user_ids' => 'required|array',
                'user_ids.*' => 'integer|exists:users,id'
            ]);

            $project = Project::find($validated['project_id']);

            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Проект не найден'
                ], 404);
            }

            $detachedUsers = [];
            $notAttached = [];

            foreach ($validated['user_ids'] as $userId) {
                $user = User::find($userId);

                if (!$user) {
                    continue;
                }

                $existing = DB::table('project_user')
                    ->where('project_id', $project->id)
                    ->where('user_id', $user->id)
                    ->exists();

                if ($existing) {
                    $project->users()->detach($user->id);
                    $detachedUsers[] = $user->id;
                } else {
                    $notAttached[] = $user->id;
                }
            }

            $result = [
                'detached_users' => $detachedUsers,
                'not_attached' => $notAttached,
                'total_detached' => count($detachedUsers)
            ];

            return response()->json([
                'success' => true,
                'message' => 'Пользователи откреплены от проекта',
                'data' => $result
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
                'message' => 'Ошибка при откреплении пользователей',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function detachAll(Request $request) {
        try {
            $validated = $request->validate([
                'project_id' => 'required|integer|exists:projects,id'
            ]);

            $project = Project::find($validated['project_id']);

            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Проект не найден'
                ], 404);
            }


            $countBefore = DB::table('project_user')
                ->where('project_id', $project->id)
                ->count();


            $project->users()->detach();

            $countAfter = DB::table('project_user')
                ->where('project_id', $project->id)
                ->count();

            return response()->json([
                'success' => true,
                'message' => 'Все пользователи откреплены от проекта',
                'data' => [
                    'removed_count' => $countBefore,
                    'current_count' => $countAfter
                ]
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
                'message' => 'Ошибка при откреплении всех пользователей',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function attachMultiple(Request $request) {
        try {
            $validated = $request->validate([
                'project_id' => 'required|integer|exists:projects,id',
                'user_ids' => 'required|array',
                'user_ids.*' => 'integer|exists:users,id',
                'role' => 'nullable|string|max:50'
            ]);

            $project = Project::find($validated['project_id']);

            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Проект не найден'
                ], 404);
            }

            $attachedUsers = [];
            $alreadyAttached = [];
            $invalidUsers = [];

            foreach ($validated['user_ids'] as $userId) {
                $user = User::find($userId);

                if (!$user) {
                    $invalidUsers[] = $userId;
                    continue;
                }

                $existing = DB::table('project_user')
                    ->where('project_id', $project->id)
                    ->where('user_id', $user->id)
                    ->exists();

                if ($existing) {
                    $alreadyAttached[] = $user->id;
                } else {

                    $project->users()->attach($user->id, [
                        'role' => $validated['role'] ?? 'member'
                    ]);
                    $attachedUsers[] = $user->id;
                }
            }

            $result = [
                'attached_users' => $attachedUsers,
                'already_attached' => $alreadyAttached,
                'invalid_users' => $invalidUsers,
                'total_attached' => count($attachedUsers)
            ];

            return response()->json([
                'success' => true,
                'message' => 'Пользователи прикреплены к проекту',
                'data' => $result
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
                'message' => 'Ошибка при прикреплении пользователей',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function attach(Request $request) {
        try {
            $validated = $request->validate(
                [
                    'project_id' => 'required|integer|exists:projects,id',
                    'user_id' => 'required|integer|exists:users,id',
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
                    'project_id' => 'required|integer|exists:projects,id',
                    'user_id' => 'required|integer|exists:users,id',

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
