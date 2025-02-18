<?php

namespace App\Http\Controllers;

use App\Models\Habit;
use App\Models\Matche;
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
    protected $matche;

    public function __construct(User $user, Utils $utils, Matche $matche)
    {
        $this->user = $user;
        $this->utils = $utils;
        $this->matche = $matche;
    }

    public function getAll(Request $request)
    {
        try {

            $userRequest = $request->user();

            //pega a preferencia do user da requisição
            $preference = Preference::where('fk_user_preferences_id', $userRequest->id)
                ->pluck('fk_gender_preferences_id')
                ->toArray();

            $getAllUsersLike = Matche::where('fk_user_matches_id', $userRequest->id)
                ->where('status', 1)
                ->whereNull('deleted_at')
                ->pluck('fk_target_user_matches_id')
                ->toArray();


            $getAllMatchs = $this->utils->getAllMatchs($userRequest->id);

            $matchIds = is_array($getAllMatchs) ? $getAllMatchs : collect($getAllMatchs)->pluck('id')->toArray();

            $getAllUsers = User::where('id', array_merge([$userRequest->id], $matchIds, $getAllUsersLike))
                ->whereIn('fk_gender_user_id', $preference)
                ->where('level', 0)
                ->where('id', '!=', $userRequest->id)
                // ->orderByRaw('RAND()')
                ->inRandomOrder()
                ->get();

            // //query para retornar users que ainda não dei like 
            // $getAllUsers = User::whereNotIn('id', function ($query) use ($userRequest) {
            //     $query->select('fk_user_matches_id')
            //         ->from('matches')
            //         ->where('fk_user_matches_id', $userRequest->id) // onde o usuário fez gostei
            //         ->orWhere('fk_target_user_matches_id', $userRequest->id); // ou onde o usuário é o alvo

            // })
            //     ->whereHas('gender', function ($query) {
            //         $query->whereNull('deleted_at');
            //     })
            //     ->whereIn('fk_gender_user_id', $preference)
            //     ->where('level', 0)
            //     ->where('id', '!=', $userRequest->id)
            //     ->inRandomOrder()
            //     // ->orderBy('id', 'asc')
            //     ->get();


            // Filtra os usuários dentro do intervalo de idade
            $getAllUsers = $getAllUsers->filter(function ($users) use ($userRequest) {

                // Aqui você calcula a idade do usuário
                $userAge = $this->utils->verifyAdult($users->birth_data);

                return $userAge >= $userRequest->minimum_age && $userAge <= $userRequest->maximum_age;
            })->values();

            //formata o retorno dos users com mais informações
            $getAll = $getAllUsers->map(function ($users) {

                $habitsUser = DB::table('user_habits')
                    ->where('fk_user_user_habits_id', $users->id)
                    ->whereNull('deleted_at')
                    ->pluck('fk_habits_user_habits_id')
                    ->toArray();

                $habits = DB::table('habits')
                    ->whereIn('id', $habitsUser)
                    ->select('id', 'name')
                    ->get();

                $preferencesArray = Preference::with('gender')
                    ->where('fk_user_preferences_id',  $users->id)
                    ->get()
                    ->map(function ($preference) {
                        return [
                            'id' => $preference->fk_gender_preferences_id,
                            'name' => $preference->gender ? $preference->gender->name : null,
                        ];
                    })
                    ->toArray();

                $photosUserArray = DB::table('photos')
                    ->join('sequences', 'photos.id', '=', 'sequences.fk_sequences_photos_id') // Faz o join com sequences
                    ->where('photos.fk_user_photos_id', $users->id)
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
                    'preferences' => $preferencesArray,
                    'photos' => $photosUserArray,
                    'minimum_age_preference' => $users->minimum_age,
                    'maximum_age_preference' => $users->maximum_age,
                    'habits' => $habits,
                    'about_me' => $users->about_me,
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

    public function getUserId(Request $request, $id)
    {
        try {

            $userId = User::where('id', $id)->get();

            if (!$userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nenhum resultado encontrado.'
                ]);
            }

            //formata o retorno dos users com mais informações
            $getUserId = $userId->map(function ($user) {

                $habitsUser = DB::table('user_habits')
                    ->where('fk_user_user_habits_id', $user->id)
                    ->whereNull('deleted_at')
                    ->pluck('fk_habits_user_habits_id')
                    ->toArray();

                $habits = DB::table('habits')
                    ->whereIn('id', $habitsUser)
                    ->select('id', 'name')
                    ->get();


                $preferencesArray = Preference::with('gender')
                    ->where('fk_user_preferences_id',  $user->id)
                    ->get()
                    ->map(function ($preference) {
                        return [
                            'id' => $preference->fk_gender_preferences_id,
                            'name' => $preference->gender ? $preference->gender->name : null,
                        ];
                    })
                    ->toArray();

                // $photosUser = DB::table('photos')
                //     ->where('fk_user_photos_id', $user->id)
                //     ->whereNull('deleted_at')
                //     ->select('id', 'thumb_photo', 'name_photo')
                //     ->get()
                //     ->map(function ($photo) {
                //         return (object) [
                //             'id' => $photo->id,
                //             'photo' => $photo->name_photo,
                //             'thumb_photo' => $photo->thumb_photo,
                //         ];
                //     })
                //     ->toArray();

                $photosUserArray = DB::table('photos')
                    ->join('sequences', 'photos.id', '=', 'sequences.fk_sequences_photos_id') // Faz o join com sequences
                    ->where('photos.fk_user_photos_id', $user->id)
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

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'age' => $this->utils->verifyAdult($user->birth_data),
                    'adult' => $user->adult,
                    'phone' => $user->phone,
                    'birth_data' => $user->birth_data,
                    'email' => $user->email,
                    'gender' => $user->fk_gender_user_id ? $user->gender->name : null,
                    'gender_description' => $user->fk_gender_user_id ? $user->gender->description : null,
                    'sub_gender' => $user->fk_sub_gender_user_id ? $user->sub_gender->name : null,
                    'sub_gender_description' => $user->fk_sub_gender_user_id ? $user->sub_gender->description : null,
                    'sexuality' => $user->fk_sexuality_user_id ? $user->sexuality->name : null,
                    'sexuality_description' => $user->fk_sexuality_user_id ? $user->sexuality->description : null,
                    'preferences' => $preferencesArray,
                    'photos' => $photosUserArray,
                    'minimum_age_preference' => $user->minimum_age,
                    'maximum_age_preference' => $user->maximum_age,
                    'habits' => $habits,
                    'about_me' => $user->about_me,
                    'created_at' => $user->created_at ? $this->utils->formattedDate($user, 'created_at') : null,
                    'updated_at' => $user->updated_at ? $this->utils->formattedDate($user, 'updated_at') : null,
                    'deleted_at' => $user && $user->trashed()
                        ? $this->utils->formattedDate($user, 'deleted_at')
                        : $user->deleted_at ?? null,
                ];
            });

            if ($getUserId) {
                return response()->json([
                    'success' => true,
                    'message' => 'Usuário recuperado com sucesso',
                    'data' => $getUserId,
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
}