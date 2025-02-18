<?php

namespace App\Http\Controllers;

use App\Models\Habit;
use Exception;
use Illuminate\Database\QueryException;

class HabitController extends Controller
{
    protected $habits;

    public function __construct(Habit $habits)
    {
        $this->habits = $habits;
    }

    public function getAll()
    {
        try {
            $get_all = Habit::all();

            //formata a resposta
            $habits = $get_all->map(function ($habits) {
                return [
                    'id' => $habits->id,
                    'name' => $habits->name,
                ];
            });

            if ($habits) {
                return response()->json([
                    'success' => true,
                    'message' => 'Hábitos recuperados com sucesso.',
                    'data' => $habits,
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