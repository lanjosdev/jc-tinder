<?php

namespace App\Http\Controllers;

use App\Models\Matche;
use App\Models\User;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MatcheController extends Controller
{
    protected $matche;

    public function __construct(Matche $matche)
    {
        $this->matche = $matche;
    }

    public function getAllMatches(Request $request)
    {
        try {
            $user = $request->user();

            // $matches = Matche::where('status', 1)
            //     ->where(function ($query) use ($user) {
            //         $query->where('fk_user_matches_id', $user->id)
            //             ->orWhere('fk_target_user_matches_id', $user->id);
            //     })
            //     ->get();

            //pega os users que de like
            $userLikes = Matche::where('fk_user_matches_id', $user->id)
                ->where('status', 1)
                ->get();

            $matchedUserIds = [];

            //guarda na variavel os ids dos users "like"
            foreach ($userLikes as $like) {
                $matchingLike = Matche::where('fk_user_matches_id', $like->fk_target_user_matches_id)
                    ->where('fk_target_user_matches_id', $user->id)
                    ->where('status', 1)
                    ->first();

                if ($matchingLike) {
                    $matchedUserIds[] = $like->fk_target_user_matches_id;
                }
            }

            //guarda ids sem repetição
            $matchedUserIds = array_unique($matchedUserIds);
           
            //pega id, name e phone para retornar
            if (!empty($matchedUserIds)) {
                $users = User::whereIn('id', $matchedUserIds)
                    ->get(['id', 'name', 'phone']);
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
                        'message' => 'Não é possível realizar essa ação. Tente novamente.',
                    ]);
                }

                $matche = $this->matche->create([
                    'fk_user_matches_id' => $user->id,
                    'fk_target_user_matches_id' => $fk_target_user_matches_id,
                    'status' => $status,
                ]);

                if ($matche) {
                    DB::commit();
                    return response()->json([
                        'success' => true,
                        'message' => 'Enviado com sucesso.',
                        'data' => $matche,
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