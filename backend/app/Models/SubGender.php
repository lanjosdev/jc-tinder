<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class SubGender extends Model
{
    use SoftDeletes, HasApiTokens;

    protected $tables = "sub_genders";
    protected $fillable = [
        'name',
        'description',
        'fk_genders_sub_genders_id',
    ];

    protected $dates = ['deleted_at'];

    public function gender()
    {
        return $this->belongsTo(Gender::class, 'fk_genders_sub_genders_id');
    }
}