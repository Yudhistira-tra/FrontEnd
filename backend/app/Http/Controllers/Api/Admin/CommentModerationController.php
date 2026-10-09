<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductComment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CommentModerationController extends Controller
{
    /** GET /api/v1/admin/comments?status=&search=&product_id= */
    public function index(Request $request)
    {
        $query = ProductComment::with('product:id,title,slug')->latest();

        if ($st = $request->query('status')) {
            $query->where('status', $st);
        }
        if ($pid = $request->query('product_id')) {
            $query->where('product_id', $pid);
        }
        if ($s = trim((string) $request->query('search', ''))) {
            $query->where(fn ($w) => $w->where('comment_text', 'ilike', "%{$s}%")
                ->orWhere('user_name', 'ilike', "%{$s}%"));
        }

        $items = $query->paginate(min((int) $request->query('per_page', 10), 100));
        $items->getCollection()->each->makeVisible('user_email');

        $summary = ProductComment::selectRaw("
            count(*) as total,
            count(*) filter (where status = 'pending') as pending,
            count(*) filter (where status = 'flagged') as flagged,
            count(*) filter (where status = 'approved') as approved
        ")->first();

        return response()->json(['summary' => $summary, 'comments' => $items]);
    }

    /** PATCH /api/v1/admin/comments/{id}  body: {status: approved|pending|flagged} */
    public function updateStatus(Request $request, ProductComment $comment)
    {
        $data = $request->validate(['status' => ['required', Rule::in(['pending', 'approved', 'flagged'])]]);
        $comment->update($data);

        return response()->json(['message' => 'Status komentar diperbarui.', 'data' => $comment->makeVisible('user_email')]);
    }

    /** DELETE /api/v1/admin/comments/{id} */
    public function destroy(ProductComment $comment)
    {
        $comment->delete(); // balasan ikut terhapus (cascade)

        return response()->json(['message' => 'Komentar berhasil dihapus.']);
    }
}
