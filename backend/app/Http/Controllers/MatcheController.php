<?php

namespace App\Http\Controllers;

use App\Models\Matche;
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

                $matche = $this->matche->create([
                    'fk_user_matches_id' => $user->id,
                    'fk_target_user_matches_id' => $fk_target_user_matches_id,
                    'status' => $status,
                ]);

                if ($matche) {
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