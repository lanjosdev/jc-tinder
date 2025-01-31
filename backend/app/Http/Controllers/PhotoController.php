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


    public function store(Request $request)
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
                        $photoUser = $this->photo->create([
                            'name_photo' => $fullPath,
                            'thumb_photo' => $thumbnailPath,
                            'fk_user_photos_id' => $user->id,
                        ]);
                    }
                }
            }

            if ($photoUser) {
                DB::commit();
                return response()->json([
                    'success' => true,
                    'message' => 'Fotos(s) salva(s) com sucesso.',
                    'data' => [$savedImages, $thumbnailPath],
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

    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $user = $request->user();

            $quantityPhotosUser = Photo::where('fk_user_photos_id', $user->id)->get();

            if ($quantityPhotosUser->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuário não tem nenhuma foto.'
                ]);
            }

            $photo = Photo::where('id', $id)->first();

            if (!$photo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nenhum resultado encontrado, por favor verifique.'
                ]);
            }


            $photosUser = $photo->fk_user_photos_id;

            if ($photosUser != $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Essa foto não pertence ao usuário desta requisição.'
                ]);
            }

            $validatedData = $request->validate(
                $this->photo->rulesPhotoUpdate(),
                $this->photo->feedbackPhotoUpdate()
            );

            $photo->fill($validatedData);
            $photo->save();

            if ($photo) {
                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Foto atualizada com sucesso.',
                    'data' => $photo,
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

    public function delete(Request $request, $id)
    {
        DB::beginTransaction();
        try {

            $user = $request->user();

            $quantityPhotosUser = Photo::where('fk_user_photos_id', $user->id)->get();

            if ($quantityPhotosUser->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuário não tem nenhuma foto.'
                ]);
            }

            $photo = Photo::where('id', $id)->first();

            if (!$photo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nenhum resultado encontrado, por favor verifique.'
                ]);
            }

            $photosUser = $photo->fk_user_photos_id;

            if ($photosUser != $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Essa foto não pertence ao usuário desta requisição.'
                ]);
            }

            if (count($quantityPhotosUser) < 2) {
                return response()->json([
                    'success' => false,
                    'message' => 'Não é possível executar essa ação. Usuário deve ter no mínimo uma foto no perfil.'
                ]);
            }

            // if (file_exists(public_path($photo->name_photo))) {
            //     unlink(public_path($photo->name_photo));
            // }

            // if (file_exists(public_path($photo->thumb_photo))) {
            //     unlink(public_path($photo->thumb_photo));
            // }

            $photo->delete();

            if ($photo) {
                DB::commit();
                return response()->json([
                    'success' => true,
                    'message' => 'Foto removida com sucesso.'
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
}