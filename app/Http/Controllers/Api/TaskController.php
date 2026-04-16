<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the authenticated user's tasks.
     */
    public function index(Request $request): JsonResponse
    {
        $tasks = $request->user()
            ->tasks()
            ->latest()
            ->get();

        return response()->json($tasks);
    }

    /**
     * Store a newly created task for the authenticated user.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'completed' => ['nullable', 'boolean'],
        ]);

        $task = $request->user()->tasks()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'completed' => $validated['completed'] ?? false,
        ]);

        return response()->json($task, 201);
    }

    /**
     * Display the specified task.
     */
    public function show(Request $request, Task $task): JsonResponse
    {
        abort_unless($task->user_id === $request->user()->id, 403, 'Unauthorized.');

        return response()->json($task);
    }

    /**
     * Update the specified task.
     */
    public function update(Request $request, Task $task): JsonResponse
    {
        abort_unless($task->user_id === $request->user()->id, 403, 'Unauthorized.');

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'completed' => ['required', 'boolean'],
        ]);

        $task->update($validated);

        return response()->json($task->fresh());
    }

    /**
     * Remove the specified task.
     */
    public function destroy(Request $request, Task $task): JsonResponse
    {
        abort_unless($task->user_id === $request->user()->id, 403, 'Unauthorized.');

        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully.',
        ]);
    }
}