<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class Photo extends Model
{
    use SoftDeletes, HasApiTokens;

    protected $tables = 'photos';
    protected $dates = ['deleted_at'];
    protected $fillable = [
        'fk_user_photos_id',
        'name_photo',
        'send',
        'thumb_photo',
    ];

    public function rulesPhoto()
    {
        return [
            'name_photo' => 'required|array', // Certifique-se de validar como array
            'name_photo.*' => 'required|image|mimes:jpeg,png,jpg|', // Valide cada item do array
            'fk_user_photos_id' => 'exists:users,id'
        ];
    }

    public function feedbackPhoto()
    {
        return [
            'name_photo.mimes' => 'A imagem deve estar no formato jpeg, jpg ou png.',

            'name_photo.required' => 'Por favor, envie ao menos uma imagem para prosseguir.',

            'fk_user_photos_id.exists' => 'Nenhum resultado encontrado, por favor verifique.',
        ];
    }
}