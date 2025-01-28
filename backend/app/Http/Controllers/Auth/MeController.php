<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Utils;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MeController extends Controller
{
    protected $utils;

    public function __construct(Utils $utils)
    {
        $this->utils = $utils;
    }

    public function me(Request $request)
    {
        try {
            $myProfile = $request->user();

            $result = [
                'id' => $myProfile->id,
                'name' => $myProfile->name,
                'adult' => $myProfile->adult,
                'phone' => $myProfile->phone,
                'birth_data' => $myProfile->birth_data,
                'email' => $myProfile->email,
                'gender' => $myProfile->fk_gender_user_id,
                'sexuality' => $myProfile->fk_sexuality_user_id,
                'minimum_age_preference' => $myProfile->minimum_age,
                'maximum_age_preference' => $myProfile->maximum_age,
                'created_at' => $myProfile->created_at ? $this->utils->formattedDate($myProfile, 'created_at') : null,
                'updated_at' => $myProfile->updated_at ? $this->utils->formattedDate($myProfile, 'updated_at') : null,
                'deleted_at' => $myProfile && $myProfile->trashed()
                    ? $this->utils->formattedDate($myProfile, 'deleted_at')
                    : $myProfile->deleted_at ?? null,
            ];

            if ($result) {
                return response()->json([
                    'success' => true,
                    'message' => 'Perfil recupeardo com sucesso.',
                    'data' => $result,
                ]);
            }
        } catch (ValidationException $ve) {
            $errorMessages = collect($ve->errors())
                ->flatten()
                ->all();

            return response()->json([
                'success' => false,
                'message' => 'Erro de validação.',
                'errors' => $errorMessages,
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

    public function genderAndSexuality()
    {
        
    }
}