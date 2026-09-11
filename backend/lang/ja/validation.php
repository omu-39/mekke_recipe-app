<?php

return [
    'required' => ':attributeは必須です。',
    'string' => ':attributeは文字列で入力してください。',
    'max' => [
        'string' => ':attributeは:max文字以内で入力してください。',
    ],
    'min' => [
        'string' => ':attributeは:min文字以上で入力してください。',
    ],
    'email' => ':attributeは正しいメールアドレスの形式で入力してください。',
    'unique' => ':attributeは既に使用されています。',
    'confirmed' => ':attribute（確認用）が一致しません。',

    'password' => [
        'letters' => ':attributeは英字を含めてください。',
        'numbers' => ':attributeは数字を含めてください。',
    ],

    'attributes' => [
        'name' => '名前',
        'email' => 'メールアドレス',
        'password' => 'パスワード',
    ],
];
