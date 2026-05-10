<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\NoteController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
  
    Route::apiResource('notes', NoteController::class);
    Route::patch('/notes/{note}/favorite', [NoteController::class, 'toggleFavorite']);
    
    Route::post('/logout', [AuthController::class, 'logout']);
});