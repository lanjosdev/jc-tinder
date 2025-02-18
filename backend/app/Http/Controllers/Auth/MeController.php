<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Jobs\SendImageToApiJob;
use App\Models\Photo;
use App\Models\Sequence;
use App\Models\SubGender;
use App\Models\User;
use App\Models\Utils;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class MeController extends Controller
{
    protected $utils;
    protected $user;

    public function __construct(Utils $utils, User $user)
    {
        $this->utils = $utils;
        $this->user = $user;
    }

    public function me(Request $request)
    {
        try {
            
            $myProfile = $request->user();

            $habitsUser = DB::table('user_habits')
                ->where('fk_user_user_habits_id', $myProfile->id)
                ->pluck('fk_habits_user_habits_id')
                ->toArray();

            $habits = DB::table('habits')
                ->whereIn('id', $habitsUser)
                ->get()->map(function ($habit) {
                    return [
                        'id' => $habit->id,
                        'name' => $habit->name,
                    ];
                })->toArray();

            $preferencesUser = DB::table('preferences')
                ->where('fk_user_preferences_id', $myProfile->id)
                ->pluck('fk_gender_preferences_id')
                ->toArray();

            $preferences = DB::table('genders')
                ->whereIn('id', $preferencesUser)
                ->get()
                ->map(function ($preference) {
                    return (object) [
                        'id' => $preference->id,
                        'name' => $preference->name,
                    ];
                })
                ->toArray();

            $photosUser = DB::table('photos')
                ->join('sequences', 'photos.id', '=', 'sequences.fk_sequences_photos_id') // Faz o join com sequences
                ->where('photos.fk_user_photos_id', $myProfile->id)
                ->whereNull('photos.deleted_at')
                ->select('photos.id', 'photos.thumb_photo', 'photos.name_photo', 'sequences.order') // Seleciona também a ordem
                ->orderBy('sequences.order', 'asc') // Ordena com base na tabela sequences
                ->get()
                ->map(function ($photo) {
                    return (object) [
                        'id' => $photo->id,
                        'photo' => $photo->name_photo,
                        'thumb_photo' => $photo->thumb_photo,
                    ];
                })
                ->toArray();

            $result = [
                'id' => $myProfile->id,
                'name' => $myProfile->name,
                'age' => $this->utils->verifyAdult($myProfile->birth_data),
                'adult' => $myProfile->adult,
                'phone' => $myProfile->phone,
                'birth_data' => $myProfile->birth_data,
                'email' => $myProfile->email,
                'gender' => $myProfile->fk_gender_user_id ? $myProfile->gender->name : null,
                'gender_id' => $myProfile->fk_gender_user_id ? $myProfile->gender->id : null,
                'gender_description' => $myProfile->fk_gender_user_id ? $myProfile->gender->description : null,
                'sub_gender' => $myProfile->fk_sub_gender_user_id ? $myProfile->sub_gender->name : null,
                'sub_gender_id' => $myProfile->fk_sub_gender_user_id ? $myProfile->sub_gender->id : null,
                'sub_gender_description' => $myProfile->fk_sub_gender_user_id ? $myProfile->sub_gender->description : null,
                'gender_main' => $myProfile->fk_sub_gender_user_id ? $myProfile->sub_gender->fk_genders_sub_genders_id : null, //genero pai
                'sexuality' => $myProfile->fk_sexuality_user_id ? $myProfile->sexuality->name : null,
                'sexuality_description' => $myProfile->fk_sexuality_user_id ? $myProfile->sexuality->description : null,
                'sexuality_id' => $myProfile->fk_sexuality_user_id ? $myProfile->sexuality->id : null,
                'preferences' => $preferences,
                'photos' => $photosUser,
                'minimum_age_preference' => $myProfile->minimum_age,
                'maximum_age_preference' => $myProfile->maximum_age,
                'habits' => $habits,
                'about_me' => $myProfile->about_me,
                'created_at' => $myProfile->created_at ? $this->utils->formattedDate($myProfile, 'created_at') : null,
                'updated_at' => $myProfile->updated_at ? $this->utils->formattedDate($myProfile, 'updated_at') : null,
                'deleted_at' => $myProfile && $myProfile->trashed()
                    ? $this->utils->formattedDate($myProfile, 'deleted_at')
                    : $myProfile->deleted_at ?? null,
            ];

            if ($result) {
                return response()->json([
                    'success' => true,
                    'message' => 'Perfil recupeardo com sucesso.',
                    'data' => $result,
                ]);
            }
        } catch (ValidationException $ve) {
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação.',
                'errors' => $ve->errors(),
            ]);
        } catch (QueryException $qe) {
            return response()->json([
                'success' => false,
                'message' => "Error DB: " . $qe->getMessage(),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => "Error: " . $e->getMessage(),
            ]);
        }
    }

    public function assingnedGenderAndSexuality(Request $request)
    {
        DB::beginTransaction();

        try {

            $user = $request->user();

            $validatedData = $request->validate(
                $this->user->rulesAttributionOfGenderAndSexuality(),
                $this->user->feedbackAttributionOfGenderAndSexuality()
            );

            $fk_gender_user_id = $request->fk_gender_user_id;
            $fk_sexuality_user_id = $request->fk_sexuality_user_id;
            $fk_sub_gender_user_id = $request->fk_sub_gender_user_id;
            $about_me = $request->about_me;

            //validação para atribuição correta de sub-genero com genero pai
            if ($fk_sub_gender_user_id != null) {

                $verifySubGender = SubGender::where('id', $fk_sub_gender_user_id)->first();

                if ($verifySubGender) {
                    $result = $verifySubGender->fk_genders_sub_genders_id == $fk_gender_user_id;
                }

                if (!$result) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Escolha um subgênero que corresponda ao gênero selecionado para continuar.'
                    ]);
                }
            }

            if ($validatedData) {
                $user->update([
                    'fk_gender_user_id' => $fk_gender_user_id,
                    'fk_sexuality_user_id' => $fk_sexuality_user_id,
                    'fk_sub_gender_user_id' => $fk_sub_gender_user_id,
                    'about_me' => $about_me,
                ]);
            }

            if ($user) {
                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Gênero e sexualidade atribuídos com sucesso.',
                    'data' => $user,
                ]);
            }
        } catch (ValidationException $ve) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação.',
                'errors' => $ve->errors(),
            ]);
        } catch (QueryException $qe) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => "Error DB: " . $qe->getMessage(),
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => "Error: " . $e->getMessage(),
            ]);
        }
    }

    public function preferences(Request $request)
    {
        DB::beginTransaction();

        try {

            $user = $request->user();

            $validatedData = $request->validate(
                $this->user->rulesPreference(),
                $this->user->feedbackPreference(),
            );

            $fk_gender_preferences_id = $request->input('fk_gender_preferences_id');
            $habits = $request->input('habits');

            //atribui preferencia e habitos para o user da requisição
            if ($validatedData) {
                $user->preferences()->sync($fk_gender_preferences_id);
                $user->habits()->sync($habits);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Preferencia/hábito(s) atribuído(s) com sucesso.',
            ]);
        } catch (ValidationException $ve) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação.',
                'errors' => $ve->errors(),
            ]);
        } catch (QueryException $qe) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => "Error DB: " . $qe->getMessage(),
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => "Error: " . $e->getMessage(),
            ]);
        }
    }

    public function updatePassword(Request $request)
    {
        DB::beginTransaction();
        try {
            $user = $request->user();

            $validatedData = $request->validate(
                $this->user->rulesUpdatePassword(),
                $this->user->feedbackUpdatePassword()
            );

            $oldPassword = $user->password;


            if ($validatedData) {
                if (Hash::check($request->password, $oldPassword)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Senha já utilizada anteriormente. Por favor tente outra senha.',
                    ]);
                }

                //atualiza a senha do user
                $newPassword = User::where('id', $user->id)
                    ->update(['password' => Hash::make($request->password)]);

                if ($newPassword) {

                    DB::commit();
                    return response()->json([
                        'success' => true,
                        'message' => 'Senha alterada com sucesso.',
                    ]);
                }
            }
        } catch (ValidationException $ve) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação.',
                'errors' => $ve->errors(),
            ]);
        } catch (QueryException $qe) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => "Error DB: " . $qe->getMessage(),
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => "Error: " . $e->getMessage(),
            ]);
        }
    }

    public function updateUser(Request $request)
    {
        DB::beginTransaction();
        try {
            $user = $request->user();

            $id_gender = $user->fk_gender_user_id;

            $validatedData = $request->validate(
                $this->user->rulesUpdateInfoUser(),
                $this->user->feedbackUpdateInfoUser()
            );

            if ($validatedData) {

                $name = $request->name;
                $phone = $request->phone;
                $birth_data = $request->birth_data;
                $fk_sexuality_user_id = $request->fk_sexuality_user_id;
                $fk_gender_user_id = $request->fk_gender_user_id;
                $fk_sub_gender_user_id = $request->fk_sub_gender_user_id;
                $about_me = $request->about_me;

                $age = $this->utils->verifyAdult($birth_data);

                if ($age < 18) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Você precisa ter mais de 18 anos para participar do app.',
                    ]);
                }

                if ($phone != $user->phone) {
                    $verifyExistsPhone = User::where('phone', $phone)->first();

                    if ($verifyExistsPhone) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Já existe um registro com esse número, por favor verifique.',
                        ]);
                    }
                }

                //condição para validar corretamente sub-genero com genero pai
                if ($fk_sub_gender_user_id != null) {

                    $verifySubGender = SubGender::where('id', $fk_sub_gender_user_id)->first();

                    if ($verifySubGender) {
                        $result = $verifySubGender->fk_genders_sub_genders_id == $fk_gender_user_id;
                    }

                    if (!$result) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Escolha um subgênero que corresponda ao gênero selecionado para continuar.'
                        ]);
                    }
                }

                if ($fk_gender_user_id != $user->fk_gender_user_id && empty($fk_sub_gender_user_id) || $fk_sub_gender_user_id == null) {
                    $fk_sub_gender_user_id = null;
                }

                //Atualiza as informações que foram alteradas
                $updateUser = $user->update([
                    'name' => $name,
                    'phone' => $phone,
                    'birth_data' => $birth_data,
                    'fk_sexuality_user_id' => $fk_sexuality_user_id,
                    'fk_gender_user_id' => $fk_gender_user_id,
                    // 'fk_sub_gender_user_id' => $fk_sub_gender_user_id !== $user->fk_sub_gender_user_id ? $fk_sub_gender_user_id : null,
                    'fk_sub_gender_user_id' => $fk_sub_gender_user_id,
                    'about_me' => $about_me,
                ]);

                if ($updateUser) {
                    DB::commit();

                    return response()->json([
                        'success' => true,
                        'message' => 'Informações atualizadas com sucesso.',
                        'data' => $user->fresh(),
                    ]);
                }
            }
        } catch (ValidationException $ve) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação.',
                'errors' => $ve->errors(),
            ]);
        } catch (QueryException $qe) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => "Error DB: " . $qe->getMessage(),
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => "Error: " . $e->getMessage(),
            ]);
        }
    }

    public function updatePreferences(Request $request)
    {
        DB::beginTransaction();
        try {
            $user = $request->user();

            $validatedData = $request->validate(
                $this->user->rulesUpdateInfoPreference(),
                $this->user->feedbackUpdateInfoPreference()
            );

            if ($validatedData) {
                $minimum_age = $request->input('minimum_age');
                $maximum_age = $request->input('maximum_age');
                $fk_gender_preferences_id = $request->input('fk_gender_preferences_id');
                $habits = $request->input('habits');

                if ($minimum_age > $maximum_age) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Idade mínima não pode ser maior que a idade máxima.'
                    ]);
                }

                //atualiza idade minima ou maxima que foi alterada
                $user->update(array_filter([
                    'minimum_age' => ($minimum_age !== $user->minimum_age) ? $minimum_age : null,
                    'maximum_age' => ($maximum_age !== $user->maximum_age) ? $maximum_age : null,
                ]));

                //atualiza preferencia e habito alterado
                $user->preferences()->sync($fk_gender_preferences_id);
                $user->habits()->sync($habits);

                if ($user) {
                    DB::commit();

                    return response()->json([
                        'success' => true,
                        'message' => 'Preferencia(s)/hábito(s)/Faixa etaria atribuído(s) com sucesso.',
                        'data' => $user,
                    ]);
                }
            }
        } catch (ValidationException $ve) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação.',
                'errors' => $ve->errors(),
            ]);
        } catch (QueryException $qe) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => "Error DB: " . $qe->getMessage(),
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => "Error: " . $e->getMessage(),
            ]);
        }
    }
}