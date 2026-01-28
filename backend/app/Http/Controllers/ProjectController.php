<?php

namespace App\Http\Controllers;

use App\Enums\Projects\ProjectPriority;
use App\Enums\Projects\ProjectStatus;
use Illuminate\Http\Request;
use App\Models\Project;
use Illuminate\Validation\ValidationException;

class ProjectController extends Controller {
    public function show() {
        $project = Project::all();
        return response()->json([
            "success" => true,
            "data" => $project,
        ]);
    }
    public function getProject($id) {
        $project = Ptoject::find($id);
        return response()->json([
            'success' => true,
            'data' => $project

        ]);
    }
    public function create(Request $request) {
        try {
            $validate = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'required|string|in:' . implode(',', ProjectStatus::values()),
                'priority' => 'required|string|in:' . implode(',', ProjectPriority::values()),
            ]);
            $project = Project::create($validate);
            return response()->json([
                'success' => true,
                'data' => $project
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка валидации',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при создании проекта',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function update(Request $request, $id) {
        $project = Ptoject::find($id);
        if (!$project) {
            return response()->json(['error' => 'Проект не найден'], 404);
        }
        $project->update($request->all());
        return response()->json([
            'success' => true,
            'data' => $project

        ]);
    }
    public function deleteProject($id) {
        $project = Project::find($id);
        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Проект не найден'

            ]);
        }
        $project->delete();
        return response()->json([
            'message' => "Проект удален"
        ]);
    }
}
