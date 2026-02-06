<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\Projects\Priority;
use App\Enums\Projects\Status;
class Task extends Model
{
    protected $filalble=[
        'name',
        'description',
        'status',
        'priority',
        'priorityId',
        'deadline',
        'tags'



    ];
    protected $casts = [
        'tags' => 'array',
        'status' => Status::class,
        'priority' => Priority::class,
    ];
}
