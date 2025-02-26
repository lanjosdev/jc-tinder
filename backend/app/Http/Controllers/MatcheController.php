<?php

namespace App\Http\Controllers;

use App\Models\Matche;
use App\Models\User;
use App\Models\Utils;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MatcheController extends Controller
{
    protected $matche;
    protected $utils;

    public function __construct(Matche $matche, Utils $utils)
    {
        $this->matche = $matche;
        $this->utils = $utils;
    }

    public function getAllMatches(Request $request)
    {
        try {
            $user = $request->user();

            // Pega os usuários que o usuário autenticado deu like
            $userLikes = Matche::where('fk_user_matches_id', $user->id)
                ->where('status', 1)
                ->whereNull('deleted_at')
                ->get();

            $matchedUsers = [];

            // Itera sobre os likes para encontrar os matches
            foreach ($userLikes as $like) {
                $matchingLike = Matche::where('fk_user_matches_id', $like->fk_target_user_matches_id)
                    ->where('fk_target_user_matches_id', $user->id)
                    ->where('status', 1)
                    ->whereNull('deleted_at')
                    ->first();

                if ($matchingLike) {
                    // Busca o match onde o usuário autenticado é o dono da ação
                    $myMatch = Matche::where('fk_user_matches_id', $user->id)
                        ->where('fk_target_user_matches_id', $like->fk_target_user_matches_id)
                        ->where('status', 1)
                        ->whereNull('deleted_at')
                        ->first();

                    $matchedUsers[] = [
                        'user_id' => $like->fk_target_user_matches_id,
                        'id_match' => $myMatch->id ?? null, // ID do match do usuário autenticado
                        'viewed' => $myMatch->viewed ?? false, // Propriedade 'viewed' baseada no match do usuário autenticado
                    ];
                }
            }

            // Obtém os IDs únicos dos usuários que deram match
            $matchedUserIds = array_unique(array_column($matchedUsers, 'user_id'));

            // Se houver usuários com match, busca os detalhes
            if (!empty($matchedUserIds)) {
                $users = User::whereIn('id', $matchedUserIds)->get();
            } else {
                $users = null;
            }

            // Se existir algum usuário que deu match
            if ($users) {
                $users = $users->map(function ($user) use ($matchedUsers) {
                    $matchData = collect($matchedUsers)->firstWhere('user_id', $user->id);

                    $photosUserArray = DB::table('photos')
                        ->join('sequences', 'photos.id', '=', 'sequences.fk_sequences_photos_id')
                        ->where('photos.fk_user_photos_id', $user->id)
                        ->whereNull('photos.deleted_at')
                        ->select('photos.id', 'photos.thumb_photo', 'photos.name_photo', 'sequences.order')
                        ->orderBy('sequences.order', 'asc')
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
                        'phone' => $user->phone,
                        'age' => $this->utils->verifyAdult($user->birth_data),
                        'photos' => !empty($photosUserArray) ? $photosUserArray[0] : $photosUserArray,
                        // 'id_match' => $matchData['id_match'] ?? null,
                        'viewed' => $matchData['viewed'] ?? false,
                    ];
                });
            }

            if ($users) {
                return response()->json([
                    'success' => true,
                    'message' => 'Matches recuprados com sucesso.',
                    'data' => $users,
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

    public function matche(Request $request)
    {
        DB::beginTransaction();
        try {
            $user = $request->user();

            $validatedData = $request->validate(
                $this->matche->rulesMatche(),
                $this->matche->feedbackMatche()
            );

            if ($validatedData) {

                $fk_target_user_matches_id = $request->fk_target_user_matches_id;
                $status = $request->status;

                //valida para o user não dar matche consigo mesmo
                if ($fk_target_user_matches_id == $user->id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Não é possível realizar essa ação.',
                    ]);
                }

                $getMatch = Matche::where('fk_user_matches_id', $user->id)
                    ->where('fk_target_user_matches_id', $fk_target_user_matches_id)
                    ->first();

                $matche = null;

                if ($getMatch) {
                    $getMatch->update(['status' => $status]);
                } else {
                    $matche = $this->matche->create([
                        'fk_user_matches_id' => $user->id,
                        'fk_target_user_matches_id' => $fk_target_user_matches_id,
                        'status' => $status,
                    ]);
                }

                if ($matche || $getMatch) {
                    DB::commit();

                    // $responseMatch = Matche::where('fk_user_matches_id', $fk_target_user_matches_id)
                    //     ->where('fk_target_user_matches_id', $user->id)
                    //     ->where('status', 1)
                    //     ->get();

                    //se existe um like do user da requisição para o user alvo
                    $userMatch = Matche::where('fk_user_matches_id', $user->id)
                        ->where('fk_target_user_matches_id', $fk_target_user_matches_id)
                        ->where('status', 1)
                        ->first();

                    //se existe um like do user da alvo para o user da requisição
                    $targetMatch = Matche::where('fk_user_matches_id', $fk_target_user_matches_id)
                        ->where('fk_target_user_matches_id', $user->id)
                        ->where('status', 1)
                        ->first();

                    //se os dois for like
                    if ($userMatch && $targetMatch) {

                        //Busca o user alvo
                        $userMatchExists = User::where('id', $fk_target_user_matches_id)->get();

                        if ($userMatchExists) {
                            //Monta um array de informações do user alvo no caso as fotos
                            $photoUser = DB::table('photos')
                                ->join('sequences', 'photos.id', '=', 'sequences.fk_sequences_photos_id')
                                ->where('photos.fk_user_photos_id', $fk_target_user_matches_id)
                                ->whereNull('photos.deleted_at')
                                ->select('photos.id', 'photos.thumb_photo', 'photos.name_photo', 'sequences.order')
                                ->orderBy('sequences.order', 'asc')
                                ->first(); // Retorna apenas o primeiro

                            // Verifica se encontrou alguma foto
                            $photoUserObject = $photoUser ? (object) [
                                'id' => $photoUser->id,
                                'photo' => $photoUser->name_photo,
                                'thumb_photo' => $photoUser->thumb_photo,
                            ] : null;

                            $info_user = $userMatchExists->map(function ($userMatchExists) use ($photoUserObject) {

                                return [
                                    "id" => $userMatchExists->id,
                                    "name" => $userMatchExists->name,
                                    "adult" => $userMatchExists->adult,
                                    "phone" => $userMatchExists->phone,
                                    "email" => $userMatchExists->email,
                                    "birth_data" => $userMatchExists->birth_data,
                                    "level" => $userMatchExists->level,
                                    "about_me" => $userMatchExists->about_me,
                                    "fk_gender_user_id" => $userMatchExists->fk_gender_user_id,
                                    "fk_sexuality_user_id" => $userMatchExists->fk_sexuality_user_id,
                                    "fk_sub_gender_user_id" => $userMatchExists->fk_sub_gender_user_id,
                                    "minimum_age" => $userMatchExists->minimum_age,
                                    "maximum_age" => $userMatchExists->maximum_age,
                                    "photo" => $photoUserObject,
                                ];
                            })->first();

                            $responseMatch = true;

                            //se user alvo nao for encontrado retorna match false
                        } else {
                            $responseMatch = false;
                        }
                    } else {
                        $responseMatch = false;
                    }
                    // dd($info_user);
                    return response()->json([
                        'success' => true,
                        'message' => 'Resgistrado com sucesso.',
                        'data' => [
                            'response_for_match' => $responseMatch,
                            'info_user_match' =>  $responseMatch == true ? $info_user : null,
                            // 'photo_user_match' => $responseMatch == true && !empty($photosUserArray) ? $photosUserArray[0] : null,
                        ],
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

    public function viewed(Request $request, $id)
    {
        DB::beginTransaction();
        try {

            $match = Matche::where('id', $id)->first();

            if (!$match) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nenhum resultado encontrado',
                ]);
            }

            $validatedData = $request->validate(
                $this->matche->rulesViewed(),
                $this->matche->feedbackViewed()
            );

            if ($validatedData && $match->viewed == 0) {
                if ($request->viewed != 1) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Válido apenas 1.',
                    ]);
                }
                $UpdateMatch = $match->update(['viewed' => $request->viewed]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Match já vizualizado anteriormente.',
                ]);
            }

            if ($UpdateMatch) {
                DB::commit();
                return response()->json([
                    'success' => true,
                    'message' => 'Match atualizado com sucesso.',
                    'date' => $match
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