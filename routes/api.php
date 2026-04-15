<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return response()->json([
        'id' => 1,
        'name' => 'Keith Jordan',
        'email' => 'shadow902@gmail.com',
    ]);
});

Route::get('/tasks', function () {
    return response()->json([
        [
            'id' => 1,
            'title' => 'Build Laravel backend',
            'completed' => false,
        ],
        [
            'id' => 2,
            'title' => 'Connect Vue frontend',
            'completed' => true,
        ],
        [
            'id' => 3,
            'title' => 'Create Pinia stores',
            'completed' => false,
        ],
        [
            'id' => 4,
            'title' => 'Test Tasks array',
            'completed' => false,
        ],
    ]);
});

Route::post('/login', function (Request $request) {
    $validated = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required', 'string'],
    ]);

    return response()->json([
        'message' => 'Login successful.',
        'user' => [
            'id' => 1,
            'name' => 'Keith Jordan',
            'email' => $validated['email'],
        ],
    ]);
});

Route::post('/logout', function () {
    return response()->json([
        'message' => 'Logged out successfully.',
    ]);
});

Route::post('/tasks', function (Request $request) {
    $validated = $request->validate([
        'title' => ['required', 'string', 'max:255'],
    ]);

    return response()->json([
        'id' => rand(100, 999),
        'title' => $validated['title'],
        'completed' => false,
    ], 201);
});
