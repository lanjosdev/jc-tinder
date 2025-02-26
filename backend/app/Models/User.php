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
        'about_me',
        'fk_gender_user_id',
        'fk_sexuality_user_id',
        'fk_sub_gender_user_id',
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

    public function rulesUpdateInfoUser()
    {
        return [
            'name' => 'required|min:1|max:250|',
            'phone' => 'required|min:11',
            'birth_data' => 'required|min:10',

            'fk_gender_user_id' => 'required|exists:genders,id',
            'fk_sexuality_user_id' => 'required|exists:sexualities,id',
            'fk_sub_gender_user_id' => 'nullable|exists:sub_genders,id',
            'about_me' => 'nullable|max:500',
        ];
    }

    public function feedbackUpdateInfoUser()
    {
        return [
            'name.required' => 'Campo nome é obrigatório.',
            'name.min' => 'Campo nome deve conter no mínimo 1 digito.',
            'name.max' => 'Campo nome deve conter no máximo 250 digitos.',

            'phone.required' => 'Campo número celular é obrigatório.',
            'phone.min' => 'Campo número celular deve conter no mínimo 11 digitos.',

            'birth_data.required' => 'Campo data de nascimento é obrigátorio.',
            'birth_data.min' => 'Campo data de nascimento deve conter no mínimo 10 caracteres.',

            'fk_gender_user_id.required' => 'O campo gênero é obrigatório.',
            'fk_gender_user_id.exists' => 'Nenhum resultado encontrado, por favor verifique.',

            'fk_sub_gender_user_id.exists' => 'Nenhum resultado encontrado, por favor verifique.',

            'fk_sexuality_user_id.required' => 'O campo sexualidade é obrigatório.',
            'fk_sexuality_user_id.exists' => 'Nenhum resultado encontrado, por favor verifique.',

            'about_me.max' => 'O campo sobre mim deve conter até 500 caracteres.',
        ];
    }

    public function rulesUpdateInfoPreference()
    {
        return [
            'fk_gender_preferences_id' => 'required|array|exists:genders,id',
            'habits' => 'array|exists:habits,id',
            'minimum_age.min' => 'min:18',
            'maximum_age.max' => 'max:100',
        ];
    }

    public function feedbackUpdateInfoPreference()
    {
        return [
            'fk_gender_preferences_id.required' => 'Escolha no mínimo um.',
            'fk_gender_preferences_id.array' => 'Formato inválido (necessário array).',
            'fk_gender_preferences_id.exists' => 'Nenhum resultado encontrado, por favor verifique.',

            'habits.' => 'Escolha no mínimo um.',
            'habits.array' => 'Formato inválido (necessário array).',
            'habits.exists' => 'Nenhum resultado encontrado, por favor verifique.',

            'minimum_age.max' => 'Válor máximo para esse campo 18.',
            'maximum_age.min' => 'Válor máximo para esse campo 100.' 
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
            'fk_sub_gender_user_id' => 'nullable|exists:sub_genders,id',
            'about_me' => 'nullable|max:500',
        ];
    }

    public function feedbackAttributionOfGenderAndSexuality()
    {
        return [
            'fk_gender_user_id.required' => 'O campo gênero é obrigatório.',
            'fk_gender_user_id.exists' => 'Nenhum resultado encontrado, por favor verifique.',

            'fk_sub_gender_user_id.exists' => 'Nenhum resultado encontrado, por favor verifique.',

            'fk_sexuality_user_id.required' => 'O campo sexualidade é obrigatório.',
            'fk_sexuality_user_id.exists' => 'Nenhum resultado encontrado, por favor verifique.',

            'about_me.max' => 'O campo sobre mim deve conter até 500 caracteres.'
        ];
    }

    public function rulesPreference()
    {
        return [
            'fk_gender_preferences_id' => 'required|array|exists:genders,id',
            'habits' => 'array|exists:habits,id',
        ];
    }

    public function feedbackPreference()
    {
        return [

            'fk_gender_preferences_id.required' => 'Escolha no mínimo um.',
            'fk_gender_preferences_id.array' => 'Formato inválido (necessário array).',
            'fk_gender_preferences_id.exists' => 'Nenhum resultado encontrado, por favor verifique.',

            'habits.' => 'Escolha no mínimo um.',
            'habits.array' => 'Formato inválido (necessário array).',
            'habits.exists' => 'Nenhum resultado encontrado, por favor verifique.',
        ];
    }

    public function rulesUpdatePassword()
    {
        return [
            'password' => 'required|min:8|confirmed|max:40',
        ];
    }

    public function feedbackUpdatePassword()
    {
        return [
            'password.required' => 'Campo senha é obrigatório.',
            'password.confirmed' => 'Senhas divergentes!',
            'password.min' => 'A senha deve ter no minímo 8 caracteres',
            'password.max' => 'A senha deve ter no máximo 40 caracteres',
        ];
    }

    public function gender()
    {
        return $this->belongsTo(Gender::class, 'fk_gender_user_id');
    }

    public function sub_gender()
    {
        return $this->belongsTo(SubGender::class, 'fk_sub_gender_user_id');
    }

    public function sexuality()
    {
        return $this->belongsTo(Sexuality::class, 'fk_sexuality_user_id');
    }

    public function preferences()
    {
        return $this->belongsToMany(Preference::class, 'preferences', 'fk_user_preferences_id', 'fk_gender_preferences_id');
    }

    public function preferences_user()
    {
        return $this->hasMany(Preference::class, 'fk_user_preferences_id');
    }

    public function habits()
    {
        return $this->belongsToMany(Habit::class, 'user_habits', 'fk_user_user_habits_id', 'fk_habits_user_habits_id');
    }

    public function matches()
    {
        return $this->hasMany(Matche::class, 'fk_user_matches_id');
    }

    public function targetMatches()
    {
        return $this->hasMany(Matche::class, 'fk_target_user_matches_id');
    }

    public function photos()
    {
        return $this->belongsToMany(Photo::class);
    }
}