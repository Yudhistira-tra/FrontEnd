<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FeedbackController extends Controller
{
    /** GET /api/v1/admin/feedbacks?category=&status=&search= */
    public function index(Request $request)
    {
        $query = Feedback::latest();

        if ($c = $request->query('category')) {
            $query->where('category', $c);
        }
        if ($st = $request->query('status')) {
            $query->where('status', $st);
        }
        if ($s = trim((string) $request->query('search', ''))) {
            $query->where(fn ($w) => $w->where('message', 'ilike', "%{$s}%")
                ->orWhere('name', 'ilike', "%{$s}%")
                ->orWhere('email', 'ilike', "%{$s}%"));
        }

        $summary = [
            'total' => Feedback::count(),
            'new' => Feedback::where('status', 'new')->count(),
            'avg_rating' => round((float) Feedback::whereNotNull('rating')->avg('rating'), 1),
        ];

        return response()->json([
            'summary' => $summary,
            'feedbacks' => $query->paginate(min((int) $request->query('per_page', 10), 100)),
        ]);
    }

    /** PATCH /api/v1/admin/feedbacks/{id}  body: {status: new|read|resolved} */
    public function updateStatus(Request $request, Feedback $feedback)
    {
        $data = $request->validate(['status' => ['required', Rule::in(['new', 'read', 'resolved'])]]);
        $feedback->update($data);

        return response()->json(['message' => 'Status feedback diperbarui.', 'data' => $feedback]);
    }

    /** DELETE /api/v1/admin/feedbacks/{id} */
    public function destroy(Feedback $feedback)
    {
        $feedback->delete();

        return response()->json(['message' => 'Feedback dihapus.']);
    }
}
