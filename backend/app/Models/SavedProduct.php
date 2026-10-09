<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedProduct extends Model
{
    protected $fillable = ['user_id', 'product_id', 'target_price'];

    protected function casts(): array
    {
        return ['target_price' => 'integer'];
    }

    public function user() { return $this->belongsTo(User::class); }
    public function product() { return $this->belongsTo(Product::class); }
}
