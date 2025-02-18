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

            //pega os users que dei like
            $userLikes = Matche::where('fk_user_matches_id', $user->id)
                ->where('status', 1)
                ->whereNull('deleted_at')
                ->get();

            $matchedUserIds = [];

            //guarda na variavel os ids dos users "like"
            foreach ($userLikes as $like) {
                $matchingLike = Matche::where('fk_user_matches_id', $like->fk_target_user_matches_id)
                    ->where('fk_target_user_matches_id', $user->id)
                    ->where('status', 1)
                    ->whereNull('deleted_at')
                    ->first();

                if ($matchingLike) {
                    $matchedUserIds[] = $like->fk_target_user_matches_id;
                }
            }
            //guarda ids sem repetição
            $matchedUserIds = array_unique($matchedUserIds);

            //se diferente de vazio pega todos users com base nos id's informados
            if (!empty($matchedUserIds)) {
                $users = User::whereIn('id', $matchedUserIds)->get();
            } else {
                $users = null;
            }

            // se existir algum user que deu match
            if ($users) {
                $users = $users->map(function ($users) {
                    return [
                        'id' => $users->id,
                        'name' => $users->name,
                        'phone' => $users->phone,
                        'age' => $this->utils->verifyAdult($users->birth_data),
                    ];
                });
            }

            return response()->json([
                'success' => true,
                'message' => 'Matches recuprados com sucesso.',
                'data' => $users,
            ]);
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

                    $responseMatch = Matche::where('fk_user_matches_id', $fk_target_user_matches_id)
                        ->where('fk_target_user_matches_id', $user->id)
                        ->where('status', 1)
                        ->get();

                    if ($responseMatch) {
                        $userMatch = User::where('id', $fk_target_user_matches_id)->get();

                        if ($userMatch) {
                            $photosUserArray = DB::table('photos')
                                ->join('sequences', 'photos.id', '=', 'sequences.fk_sequences_photos_id') // Faz o join com sequences
                                ->where('photos.fk_user_photos_id', $fk_target_user_matches_id)
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
                        }
                    }


                    $responseMatch = $responseMatch->isEmpty() ? false : true;

                    return response()->json([
                        'success' => true,
                        'message' => 'Resgistrado com sucesso.',
                        'data' => [
                            'response_for_match' => $responseMatch,
                            'info_user_match' =>  $responseMatch == 'Match' ? $userMatch : null,
                            'photo_user_match' => $responseMatch == 'Match' ? $photosUserArray : null
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
}