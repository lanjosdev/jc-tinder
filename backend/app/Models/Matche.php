<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Matche extends Model
{
    protected $fillable = [
        'fk_user_matches_id',
        'fk_target_user_matches_id',
        'status',
        'viewed',
    ];
    protected $tables = 'matches';
    protected $dates = ['deleted_at'];

    public function rulesMatche()
    {
        return [
            'fk_target_user_matches_id' => 'required|exists:users,id',
            'status' => 'required|boolean:0,1'
        ];
    }

    public function feedbackMatche()
    {
        return [
            'fk_target_user_matches_id.required' => 'Usuário alvo é obrigatório.',
            'fk_target_user_matches_id.exists' => 'Nenhum resultado encontrado, por favor verifique.',

            'status.required' => "Campo status é obrigatório.",
            'status.boolean' => "Válido apenas 1.",
        ];
    }

    public function rulesViewed()
    {
        return [
            'viewed' => 'required|',
        ];
    }
    public function feedbackViewed()
    {
        return [
            'viewed.required' => "Campo viewed é obrigatório.",
        ];
    }
}