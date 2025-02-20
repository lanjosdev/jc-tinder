<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class Sequence extends Model
{
    use SoftDeletes, HasApiTokens;

    protected $fillable = [
        'order',
        'fk_sequences_photos_id'
    ];
    protected $dates = ['deleted_at'];

    public function rules()
    {
        return [
            'sequence' => 'required|array',
            'sequence.*.order' => 'required|integer', // Cada item do array deve ter "sequence" como inteiro
            'sequence.*.fk_sequences_photos_id' => 'required|integer', // Cada item do array deve ter "fk_id_media" como inteiro
        ];
    }
    public function feedback()
    {
        return [
            'sequence.required' => 'O campo ordem é obrigatório.',
            'sequence.array' => 'Formato inválido, necessário ser um array.',
            'sequence.*.order.required' => 'O campo "sequence" dentro da lista é obrigatório.',
            'sequence.*.order.integer' => 'O campo "sequence" deve ser um número inteiro.',

            'sequence.*.fk_sequences_photos_id.required' => 'O campo "fk_sequences_photos_id" dentro da lista é obrigatório.',
            'sequence.*.fk_sequences_photos_id.integer' => 'O campo "fk_sequences_photos_id" deve ser um número inteiro.',
        ];
    }
}