<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class Gender extends Model
{
    use SoftDeletes, HasApiTokens;

    protected $tables = 'genders';
    protected $dates = ['deleted_at'];

}