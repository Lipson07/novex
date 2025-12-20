<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306;dbname=note_proj', 'root', '111111');
    echo "MySQL connection: SUCCESS\n";
} catch (PDOException $e) {
    echo "MySQL connection: FAILED - " . $e->getMessage() . "\n";
}
