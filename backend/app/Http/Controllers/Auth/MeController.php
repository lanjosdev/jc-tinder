<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Photo;
use App\Models\SubGender;
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
    protected $user;

    public function __construct(Utils $utils, User $user)
    {
        $this->utils = $utils;
        $this->user = $user;
    }

    public function me(Request $request)
    {
        try {
            $myProfile = $request->user();

            $habitsUser = DB::table('user_habits')
                ->where('fk_user_user_habits_id', $myProfile->id)
                ->pluck('fk_habits_user_habits_id')
                ->toArray();

            $habits = DB::table('habits')
                ->whereIn('id', $habitsUser)
                ->pluck('name');

            $preferencesUser = DB::table('preferences')
                ->where('fk_user_preferences_id', $myProfile->id)
                ->pluck('fk_gender_preferences_id')
                ->toArray();

            $preferences = DB::table('genders')
                ->whereIn('id', $preferencesUser)
                ->pluck('name');

            $photosUser = DB::table('photos')
                ->where('fk_user_photos_id', $myProfile->id)
                ->pluck('thumb_photo', 'id')
                ->toArray();

            // Converte para array de objetos
            $photosUserArray = array_map(function ($id, $thumbPhoto) {
                return (object) ['id' => $id, 'thumb_photo' => $thumbPhoto];
            }, array_keys($photosUser), $photosUser);

            $result = [
                'id' => $myProfile->id,
                'name' => $myProfile->name,
                'age' => $this->utils->verifyAdult($myProfile->birth_data),
                'adult' => $myProfile->adult,
                'phone' => $myProfile->phone,
                'birth_data' => $myProfile->birth_data,
                'email' => $myProfile->email,
                'gender' => $myProfile->fk_gender_user_id ? $myProfile->gender->name : null,
                'gender_description' => $myProfile->fk_gender_user_id ? $myProfile->gender->description : null,
                'sub_gender' => $myProfile->fk_sub_gender_user_id ? $myProfile->sub_gender->name : null,
                'sub_gender_description' => $myProfile->fk_sub_gender_user_id ? $myProfile->sub_gender->description : null,
                'sexuality' => $myProfile->fk_sexuality_user_id ? $myProfile->sexuality->name : null,
                'sexuality_description' => $myProfile->fk_sexuality_user_id ? $myProfile->sexuality->description : null,
                'preferences' => $preferences,
                'photos' => $photosUserArray,
                'minimum_age_preference' => $myProfile->minimum_age,
                'maximum_age_preference' => $myProfile->maximum_age,
                'habits' => $habits,
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

    public function assingnedGenderAndSexuality(Request $request)
    {
        DB::beginTransaction();

        try {

            $user = $request->user();

            $validatedData = $request->validate(
                $this->user->rulesAttributionOfGenderAndSexuality(),
                $this->user->feedbackAttributionOfGenderAndSexuality()
            );

            $fk_gender_user_id = $request->fk_gender_user_id;
            $fk_sexuality_user_id = $request->fk_sexuality_user_id;
            $fk_sub_gender_user_id = $request->fk_sub_gender_user_id;
            $about_me = $request->about_me;

            if ($fk_sub_gender_user_id != null) {

                $verifySubGender = SubGender::where('id', $fk_sub_gender_user_id)->first();

                if ($verifySubGender) {
                    $result = $verifySubGender->fk_genders_sub_genders_id == $fk_gender_user_id;
                }

                if (!$result) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Não é possível selcionar essa nomênclatura.'
                    ]);
                }
            }

            if ($validatedData) {
                $user->update([
                    'fk_gender_user_id' => $fk_gender_user_id,
                    'fk_sexuality_user_id' => $fk_sexuality_user_id,
                    'fk_sub_gender_user_id' => $fk_sub_gender_user_id,
                    'about_me' => $about_me,
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

    public function preferences(Request $request)
    {
        DB::beginTransaction();

        try {

            $user = $request->user();

            $validatedData = $request->validate(
                $this->user->rulesPreference(),
                $this->user->feedbackPreference(),
            );

            $fk_gender_preferences_id = $request->input('fk_gender_preferences_id');
            $habits = $request->input('habits');

            if ($validatedData) {
                $user->preferences()->sync($fk_gender_preferences_id);
                $user->habits()->sync($habits);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Preferencia/hábito(s) atribuído(s) com sucesso.',
            ]);
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