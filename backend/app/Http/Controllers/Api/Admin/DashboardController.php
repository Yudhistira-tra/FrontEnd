<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Models\Product;
use App\Models\ProductComment;
use App\Models\User;

class DashboardController extends Controller
{
    /** GET /api/v1/admin/dashboard */
    public function index()
    {
        $totalComments = ProductComment::count();
        $approvedComments = ProductComment::where('status', 'approved')->count();

        return response()->json([
            'total_products' => Product::count(),
            'active_products' => Product::where('status', 'active')->count(),
            'draft_products' => Product::where('status', 'draft')->count(),
            'products_this_month' => Product::where('created_at', '>=', now()->startOfMonth())->count(),
            'total_comments' => $totalComments,
            'comments_this_month' => ProductComment::where('created_at', '>=', now()->startOfMonth())->count(),
            'approved_comments' => $approvedComments,
            'approved_comment_percentage' => $totalComments === 0
                ? 0
                : (int) round(($approvedComments / $totalComments) * 100),
            'comments_need_review' => ProductComment::whereIn('status', ['pending', 'flagged'])->count(),
            'total_feedbacks' => Feedback::count(),
            'new_feedbacks' => Feedback::where('status', 'new')->count(),
            'total_users' => User::count(),
        ]);
    }
}
