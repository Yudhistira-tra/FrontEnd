<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\SavedProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    /** GET /api/v1/products?search=&category=&sort=&page=&per_page= */
    public function index(Request $request)
    {
        $perPage = min(max((int) $request->query('per_page', 8), 1), 50);

        $query = Product::query()
            ->with('category:id,name,slug')
            ->rated()
            ->where('status', 'active');

        if ($s = trim((string) $request->query('search', ''))) {
            $query->where(fn ($w) => $w->where('title', 'ilike', "%{$s}%")
                ->orWhere('brand', 'ilike', "%{$s}%"));
        }

        if ($c = $request->query('category')) {
            $query->whereHas('category', fn ($w) => ctype_digit((string) $c)
                ? $w->where('id', $c)
                : $w->where('slug', $c));
        }

        switch ($request->query('sort', 'newest')) {
            case 'price_asc':  $query->orderBy('price'); break;
            case 'price_desc': $query->orderByDesc('price'); break;
            case 'rating':     $query->orderByRaw('rating_avg DESC NULLS LAST'); break;
            default:           $query->orderByDesc('release_date')->orderByDesc('id');
        }

        return response()->json($query->paginate($perPage));
    }

    /** GET /api/v1/products/featured  -> banner highlight */
    public function featured()
    {
        $base = Product::with('category:id,name,slug')->rated()->where('status', 'active');

        $product = (clone $base)->where('is_featured', true)->orderByDesc('release_date')->first()
            ?? (clone $base)->orderByDesc('release_date')->first();

        return response()->json(['data' => $product]);
    }

    /** GET /api/v1/products/{id|slug} */
    public function show(string $product)
    {
        $user = Auth::guard('sanctum')->user();

        $item = Product::rated()
            ->byKey($product)
            ->with(['category:id,name,slug', 'images'])
            ->firstOrFail();

        if ($item->status !== 'active' && ! $user?->isAdmin()) {
            abort(404);
        }

        Product::whereKey($item->id)->increment('views_count');

        $item->setAttribute('is_saved', $user
            ? SavedProduct::where('user_id', $user->id)->where('product_id', $item->id)->exists()
            : false);

        return response()->json(['data' => $item]);
    }
}
