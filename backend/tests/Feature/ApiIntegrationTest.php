<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductComment;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ApiIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_product_search_works_with_sqlite(): void
    {
        $this->getJson('/api/v1/products?search=thinkpad')
            ->assertOk()
            ->assertJsonPath('data.0.title', 'Laptop ThinkPad X1 Carbon Gen 11 (2024)');

    }

    public function test_seeded_products_have_images_and_reviews_with_one_unrated_demo_product(): void
    {
        $products = $this->getJson('/api/v1/products?per_page=50')
            ->assertOk()
            ->json('data');

        $this->assertCount(8, $products);
        $this->assertSame(
            ['Tablet iPad Air M2 11 Inci'],
            collect($products)->whereNull('rating_avg')->pluck('title')->values()->all()
        );
        $this->assertSame(
            [],
            collect($products)->where('reviews_count', 0)->pluck('title')->values()->all()
        );

        foreach ($products as $product) {
            $this->assertStringStartsWith('/images/products/', $product['image_url']);
            $assetPath = base_path('../frontend/public'.str_replace('/', DIRECTORY_SEPARATOR, $product['image_url']));
            $this->assertFileExists($assetPath);
        }
    }

    public function test_seeded_admin_can_login_with_the_displayed_credentials(): void
    {
        $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@wartatekno.id',
            'password' => 'password',
        ])->assertOk()
            ->assertJsonPath('user.role', 'admin')
            ->assertJsonStructure(['user' => ['name', 'email', 'role'], 'token']);
    }

    public function test_member_comments_wait_for_moderation_and_admin_replies_can_be_nested(): void
    {
        $product = Product::where('title', 'Laptop ThinkPad X1 Carbon Gen 11 (2024)')->firstOrFail();
        $member = User::where('email', 'budi@wartatekno.id')->firstOrFail();
        $admin = User::where('email', 'admin@wartatekno.id')->firstOrFail();

        $pending = $this->actingAs($member, 'sanctum')->postJson(
            "/api/v1/products/{$product->slug}/comments",
            ['comment_text' => 'Komentar menunggu persetujuan', 'rating' => 4]
        );
        $pending->assertCreated()->assertJsonPath('data.status', 'pending');

        $root = ProductComment::where('product_id', $product->id)
            ->whereNull('parent_id')
            ->where('status', 'approved')
            ->firstOrFail();

        $firstReply = $this->actingAs($admin, 'sanctum')->postJson(
            "/api/v1/products/{$product->slug}/comments",
            ['comment_text' => 'Balasan admin pertama', 'parent_id' => $root->id]
        );
        $firstReply->assertCreated()->assertJsonPath('data.status', 'approved');
        $firstReplyId = $firstReply->json('data.id');

        $this->actingAs($admin, 'sanctum')->postJson(
            "/api/v1/products/{$product->slug}/comments",
            ['comment_text' => 'Balasan admin tingkat dua', 'parent_id' => $firstReplyId]
        )->assertCreated()->assertJsonPath('data.parent_id', $firstReplyId);

        $comments = $this->getJson("/api/v1/products/{$product->slug}/comments")
            ->assertOk()
            ->json('data');
        $rootResponse = collect($comments)->firstWhere('id', $root->id);

        $this->assertNotNull($rootResponse);
        $this->assertSame(
            'Balasan admin tingkat dua',
            $rootResponse['replies'][0]['replies'][0]['comment_text']
        );
        $this->assertFalse(collect($comments)->contains(
            fn (array $comment) => $comment['comment_text'] === 'Komentar menunggu persetujuan'
        ));
    }

    public function test_search_admin_comment_and_feedback_endpoints_work_with_sqlite(): void
    {
        $admin = User::where('email', 'admin@wartatekno.id')->firstOrFail();

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/products?search=thinkpad')
            ->assertOk()
            ->assertJsonPath('data.0.title', 'Laptop ThinkPad X1 Carbon Gen 11 (2024)');

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/comments?search=keyboard')
            ->assertOk()
            ->assertJsonStructure(['summary' => ['this_month'], 'comments' => ['data']]);

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/feedbacks?search=tablet')
            ->assertOk()
            ->assertJsonStructure(['feedbacks' => ['data']]);

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/dashboard')
            ->assertOk()
            ->assertJsonPath('total_products', 8)
            ->assertJsonPath('products_this_month', 8)
            ->assertJsonPath('total_comments', 11)
            ->assertJsonPath('comments_this_month', 11)
            ->assertJsonPath('approved_comment_percentage', 91);
    }

    public function test_admin_product_upload_accepts_multipart_images(): void
    {
        Storage::fake('public');
        $admin = User::where('email', 'admin@wartatekno.id')->firstOrFail();
        $category = $this->getJson('/api/v1/categories')->json('data.0');

        $response = $this->actingAs($admin, 'sanctum')->post('/api/v1/products', [
            'category_id' => $category['id'],
            'title' => 'Produk Upload Tes',
            'brand' => 'Tes',
            'sku' => 'TEST-UPLOAD-001',
            'price' => 100000,
            'status' => 'active',
            'specs_json' => json_encode([['label' => 'Layar', 'value' => 'OLED']]),
            'image' => UploadedFile::fake()->image('produk.png'),
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.specs_json.0.label', 'Layar');
        $this->assertNotEmpty(Storage::disk('public')->allFiles('products'));

        $this->actingAs($admin, 'sanctum')
            ->post('/api/v1/products/'.$response->json('data.id'), [
                '_method' => 'PUT',
                'category_id' => $category['id'],
                'title' => 'Produk Upload Tes Diperbarui',
                'brand' => 'Tes',
                'sku' => 'TEST-UPLOAD-001',
                'price' => 120000,
                'status' => 'active',
                'specs_json' => json_encode([['label' => 'Layar', 'value' => 'OLED']]),
                'image' => UploadedFile::fake()->image('produk-baru.png'),
            ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Produk Upload Tes Diperbarui');
    }
}
