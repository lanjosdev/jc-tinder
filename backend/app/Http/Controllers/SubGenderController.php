<?php

namespace App\Http\Controllers;

use App\Models\SubGender;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class SubGenderController extends Controller
{
    protected $sub_genders;

    public function __construct(SubGender $sub_genders)
    {
        $this->sub_genders = $sub_genders;
    }

    public function getAll()
    {
        try {
            $get_all = SubGender::all();

            $subGender = $get_all->map(function ($subGender) {
                return [
                    'id' => $subGender->id,
                    'name' => $subGender->name,
                    'description' => $subGender->description,
                    'gender_main' => $subGender->fk_genders_sub_genders_id ? $subGender->gender->name : null,
                ];
            });

            if ($subGender) {
                return response()->json([
                    'success' => true,
                    'message' => 'Sub-generos recuperados com sucesso.',
                    'data' => $subGender,
                ]);
            }
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
}