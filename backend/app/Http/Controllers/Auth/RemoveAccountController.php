<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RemoveAccountController extends Controller
{
    public function removeAccount(Request $request)
    {
        DB::beginTransaction();
        try {
            $user = $request->user();
            $user->delete();

            if ($user) {
                DB::commit();
                return response()->json([
                    'success' => true,
                    'message' => "Conta removida com sucesso.",
                ]);
            }
        } catch (ValidationException $ve) {
            DB::rollBack();
            $errorMessages = collect($ve->errors())
                ->flatten() // Garante que todas as mensagens fiquem em um array único
                ->all();

            return response()->json([
                'success' => false,
                'message' => 'Erro de validação.',
                'errors' => $errorMessages,
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