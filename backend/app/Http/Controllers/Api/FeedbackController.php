<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class FeedbackController extends Controller
{
    /** POST /api/v1/feedback (publik) */
    public function store(Request $request)
    {
        $user = Auth::guard('sanctum')->user();

        $data = $request->validate([
            'name' => [$user ? 'nullable' : 'required', 'string', 'max:120'],
            'email' => [$user ? 'nullable' : 'required', 'email', 'max:190'],
            'category' => ['required', Rule::in(Feedback::CATEGORIES)],
            'message' => ['required', 'string', 'min:5', 'max:3000'],
            'rating' => ['nullable', 'integer', 'between:1,5'],
        ]);

        $feedback = Feedback::create([
            'user_id' => $user?->id,
            'name' => $user?->name ?? $data['name'],
            'email' => $user?->email ?? $data['email'],
            'category' => $data['category'],
            'message' => $data['message'],
            'rating' => $data['rating'] ?? null,
        ]);

        return response()->json([
            'message' => 'Terima kasih! Masukan Anda berhasil dikirim.',
            'data' => $feedback,
        ], 201);
    }
}
