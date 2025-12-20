<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306;dbname=note_proj', 'root', '');
    echo "MySQL connection with empty password: SUCCESS\n";
} catch (PDOException $e) {
    echo "MySQL connection with empty password: FAILED - " . $e->getMessage() . "\n";
}
