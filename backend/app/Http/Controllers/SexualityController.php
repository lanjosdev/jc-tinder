<?php

namespace App\Http\Controllers;

use App\Models\Sexuality;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class SexualityController extends Controller
{
    protected $sexuality;

    public function __construct(Sexuality $sexuality)
    {
        $this->sexuality = $sexuality;
    }

    public function getAll()
    {
        try {
            $getAllSexualities = Sexuality::all();

            $sexualities = $getAllSexualities->map(function ($sexuality) {
                return [
                    'id' => $sexuality->id,
                    'name' => $sexuality->name,
                    'description' => $sexuality->description,
                ];
            });

            if ($sexualities) {
                return response()->json([
                    'success' => true,
                    'message' => 'Sexualidades recuperadas com sucesso.',
                    'data' => $sexualities,
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