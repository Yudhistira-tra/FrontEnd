<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /** GET /api/v1/admin/products?search=&category=&status= */
    public function index(Request $request)
    {
        $query = Product::with('category:id,name,slug')->rated()->latest('id');

        if ($s = trim((string) $request->query('search', ''))) {
            $query->where(fn ($w) => $w->where('title', 'ilike', "%{$s}%")
                ->orWhere('sku', 'ilike', "%{$s}%")
                ->orWhere('brand', 'ilike', "%{$s}%"));
        }
        if ($c = $request->query('category')) {
            $query->where('category_id', $c);
        }
        if ($st = $request->query('status')) {
            $query->where('status', $st);
        }

        return response()->json($query->paginate(min((int) $request->query('per_page', 10), 100)));
    }

    /** POST /api/v1/products */
    public function store(Request $request)
    {
        $data = $request->validate($this->rules());

        $product = DB::transaction(function () use ($request, $data) {
            $data['slug'] = $this->uniqueSlug($data['title']);

            if ($request->hasFile('image')) {
                $data['image_url'] = Storage::disk('public')->url($request->file('image')->store('products', 'public'));
            }

            $gallery = $data['gallery'] ?? null;
            unset($data['image'], $data['gallery']);

            $product = Product::create($data);
            $this->syncGallery($product, $gallery);

            return $product;
        });

        return response()->json(['message' => 'Produk berhasil ditambahkan.', 'data' => $product->load('category', 'images')], 201);
    }

    /** PUT /api/v1/products/{id} */
    public function update(Request $request, Product $product)
    {
        $data = $request->validate($this->rules($product));

        DB::transaction(function () use ($request, $data, $product) {
            if ($request->hasFile('image')) {
                $data['image_url'] = Storage::disk('public')->url($request->file('image')->store('products', 'public'));
            }

            $gallery = $data['gallery'] ?? null;
            unset($data['image'], $data['gallery']);

            $product->update($data);
            $this->syncGallery($product, $gallery);
        });

        return response()->json(['message' => 'Produk berhasil diperbarui.', 'data' => $product->fresh()->load('category', 'images')]);
    }

    /** DELETE /api/v1/products/{id} */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Produk berhasil dihapus.']);
    }

    private function rules(?Product $product = null): array
    {
        $req = $product ? 'sometimes' : 'required';

        return [
            'category_id' => [$req, 'integer', 'exists:categories,id'],
            'title' => [$req, 'string', 'max:190'],
            'brand' => ['nullable', 'string', 'max:100'],
            'sku' => ['nullable', 'string', 'max:100', Rule::unique('products', 'sku')->ignore($product?->id)],
            'description' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'image' => ['nullable', 'image', 'max:4096'],
            'price' => [$req, 'integer', 'min:0'],
            'release_date' => ['nullable', 'date'],
            'specs_json' => ['nullable', 'array'],
            'editor_note' => ['nullable', 'string'],
            'editor_score' => ['nullable', 'numeric', 'between:0,10'],
            'status' => ['nullable', Rule::in(['draft', 'active', 'archived'])],
            'is_featured' => ['nullable', 'boolean'],
            'gallery' => ['nullable', 'array', 'max:10'],
            'gallery.*' => ['string', 'max:500'],
        ];
    }

    private function uniqueSlug(string $title): string
    {
        $base = Str::slug($title) ?: 'produk';
        $slug = $base;
        $i = 2;

        while (Product::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }

    private function syncGallery(Product $product, ?array $urls): void
    {
        if ($urls === null) {
            return;
        }

        $product->images()->delete();
        foreach (array_values($urls) as $i => $url) {
            $product->images()->create(['url' => $url, 'sort_order' => $i]);
        }
    }
}
