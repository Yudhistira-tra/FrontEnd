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
            ->latest()
            ->paginate(min((int) $request->query('per_page', 10), 50));

        $nodes = [];
        $frontier = $comments->getCollection();

        foreach ($frontier as $root) {
            $root->setRelation('replies', collect());
            $nodes[$root->id] = $root;
        }

        while ($frontier->isNotEmpty()) {
            $children = $p->comments()
                ->whereIn('parent_id', $frontier->pluck('id'))
                ->where('status', 'approved')
                ->oldest()
                ->get();
            $nextFrontier = collect();

            foreach ($children as $child) {
                $child->setRelation('replies', collect());
                $nodes[$child->id] = $child;
                $nodes[$child->parent_id]->replies->push($child);
                $nextFrontier->push($child);
            }

            $frontier = $nextFrontier;
        }

        if ($user && $nodes !== []) {
            $liked = CommentLike::where('user_id', $user->id)
                ->whereIn('comment_id', array_keys($nodes))
                ->pluck('comment_id')
                ->all();
            $likedSet = array_fill_keys($liked, true);

            foreach ($nodes as $node) {
                $node->setAttribute('liked_by_me', isset($likedSet[$node->id]));
            }
        }

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
            'parent_id' => [
                'nullable',
                'integer',
                Rule::exists('product_comments', 'id')
                    ->where('product_id', $p->id)
                    ->where('status', 'approved'),
            ],
        ]);

        $parentId = $data['parent_id'] ?? null;

        $hasLink = preg_match('~(https?://|www\.)~i', $data['comment_text']) === 1;
        $isStaffReply = $user?->isAdmin() && $parentId !== null;

        $comment = ProductComment::create([
            'product_id' => $p->id,
            'user_id' => $user?->id,
            'parent_id' => $parentId,
            'user_name' => $user?->name ?? $data['user_name'],
            'user_email' => $user?->email ?? $data['user_email'],
            'comment_text' => $data['comment_text'],
            'rating' => $parentId ? null : ($data['rating'] ?? null),
            'status' => $hasLink ? 'flagged' : ($isStaffReply ? 'approved' : 'pending'),
            'is_staff' => (bool) $user?->isAdmin(),
        ]);

        return response()->json([
            'message' => $hasLink
                ? 'Komentar berisi tautan dan ditandai untuk moderasi.'
                : ($isStaffReply
                    ? 'Balasan admin berhasil dipublikasikan.'
                    : 'Komentar berhasil dikirim dan menunggu persetujuan admin.'),
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
