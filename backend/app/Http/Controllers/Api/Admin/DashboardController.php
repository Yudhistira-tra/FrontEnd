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
        return response()->json([
            'total_products' => Product::count(),
            'active_products' => Product::where('status', 'active')->count(),
            'draft_products' => Product::where('status', 'draft')->count(),
            'total_comments' => ProductComment::count(),
            'comments_need_review' => ProductComment::whereIn('status', ['pending', 'flagged'])->count(),
            'total_feedbacks' => Feedback::count(),
            'new_feedbacks' => Feedback::where('status', 'new')->count(),
            'total_users' => User::count(),
        ]);
    }
}
