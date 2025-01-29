<?php

namespace App\Http\Controllers;

use App\Models\Gender;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class GenderController extends Controller
{
    protected $gender;

    public function __construct(Gender $gender)
    {
        $this->gender = $gender;
    }
    /**
     * Display a listing of the resource.
     */
    public function getAll()
    {
        try {
            $getAllGenders = Gender::all();

            $genders = $getAllGenders->map(function ($gender) {
                return [
                    'id' => $gender->id,
                    'name' => $gender->name,
                    'description' => $gender->description,
                ];
            });
            
            if ($genders) {
                return response()->json([
                    'success' => true,
                    'message' => 'Gêneros recuperados com sucesso.',
                    'data' => $genders,
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

    public function gendersNotBinary()
    {
        
    }
}