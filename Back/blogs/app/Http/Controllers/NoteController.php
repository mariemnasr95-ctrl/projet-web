<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NoteController extends Controller
{
    public function index(Request $request)
    {
        $notes = $request->user()
            ->notes()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notes);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:100',
            'content' => 'nullable|string',
            'priority' => 'required|in:basse,moyenne,haute',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $note = $request->user()->notes()->create($request->all());

        return response()->json([
            'message' => 'Note created successfully',
            'note' => $note
        ], 201);
    }

    public function show(Request $request, Note $note)
    {
        if ($note->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Note not found'], 404);
        }

        return response()->json($note);
    }

    public function update(Request $request, Note $note)
    {
        if ($note->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Note not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:100',
            'content' => 'nullable|string',
            'priority' => 'required|in:basse,moyenne,haute',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $note->update($request->all());

        return response()->json([
            'message' => 'Note updated successfully',
            'note' => $note
        ]);
    }

    public function destroy(Request $request, Note $note)
    {
        if ($note->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Note not found'], 404);
        }

        $note->delete();

        return response()->json([
            'message' => 'Note deleted successfully'
        ]);
    }

    public function toggleFavorite(Request $request, Note $note)
    {
        if ($note->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Note not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'favorite' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $note->update(['favorite' => $request->input('favorite')]);

        return response()->json([
            'message' => 'Note favorite status updated successfully',
            'note' => $note
        ]);
    }
} 