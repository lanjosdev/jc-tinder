<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;
    use Notifiable;
    use HasApiTokens;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'adult',
        'phone',
        'birth_data',
        'level',
        'fk_gender_user_id',
        'fk_sexuality_user_id',
        'minimum_age',
        'maximum_age',
    ];

    protected $tables = 'users';
    protected $dates = ['deleted_at'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function rulesRegister()
    {
        return [
            'name' => 'required|min:1|max:250|',
            'password' => 'required|min:8|max:20',
            'adult' => 'required|boolean:0,1',
            'phone' => 'required|min:11',
            'birth_data' => 'required|min:10'
        ];
    }

    public function feedbackRegister()
    {
        return [
            'name.required' => 'Campo nome é obrigatório.',
            'name.min' => 'Campo nome deve conter no mínimo 1 digito.',
            'name.max' => 'Campo nome deve conter no máximo 250 digitos.',

            'password.required' => 'Campo senha é obrigatório.',
            'password.min' => 'Senha deve conter no mínimo 8 caracteres.',
            'password.max' => 'Senha deve conter no máximo 20 caracteres.',

            'adult.required' => 'Campo +18 é obrigatório.',
            'adult.boolean' => 'Válido apenas 0 ou 1.',

            'phone.required' => 'Campo número celular é obrigatório.',
            'phone.min' => 'Campo número celular deve conter no mínimo 11 digitos.',

            'birth_data.required' => 'Campo data de nascimento é obrigátorio.',
            'birth_data.min' => 'Campo data de nascimento deve conter no mínimo 10 caracteres.'
        ];
    }

    public function rulesLogin()
    {
        return [
            'password' => 'required|min:8|max:20',
            'phone' => 'required|min:11',
        ];
    }
    public function feedbackLogin()
    {
        return [
            'password.required' => 'Campo senha é obrigatório.',
            'password.min' => 'Senha deve conter no mínimo 8 caracteres.',
            'password.max' => 'Senha deve conter no máximo 20 caracteres.',

            'phone.required' => 'Campo número celular é obrigatório.',
            'phone.min' => 'Campo número celular deve conter no mínimo 11 digitos.',
        ];
    }

    public function rulesAttributionOfGenderAndSexuality()
    {
        return [
            'fk_gender_user_id' => 'required|exists:genders,id',
            'fk_sexuality_user_id' => 'required|exists:sexualities,id',
        ];
    }

    public function feedbackAttributionOfGenderAndSexuality()
    {
        return [
            'fk_gender_user_id.required' => 'O campo gênero é obrigátorio.',
            'fk_gender_user_id.exists' => 'Nenhum resultado encontrado, por favor verifique.',

            'fk_sexuality_user_id.required' => 'O campo sexualidade é obrigátorio.',
            'fk_sexuality_user_id.exists' => 'Nenhum resultado encontrado, por favor verifique.',
        ];
    }
}