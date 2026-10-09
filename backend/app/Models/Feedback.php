<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $table = 'feedbacks';

    public const CATEGORIES = ['product_request', 'bug_report', 'feature_suggestion', 'general'];

    protected $fillable = ['user_id', 'name', 'email', 'category', 'message', 'rating', 'status'];

    protected function casts(): array
    {
        return ['rating' => 'integer'];
    }

    public function user() { return $this->belongsTo(User::class); }
}
