<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class Habit extends Model
{
    use SoftDeletes, HasApiTokens;

    protected $fillable = [
        'name'
    ];

    protected $tables = 'habits';
    protected $dates = ['deteled_at'];

}