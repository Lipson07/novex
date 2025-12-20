<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'health'],
    'allowed_methods' => ['*'],
<<<<<<< HEAD
    'allowed_origins' => [
        'https://novextask.ru',
        'https://server-thinkpad-x220.tail44896d.ts.net',
        'http://localhost:5173' // для локальной разработки
    ],
=======
    'allowed_origins' => ['https://novextask.ru', 'https://server-thinkpad-x220.tail44896d.ts.net', 'http://localhost:3000', 'http://localhost:5173'],
>>>>>>> 633171d975c7e79a469a652e5fb62412d216c8fe
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // ← КРИТИЧЕСКИ ВАЖНО!
];
