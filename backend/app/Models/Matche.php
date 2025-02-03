<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Matche extends Model
{
    protected $fillable = [
        'fk_user_matches_id',
        'fk_target_user_matches_id',
        'status'
    ];
    protected $tables = 'matches';
    protected $dates = ['deleted_at'];

    public function rulesMatche()
    {
        return [
            // 'fk_user_matches_id' => 'required|exists:users,id',
            'fk_target_user_matches_id' => 'required|exists:users,id',
            'status' => 'required|boolean:0,1'
        ];
    }
    public function feedbackMatche()
    {
        return [
            // 'fk_user_matches_id.required' => 'Usuário obrigatorio.',
            // 'fk_user_matches_id.exists' => 'Nenhum resultado encontrado, por favor verifique.',

            'fk_target_user_matches_id.required' => 'Usuário alvo é obrigatório.',
            'fk_target_user_matches_id.exists' => 'Nenhum resultado encontrado, por favor verifique.',

            'status.required' => "Campo status é obrigatório.",
            'status.boolean' => "Válido apenas 0 ou 1.",
        ];
    }
}