<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CommentLike;
use App\Models\Product;
use App\Models\ProductComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CommentController extends Controller
{
    /** GET /api/v1/products/{id}/comments */
    public function index(Request $request, string $product)
    {
        $p = Product::byKey($product)->firstOrFail();
        $user = Auth::guard('sanctum')->user();

        $comments = $p->comments()
            ->whereNull('parent_id')
            ->where('status', 'approved')
            ->with(['replies' => fn ($q) => $q->where('status', 'approved')->oldest()])
            ->latest()
            ->paginate(min((int) $request->query('per_page', 10), 50));

        $ids = collect($comments->items())
            ->flatMap(fn ($c) => array_merge([$c->id], $c->replies->pluck('id')->all()))
            ->all();

        $liked = $user
            ? CommentLike::where('user_id', $user->id)->whereIn('comment_id', $ids)->pluck('comment_id')->all()
            : [];

        $comments->getCollection()->each(function ($c) use ($liked) {
            $c->setAttribute('liked_by_me', in_array($c->id, $liked));
            $c->replies->each(fn ($r) => $r->setAttribute('liked_by_me', in_array($r->id, $liked)));
        });

        return response()->json($comments);
    }

    /** POST /api/v1/products/{id}/comments  (tamu: wajib nama & email; login: otomatis) */
    public function store(Request $request, string $product)
    {
        $p = Product::byKey($product)->where('status', 'active')->firstOrFail();
        $user = Auth::guard('sanctum')->user();

        $data = $request->validate([
            'user_name' => [$user ? 'nullable' : 'required', 'string', 'max:120'],
            'user_email' => [$user ? 'nullable' : 'required', 'email', 'max:190'],
            'comment_text' => ['required', 'string', 'min:3', 'max:2000'],
            'rating' => ['nullable', 'integer', 'between:1,5'],
            'parent_id' => ['nullable', 'integer', Rule::exists('product_comments', 'id')->where('product_id', $p->id)],
        ]);

        // Balasan selalu ditempel ke komentar utama (maks 1 level) dan tidak punya rating
        $parentId = null;
        if (! empty($data['parent_id'])) {
            $parent = ProductComment::find($data['parent_id']);
            $parentId = $parent->parent_id ?? $parent->id;
        }

        // Anti-spam sederhana: komentar berisi link otomatis ditandai (tidak tampil publik)
        $hasLink = preg_match('~(https?://|www\.)~i', $data['comment_text']) === 1;

        $comment = ProductComment::create([
            'product_id' => $p->id,
            'user_id' => $user?->id,
            'parent_id' => $parentId,
            'user_name' => $user?->name ?? $data['user_name'],
            'user_email' => $user?->email ?? $data['user_email'],
            'comment_text' => $data['comment_text'],
            'rating' => $parentId ? null : ($data['rating'] ?? null),
            'status' => $hasLink ? 'flagged' : 'approved',
            'is_staff' => (bool) $user?->isAdmin(),
        ]);

        return response()->json([
            'message' => $hasLink
                ? 'Komentar Anda berisi tautan dan sedang menunggu moderasi.'
                : 'Komentar berhasil dikirim.',
            'data' => $comment,
        ], 201);
    }

    /** POST /api/v1/comments/{id}/like  (toggle upvote) */
    public function like(Request $request, ProductComment $comment)
    {
        abort_if($comment->status !== 'approved', 404);
        $user = $request->user();

        $liked = DB::transaction(function () use ($comment, $user) {
            $existing = CommentLike::where('comment_id', $comment->id)->where('user_id', $user->id)->first();

            if ($existing) {
                $existing->delete();
                $comment->decrement('upvotes_count');
                return false;
            }

            CommentLike::create(['comment_id' => $comment->id, 'user_id' => $user->id]);
            $comment->increment('upvotes_count');
            return true;
        });

        return response()->json([
            'liked' => $liked,
            'upvotes_count' => $comment->fresh()->upvotes_count,
        ]);
    }
}
