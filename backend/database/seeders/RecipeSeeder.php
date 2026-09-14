<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Database\Seeder;

class RecipeSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        if (! $user) {
            $this->command->warn('ユーザーが存在しないため、RecipeSeederをスキップしました。');

            return;
        }

        $recipes = [
            [
                'name' => '親子丼',
                'cooking_time' => 20,
                'steps' => "1. 玉ねぎを薄切りにする\n2. 鶏肉を一口大に切る\n3. だし・醤油・みりんを煮立て、鶏肉と玉ねぎを加える\n4. 溶き卵を回し入れて蓋をする\n5. ご飯の上に乗せる",
                'ingredients' => [
                    '鶏肉' => '200g',
                    '卵' => '2個',
                    '玉ねぎ' => '1/2個',
                    '醤油' => '大さじ2',
                    'みりん' => '大さじ2',
                    'だし' => '150ml',
                ],
            ],
            [
                'name' => '肉じゃが',
                'cooking_time' => 40,
                'steps' => "1. じゃがいも・にんじん・玉ねぎを乱切りにする\n2. 牛肉を炒める\n3. 野菜を加えてさらに炒める\n4. だし・醤油・みりん・砂糖を加えて煮込む",
                'ingredients' => [
                    '牛肉' => '200g',
                    'じゃがいも' => '3個',
                    'にんじん' => '1本',
                    '玉ねぎ' => '1個',
                    '醤油' => '大さじ3',
                    'みりん' => '大さじ2',
                    '砂糖' => '大さじ1',
                    'だし' => '300ml',
                ],
            ],
            [
                'name' => '味噌汁',
                'cooking_time' => 15,
                'steps' => "1. だしを取る\n2. 豆腐とわかめを加える\n3. 味噌を溶き入れる",
                'ingredients' => [
                    '豆腐' => '1/2丁',
                    'わかめ' => '5g',
                    '味噌' => '大さじ2',
                    'だし' => '500ml',
                ],
            ],
            [
                'name' => '野菜炒め',
                'cooking_time' => 15,
                'steps' => "1. 野菜を食べやすい大きさに切る\n2. 豚肉を炒める\n3. 野菜を加えて炒める\n4. 塩こしょう・醤油で味付けする",
                'ingredients' => [
                    '豚肉' => '150g',
                    'キャベツ' => '1/4個',
                    'にんじん' => '1/2本',
                    'ピーマン' => '2個',
                    'もやし' => '1袋',
                    '塩' => '少々',
                    'こしょう' => '少々',
                    '醤油' => '大さじ1',
                ],
            ],
            [
                'name' => 'カレーライス',
                'cooking_time' => 45,
                'steps' => "1. 野菜と肉を一口大に切る\n2. 鍋で肉と野菜を炒める\n3. 水を加えて煮込む\n4. カレールーを溶かし入れる",
                'ingredients' => [
                    '豚肉' => '250g',
                    'じゃがいも' => '2個',
                    'にんじん' => '1本',
                    '玉ねぎ' => '1個',
                ],
            ],
            [
                'name' => '鶏の照り焼き',
                'cooking_time' => 20,
                'steps' => "1. 鶏肉を焼く\n2. 醤油・みりん・砂糖を合わせたタレを加えて煮絡める",
                'ingredients' => [
                    '鶏肉' => '300g',
                    '醤油' => '大さじ2',
                    'みりん' => '大さじ2',
                    '砂糖' => '大さじ1',
                ],
            ],
            [
                'name' => '卵焼き',
                'cooking_time' => 10,
                'steps' => "1. 卵を溶き、砂糖・醤油を加える\n2. フライパンで巻きながら焼く",
                'ingredients' => [
                    '卵' => '3個',
                    '砂糖' => '大さじ1',
                    '醤油' => '小さじ1',
                ],
            ],
            [
                'name' => '豚汁',
                'cooking_time' => 30,
                'steps' => "1. 豚肉と野菜を炒める\n2. だしを加えて煮込む\n3. 味噌を溶き入れる",
                'ingredients' => [
                    '豚肉' => '150g',
                    '大根' => '1/4本',
                    'にんじん' => '1/2本',
                    'ごぼう' => '1/2本',
                    '味噌' => '大さじ3',
                    'だし' => '600ml',
                ],
            ],
            [
                'name' => 'あさりの酒蒸し',
                'cooking_time' => 15,
                'steps' => "1. あさりを砂抜きする\n2. にんにくを炒める\n3. あさりと酒を加えて蒸し煮にする",
                'ingredients' => [
                    'あさり' => '300g',
                    'にんにく' => '1片',
                    '塩' => '少々',
                ],
            ],
            [
                'name' => 'ナポリタン',
                'cooking_time' => 20,
                'steps' => "1. パスタを茹でる\n2. ウインナーと玉ねぎ・ピーマンを炒める\n3. パスタとケチャップを加えて炒め合わせる",
                'ingredients' => [
                    'パスタ' => '200g',
                    'ウインナー' => '4本',
                    '玉ねぎ' => '1/2個',
                    'ピーマン' => '1個',
                    'ケチャップ' => '大さじ4',
                ],
            ],
            [
                'name' => '豆腐サラダ',
                'cooking_time' => 10,
                'steps' => "1. 豆腐を食べやすく切る\n2. トマトときゅうりを切る\n3. 盛り付けてポン酢等をかける",
                'ingredients' => [
                    '豆腐' => '1丁',
                    'トマト' => '1個',
                    'きゅうり' => '1本',
                ],
            ],
            [
                'name' => 'きのこの炊き込みご飯',
                'cooking_time' => 50,
                'steps' => "1. 米を研ぐ\n2. きのこを切る\n3. 醤油・みりん・だしと一緒に炊飯する",
                'ingredients' => [
                    '米' => '2合',
                    'しめじ' => '1パック',
                    'えのき' => '1袋',
                    '醤油' => '大さじ2',
                    'みりん' => '大さじ1',
                    'だし' => '360ml',
                ],
            ],
        ];

        foreach ($recipes as $data) {
            $recipe = Recipe::firstOrCreate(
                ['name' => $data['name'], 'user_id' => $user->id],
                [
                    'cooking_time' => $data['cooking_time'],
                    'steps' => $data['steps'],
                ],
            );

            $syncData = [];
            foreach ($data['ingredients'] as $name => $quantity) {
                $ingredient = Ingredient::where('name', $name)->first();
                if ($ingredient) {
                    $syncData[$ingredient->id] = ['quantity' => $quantity];
                }
            }

            $recipe->ingredients()->sync($syncData);
        }
    }
}
