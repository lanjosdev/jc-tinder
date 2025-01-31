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

                $result = $this->utils->handleImageUploads($photos, $user);
                $savedImages = $result['savedImages'];
                $thumbnailPaths = $result['thumbnailPaths'];

                // Salvar no banco de dados
                $photoUser = $this->photo->create([
                    'name_photo' => $savedImages = $result['savedImages'][0],
                    'thumb_photo' => $thumbnailPaths = $result['thumbnailPaths'][0],
                    'fk_user_photos_id' => $user->id,
                ]);
            }

            if ($photoUser) {
                DB::commit();
                return response()->json([
                    'success' => true,
                    'message' => 'Fotos(s) salva(s) com sucesso.',
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

            $newPhoto = $request->file('name_photo');

            if (!is_array($newPhoto)) {
                $newPhoto = [$newPhoto];
            }

            if (count($newPhoto) > 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'Permitido 1 fotos apenas.',
                ]);
            }

            $result = $this->utils->handleImageUploads($newPhoto, $user);
            $savedImages = $result['savedImages'][0];
            $thumbnailPaths = $result['thumbnailPaths'][0];

            //deleta img antiga no DB
            $photo->delete();

            if ($validatedData) {
                $newPhotoUser = $this->photo->create([
                    'name_photo' => $savedImages,
                    'thumb_photo' => $thumbnailPaths,
                    'fk_user_photos_id' => $user->id,
                ]);
            }

            if ($newPhotoUser) {
                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Foto atualizada com sucesso.',
                    'data' => $newPhotoUser->id,
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