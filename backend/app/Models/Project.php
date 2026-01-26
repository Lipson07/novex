<?php

namespace App\Models;


use App\Enums\Projects\ProjectPriority;
use App\Enums\Projects\ProjectStatus;

use Illuminate\Database\Eloquent\Model;

class Project extends Model {
    protected $fillable = [
        'title',
        'description',
        'status',
        'priority'

    ];
    protected $casts = [
        'status' => ProjectStatus::class,
        'priority' => ProjectPriority::class,
    ];
}
