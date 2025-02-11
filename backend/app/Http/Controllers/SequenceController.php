<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use App\Models\Sequence;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SequenceController extends Controller
{
    protected $sequence;

    public function __construct(Sequence $sequence)
    {
        $this->sequence = $sequence;
    }

    public function getAllOrderPhotosUser(Request $request)
    {
        try {
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

    public function updateSequence(Request $request)
    {
        DB::beginTransaction();
        try {

            $user = $request->user();

            $photos = Photo::where('fk_user_photos_id', $user->id)->get();

            if (!$photos) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nenhuma foto do usuário encontrada.'
                ]);
            }

            $validatedData = $request->validate(
                $this->sequence->rules(),
                $this->sequence->feedback()
            );

            if ($validatedData) {

                //se input estiver preenchido
                if (!empty($request->input('sequence'))) {
                    $sequence = $request->input('sequence');
                    $result = 0;

                    foreach ($sequence as $item) {
                        //atualiza a sequencia
                        $updatedRows = Sequence::where('fk_sequences_photos_id', $item['fk_sequences_photos_id'])
                            ->update(['order' => $item['order']]);

                        //soma os updates com sucesso
                        $result += $updatedRows;
                    }
                    
                    //se tiver algum sucesso retorna
                    if ($result > 0) {
                        DB::commit();
                        return response()->json([
                            'success' => true,
                            'message' => 'Ordem atualizada com sucesso.',
                        ]);
                    }
                }
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