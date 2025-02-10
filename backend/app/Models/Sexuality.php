<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class Sexuality extends Model
{
    use SoftDeletes, HasApiTokens;

    protected $tables = 'sexualities';
    protected $dates = ['deleted_at'];
}