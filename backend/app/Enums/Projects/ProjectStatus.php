<?php

namespace App\Enums\Projects;

enum ProjectStatus: string {
    case PENDING = 'pending';
    case REJECT = 'reject';
    case FULFILLED = 'fullfilled';
    case NOT_ASSIGNED = 'not_assigned';
    public static function values(): array {
        return array_column(self::cases(), 'value');
    }
    public function label(): string {
        return match ($this) {
            self::PENDING => 'В ожидании',
            self::REJECT => 'Отклонен',
            self::FULFILLED => 'Выполнен',
            self::NOT_ASSIGNED => 'Не назначен',
        };
    }
}
