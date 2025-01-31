<?php

namespace App\Http\Controllers;

use App\Models\Preference;
use App\Models\User;
use App\Models\Utils;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    protected $user;
    protected $utils;

    public function __construct(User $user, Utils $utils)
    {
        $this->user = $user;
        $this->utils = $utils;
    }

    public function getAll(Request $request)
    {
        DB::beginTransaction();
        try {
            $userRequest = $request->user();

            $preference = Preference::where('fk_user_preferences_id', $userRequest->id)
                ->pluck('fk_gender_preferences_id')
                ->toArray();

            $getAllUsers = User::with(['gender' => function ($query) {
                $query->whereNull('deleted_at');
            }])
                ->whereHas('gender', function ($query) {
                    $query->whereNull('deleted_at');
                })
                ->whereIn('fk_gender_user_id', $preference)
                ->where('level', 0)
                ->where('id', '!=', $userRequest->id)
                ->inRandomOrder()
                ->get();

            // Filtra os usuários dentro do intervalo de idade
            $getAllUsers = $getAllUsers->filter(function ($users) use ($userRequest) {
                $userAge = $this->utils->verifyAdult($users->birth_data); // Aqui você calcula a idade do usuário
                return $userAge >= $userRequest->minimum_age && $userAge <= $userRequest->maximum_age;
            })->values();

            $getAll = $getAllUsers->map(function ($users) {

                $habitsUser = DB::table('user_habits')
                    ->where('fk_user_user_habits_id', $users->id)
                    ->pluck('fk_habits_user_habits_id')
                    ->toArray();

                $habits = DB::table('habits')
                    ->whereIn('id', $habitsUser)
                    ->pluck('name');
                $preferencesUser = DB::table('preferences')
                    ->where('fk_user_preferences_id', $users->id)
                    ->pluck('fk_gender_preferences_id')
                    ->toArray();

                $preferences = DB::table('genders')
                    ->whereIn('id', $preferencesUser)
                    ->pluck('name');

                $photosUser = DB::table('photos')
                    ->where('fk_user_photos_id', $users->id)
                    ->whereNull('deleted_at')
                    ->pluck('thumb_photo', 'id')
                    ->toArray();

                // Converte para array de objetos
                $photosUserArray = array_map(function ($id, $thumbPhoto) {
                    return (object) ['id' => $id, 'thumb_photo' => $thumbPhoto];
                }, array_keys($photosUser), $photosUser);

                return [
                    'id' => $users->id,
                    'name' => $users->name,
                    'age' => $this->utils->verifyAdult($users->birth_data),
                    'adult' => $users->adult,
                    'phone' => $users->phone,
                    'birth_data' => $users->birth_data,
                    'email' => $users->email,
                    'gender' => $users->fk_gender_user_id ? $users->gender->name : null,
                    'gender_description' => $users->fk_gender_user_id ? $users->gender->description : null,
                    'sub_gender' => $users->fk_sub_gender_user_id ? $users->sub_gender->name : null,
                    'sub_gender_description' => $users->fk_sub_gender_user_id ? $users->sub_gender->description : null,
                    'sexuality' => $users->fk_sexuality_user_id ? $users->sexuality->name : null,
                    'sexuality_description' => $users->fk_sexuality_user_id ? $users->sexuality->description : null,
                    'preferences' => $preferences,
                    'photos' => $photosUserArray,
                    'minimum_age_preference' => $users->minimum_age,
                    'maximum_age_preference' => $users->maximum_age,
                    'habits' => $habits,
                    'created_at' => $users->created_at ? $this->utils->formattedDate($users, 'created_at') : null,
                    'updated_at' => $users->updated_at ? $this->utils->formattedDate($users, 'updated_at') : null,
                    'deleted_at' => $users && $users->trashed()
                        ? $this->utils->formattedDate($users, 'deleted_at')
                        : $users->deleted_at ?? null,
                ];
            });

            if ($getAll) {
                return response()->json([
                    'success' => true,
                    'message' => 'Usuário com o seu perfil recuperados com sucesso',
                    'data' => $getAll,
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
}