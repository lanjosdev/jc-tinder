<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Utils;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MeController extends Controller
{
    protected $utils;
    protected $gender_sexuality;

    public function __construct(Utils $utils, User $gender_sexuality)
    {
        $this->utils = $utils;
        $this->gender_sexuality = $gender_sexuality;
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

    public function assingnedGenderAndSexuality(Request $request)
    {
        DB::beginTransaction();
        try {
            $user = $request->user();

            $validatedData = $request->validate(
                $this->gender_sexuality->rulesAttributionOfGenderAndSexuality(),
                $this->gender_sexuality->feedbackAttributionOfGenderAndSexuality()
            );

            $fk_gender_user_id = $request->fk_gender_user_id;
            $fk_sexuality_user_id = $request->fk_sexuality_user_id;

            if ($validatedData) {
                $user->update([
                    'fk_gender_id' => $fk_gender_user_id,
                    'fk_sexuality_user_id' => $fk_sexuality_user_id
                ]);
            }
            if ($user) {
                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Gênero e sexualidade atribuídos com sucesso.',
                    'data' => $user,
                ]);
            }
        } catch (ValidationException $ve) {
            DB::rollBack();
            $errorMessages = collect($ve->errors())
                ->flatten()
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