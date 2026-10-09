<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductComment extends Model
{
    protected $fillable = [
        'product_id', 'user_id', 'parent_id', 'user_name', 'user_email',
        'comment_text', 'rating', 'upvotes_count', 'status', 'is_staff',
    ];

    // Email disembunyikan di API publik; admin memakai makeVisible('user_email')
    protected $hidden = ['user_email'];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'upvotes_count' => 'integer',
            'is_staff' => 'boolean',
        ];
    }

    public function product() { return $this->belongsTo(Product::class); }
    public function user() { return $this->belongsTo(User::class); }
    public function parent() { return $this->belongsTo(self::class, 'parent_id'); }
    public function replies() { return $this->hasMany(self::class, 'parent_id'); }
    public function likes() { return $this->hasMany(CommentLike::class, 'comment_id'); }
}
