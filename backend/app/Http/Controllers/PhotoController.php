<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use App\Models\Utils;
use DateTime;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

use Intervention\Image\Facades\Image;

class PhotoController extends Controller
{
    protected $photo;
    protected $utils;

    public function __construct(Photo $photo, Utils $utils)
    {
        $this->photo = $photo;
        $this->utils = $utils;
    }


    public function photoStore(Request $request)
    {

        DB::beginTransaction();

        try {
            $user = $request->user();

            $validatedData = $request->validate(
                $this->photo->rulesPhoto(),
                $this->photo->feedbackPhoto()
            );

            $savedImages = [];
            $thumbnailPaths = [];

            // if ($validatedData) {

            //     $photos = [];
            //     $photos = $request->file('name_photo');

            //     if (count($photos) > 4) {
            //         return response()->json([
            //             'success' => false,
            //             'message' => 'Permitido até 4 fotos.',
            //         ]);
            //     }

            //     foreach ($photos as $photo) {
            //         if ($photo->isValid()) {

            //             // Gerar nome do arquivo
            //             $filename = $user->id . '-' . now()->format('Y-m-d_H-i-s') . '.' . $photo->getClientOriginalExtension();

            //             // Caminho de destino
            //             $destinationPath = public_path('images/');
            //             if (!file_exists($destinationPath)) {
            //                 mkdir($destinationPath, 0775, true);
            //             }

            //             // Verifique se o arquivo foi movido com sucesso
            //             $photo->move($destinationPath, $filename);

            //             $fullPath = 'images/' . $filename;
            //             $savedImages[] = $fullPath;

            //             // Verificar e criar pasta para thumbnails
            //             $destinationPathThumbnail = public_path('images/thumbnails/');
            //             if (!file_exists($destinationPathThumbnail)) {
            //                 mkdir($destinationPathThumbnail, 0775, true);
            //             }

            //             // Gerar miniatura
            //             $thumbnailPath = 'images/thumbnails/thumb_' . $filename;
            //             $this->utils->createThumbnail(public_path($fullPath), public_path($thumbnailPath), 150, 150);
            //             $thumbnailPaths[] = 'images/thumbnails/thumb_' . $filename;

            //             // Salvar no banco de dados
            //             $this->photo->create([
            //                 'name_photo' => $filename,
            //                 'thumb_photo' => $thumbnailPath,
            //                 'fk_user_photos_id' => $user->id,
            //             ]);
            //         }
            //     }
            // }

            if ($validatedData) {
                $photos = $request->file('name_photo');

                // Garante que sempre será tratado como array
                if (!is_array($photos)) {
                    $photos = [$photos];
                }

                if (count($photos) > 4) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Permitido até 4 fotos.',
                    ]);
                }

                foreach ($photos as $photo) {
                    if ($photo->isValid()) {

                        // Gerar nome de arquivo único
                        $filename = $user->id . '-' . now()->format('Y-m-d_H-i-s') . '-' . uniqid() . '.' . $photo->getClientOriginalExtension();

                        // Caminho de destino para imagem original
                        $destinationPath = public_path('images/');
                        if (!file_exists($destinationPath)) {
                            mkdir($destinationPath, 0775, true);
                        }

                        // Mover imagem para destino
                        $photo->move($destinationPath, $filename);

                        $fullPath = 'images/' . $filename;
                        $savedImages[] = $fullPath;

                        // Verificar e criar pasta para thumbnails
                        $destinationPathThumbnail = public_path('images/thumbnails/');
                        if (!file_exists($destinationPathThumbnail)) {
                            mkdir($destinationPathThumbnail, 0775, true);
                        }

                        // Gerar miniatura
                        $thumbnailPath = 'images/thumbnails/thumb_' . $filename;
                        $this->utils->createThumbnail(public_path($fullPath), public_path($thumbnailPath), 150, 150);
                        $thumbnailPaths[] = $thumbnailPath;

                        // Salvar no banco de dados
                        $this->photo->create([
                            'name_photo' => $fullPath,
                            'thumb_photo' => $thumbnailPath,
                            'fk_user_photos_id' => $user->id,
                        ]);
                    }
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Fotos(s) salva(s) com sucesso.',
                'data' => [$savedImages, $thumbnailPath],
            ]);
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
}