<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Utils;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class RegisterController extends Controller
{
    protected $register;
    protected $utils;

    public function __construct(User $register, Utils $utils)
    {
        $this->register = $register;
        $this->utils = $utils;
    }

    public function register(Request $request)
    {
        DB::beginTransaction();
        
        try {
            $validatedData = $request->validate(
                $this->register->rulesRegister(),
                $this->register->feedbackRegister()
            );

            $name = $request->name;
            $adult = $request->adult;
            $phone = $request->phone;
            $birth_data = $request->birth_data;
            $password = Hash::make($request->password);

            $verifyExistsPhone = User::where('phone', $phone)->get();

            //valida para celular ser único
            if (!$verifyExistsPhone->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Já existe um registro com esse número, por favor verifique.',
                ]);
            }

            $age = $this->utils->verifyAdult($birth_data);

            if ($adult != 1 || $age < 18) {
                return response()->json([
                    'success' => false,
                    'message' => 'Não é possível particpar do app sendo menor de idade.',
                ]);
            }

            if ($validatedData) {
                $createdUser = $this->register->create([
                    'name' => $name,
                    'adult' => $adult,
                    'phone' => $phone,
                    'birth_data' => $birth_data,
                    'password' => $password,
                ]);
            }

            if ($createdUser) {
                DB::commit();

                $directoryPath = 'images';

                //verifica se existe a pasta images na public senão cria
                if (!Storage::disk('public')->exists($directoryPath)) {
                    Storage::disk('public')->makeDirectory($directoryPath);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Usuário registrado com sucesso.',
                    'data' => $createdUser,
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
                'message' => "Error DB:" . $qe->getMessage(),
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