<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Stringable;

class LoginController extends Controller
{

    protected $login;

    public function __construct(User $login)
    {
        $this->login = $login;
    }


    public function login(Request $request)
    {
        DB::beginTransaction();
        try {

            $validatedData = $request->validate(
                $this->login->rulesLogin(),
                $this->login->feedbackLogin()
            );

            if ($validatedData) {

                $user = User::where(DB::raw('BINARY `phone`'), $request->phone)->whereNull('deleted_at')
                    ->first();

                if (!$user || !Hash::check($request->password, $user->password)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Celular ou senha inválidos.'
                    ]);
                }

                $token = $user;
                $token->tokens()->delete();
                $token = null;

                if ($user->level === 'admin') {
                    $token = $user->createToken('AdminToken', ['admin'])->plainTextToken;
                } else {
                    $token = $user->createToken('UserToken')->plainTextToken;
                }
            }

            $resultToken = explode('|', $token);
            $resultToken[1];

            if ($token) {

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Login realizado com sucesso.',
                    'data' => $resultToken[1],
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