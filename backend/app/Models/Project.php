<?php

namespace App\Models;


use App\Enums\Projects\Priority;
use App\Enums\Projects\Status;

use Illuminate\Database\Eloquent\Model;

class Project extends Model {
    protected $fillable = [
        'title',
        'description',
        'status',
        'priority'

    ];
    protected $casts = [
        'status' => Status::class,
        'priority' => Priority::class,
    ];
    public function users() {
        return $this->belongsToMany(User::class, 'project_user')->withPivot('role')->withTimestamps();
    }
}
