<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Models\Task;
class TaskController extends Controller
{
    public function show(){
        $task=Task::all();
        return response()->json([
            "success"=>true,
            'data'=>$task,
        ]);
    }
    public function getTask($id){
        $task=Task::find($id);
        return response()->json([
            "success"=>true,
            'data'=>$task,
        ]);
    }
    public function create(Request $request){
        try{
        $validate=$request->validate([
            'name'=>'required|string|max:255',
            'description'=>'nullable|string',
            'status' => 'required|string|in:' . implode(',', Status::values()),
            'priority' => 'required|string|in:' . implode(',', Priority::values()),
            'priorityId'=>'required|integer',
            'deadline'=>'nullable|date',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50'
        ]);
        $task=Task::create($validate);
        return response()->json([
            'success'=>true,
            'data'=>$task
        ],201);
        }catch(ValidationException $e){
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
        $task = Task::find($id);
        if (!$task) {
            return response()->json(['error' => 'Проект не найден'], 404);
        }
        $task->update($request->all());
        return response()->json([
            'success' => true,
            'data' => $task

        ]);
    }
    public function delete($id){
        $task=Task::find($id);
        if (!$task) {
            return response()->json([
                'success' => false,
                'message' => 'Проект не найден'

            ]);
        }
        $task->delete();
        return response()->json([
            'message' => "Проект удален"
        ]);
    }
}
