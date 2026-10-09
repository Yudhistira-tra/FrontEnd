<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\SavedProduct;
use Illuminate\Http\Request;

class SavedProductController extends Controller
{
    /** GET /api/v1/me/saved?category=slug&search= */
    public function index(Request $request)
    {
        $query = SavedProduct::where('user_id', $request->user()->id)
            ->with(['product' => fn ($q) => $q->with('category:id,name,slug')->rated()])
            ->latest();

        if ($c = $request->query('category')) {
            $query->whereHas('product.category', fn ($q) => $q->where('slug', $c));
        }
        if ($s = trim((string) $request->query('search', ''))) {
            $query->whereHas('product', fn ($q) => $q->where('title', 'ilike', "%{$s}%"));
        }

        return response()->json($query->paginate(12));
    }

    /** POST /api/v1/me/saved/{product} */
    public function store(Request $request, Product $product)
    {
        $saved = SavedProduct::firstOrCreate([
            'user_id' => $request->user()->id,
            'product_id' => $product->id,
        ], [
            'target_price' => $request->validate(['target_price' => ['nullable', 'integer', 'min:0']])['target_price'] ?? null,
        ]);

        return response()->json(['data' => $saved], 201);
    }

    /** PATCH /api/v1/me/saved/{product}  -> atur target harga */
    public function update(Request $request, Product $product)
    {
        $data = $request->validate(['target_price' => ['nullable', 'integer', 'min:0']]);

        $saved = SavedProduct::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)->firstOrFail();
        $saved->update($data);

        return response()->json(['data' => $saved]);
    }

    /** DELETE /api/v1/me/saved/{product} */
    public function destroy(Request $request, Product $product)
    {
        SavedProduct::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)->delete();

        return response()->json(['message' => 'Dihapus dari koleksi.']);
    }
}
