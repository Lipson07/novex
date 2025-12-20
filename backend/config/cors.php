<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'health'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'https://novextask.ru',
        'https://server-thinkpad-x220.tail44896d.ts.net',
        'http://localhost:5173' // для локальной разработки
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // ← КРИТИЧЕСКИ ВАЖНО!
];
