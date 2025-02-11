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

                $matche = $this->matche->create([
                    'fk_user_matches_id' => $user->id,
                    'fk_target_user_matches_id' => $fk_target_user_matches_id,
                    'status' => $status,
                ]);

                if ($matche) {
                    DB::commit();

                    $responseMatch = Matche::where('fk_user_matches_id', $fk_target_user_matches_id)
                        ->where('fk_target_user_matches_id', $user->id)
                        ->where('status', 1)
                        ->get();

                    $responseMatch = $responseMatch->isEmpty() ? "Não houve match" : "Match";

                    return response()->json([
                        'success' => true,
                        'message' => 'Resgistrado com sucesso.',
                        'data' => $responseMatch,
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