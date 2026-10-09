<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id', 'title', 'slug', 'brand', 'sku', 'description', 'image_url',
        'price', 'release_date', 'specs_json', 'editor_note', 'editor_score',
        'status', 'is_featured', 'views_count',
    ];

    protected function casts(): array
    {
        return [
            'specs_json' => 'array',
            'release_date' => 'date:Y-m-d',
            'price' => 'integer',
            'editor_score' => 'float',
            'is_featured' => 'boolean',
            'rating_avg' => 'float',
            'reviews_count' => 'integer',
        ];
    }

    public function category() { return $this->belongsTo(Category::class); }
    public function images() { return $this->hasMany(ProductImage::class)->orderBy('sort_order'); }
    public function comments() { return $this->hasMany(ProductComment::class); }
    public function savedBy() { return $this->hasMany(SavedProduct::class); }

    /** Tambahkan rating_avg & reviews_count (hanya komentar approved). */
    public function scopeRated(Builder $q): Builder
    {
        return $q
            ->withAvg(['comments as rating_avg' => fn ($c) => $c->where('status', 'approved')->whereNotNull('rating')], 'rating')
            ->withCount(['comments as reviews_count' => fn ($c) => $c->where('status', 'approved')->whereNull('parent_id')]);
    }

    /** Cari berdasarkan ID numerik atau slug. */
    public function scopeByKey(Builder $q, string $key): Builder
    {
        return ctype_digit($key) ? $q->where('products.id', $key) : $q->where('products.slug', $key);
    }
}
