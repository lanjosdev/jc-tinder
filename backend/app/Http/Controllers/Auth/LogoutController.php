<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class LogoutController extends Controller
{
    public function logout(Request $request)
    {
        DB::beginTransaction();
        try {
            $user = $request->user();
            $user->tokens()->delete();

            if ($user) {
                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Usuário desconectado com sucesso.'
                ]);
            }
        } catch (ValidationException $ve) {
            DB::rollBack();
<<<<<<< HEAD
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação.',
                'errors' => $ve->errors(),
=======
            $errorMessages = collect($ve->errors())
                ->flatten()
                ->all();

            return response()->json([
                'success' => false,
                'message' => 'Erro de validação.',
                'errors' => $errorMessages,
>>>>>>> 70d749c491aded7597d1c381ee048208cbe5d2ce
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