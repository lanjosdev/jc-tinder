<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class Preference extends Model
{
    use SoftDeletes, HasApiTokens;

    protected $tables = 'preferences';
    protected $dates = ['deleted_at'];

    public function gender()
    {
        return $this->belongsTo(Gender::class, 'fk_gender_preferences_id');
    }
}