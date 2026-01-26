<?php

namespace App\Enums\Projects;

enum ProjectPriority: string {
    case HIGH = 'high';
    case MEDIUM = 'medium';
    case LOW = 'low';
    public static function values(): array {
        return array_column(self::cases(), 'value');
    }
    public function label(): string {
        return match ($this) {
            self::HIGH => 'Высокий',
            self::MEDIUM => 'Средний',
            self::LOW => 'Низкий',
        };
    }

    public function color(): string {
        return match ($this) {
            self::HIGH => 'danger',
            self::MEDIUM => 'warning',
            self::LOW => 'success',
        };
    }
}
