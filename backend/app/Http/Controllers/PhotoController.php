<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use App\Models\Utils;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

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

            if ($validatedData) {
                $photos = $request->file('name_photo');

                // Garante que sempre será tratado como array
                if (!is_array($photos)) {
                    $photos = [$photos];
                }

                //permite até 4 fotos
                if (count($photos) > 4) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Permitido até 4 fotos.',
                    ]);
                }

                //Aqui chama a função para upload/cria thumb e armazena na pasta public
                $result = $this->utils->handleImageUploads($photos, $user);
                $savedImages = $result['savedImages'];
                $thumbnailPaths = $result['thumbnailPaths'];

                //cria no db
                foreach ($savedImages as $index => $imagePath) {
                    $photoUser = $this->photo->create([
                        'name_photo' => $imagePath,
                        'thumb_photo' => $thumbnailPaths[$index] ?? null,
                        'fk_user_photos_id' => $user->id,
                    ]);
                }
            }

            // $client = new Client();

            // $apiKey = env('API_TOKEN');

            // $responseResult = [];

            // //for para enviar uma foto de cada vez para moderação caso tenha mais de uma
            // for ($i = 0; $i < count($savedImages); $i++) {
            //     $response = $client->request('POST', 'https://moderacao.bizsys.com.br/api/media_insert', [
            //         'headers' => [
            //             'Authorization' => "Bearer $apiKey",
            //             'Accept' => 'application/json',
            //         ],
            //         'multipart' => [
            //             [
            //                 'name' => 'text',
            //                 'contents' => 'text', // Pode ser uma string vazia
            //             ],
            //             [
            //                 'name' => 'identification',
            //                 'contents' => '00000000000', // CPF
            //             ],
            //             [
            //                 'name' => 'phone',
            //                 'contents' => $user->phone,
            //             ],
            //             [
            //                 'name' => 'fk_id_client',
            //                 'contents' => 1,
            //             ],
            //             [
            //                 'name' => 'fk_id_campain',
            //                 'contents' => 14,
            //             ],
            //             [
            //                 'name' => 'fk_id_media_type',
            //                 'contents' => 1, // Aqui é 1 para foto
            //             ],
            //             [
            //                 'name' => 'participation',
            //                 'contents' => now('America/Sao_Paulo'), // Data formatada corretamente
            //             ],
            //             [
            //                 'name' => 'send_override',
            //                 'contents' => 0,
            //             ],
            //             [
            //                 'name' => 'file',
            //                 'contents' => fopen($savedImages[$i], 'r'),
            //                 'filename' => basename($savedImages[$i]), // Nome do arquivo opcional
            //             ],
            //         ],
            //     ]);
            //     $result = json_decode($response->getBody(), true);

            //     $responseResult[] = $result;
            // }

            // dd($responseResult);

            // dd();

            if ($photoUser) {
                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Foto(s) salva(s) com sucesso.',
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

            //validação para verificar se user acessou uma foto que não pertence a ele
            $photosUser = $photo->fk_user_photos_id;

            if ($photosUser != $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Essa foto não pertence ao usuário desta requisição.'
                ]);
            }

            $validatedData = $request->validate(
                $this->photo->rulesPhoto(),
                $this->photo->feedbackPhoto()
            );

            $newPhoto = $request->file('name_photo');

            //tranforma em array
            if (!is_array($newPhoto)) {
                $newPhoto = [$newPhoto];
            }

            //
            if (count($newPhoto) > 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'Permitido 1 fotos apenas.',
                ]);
            }

            //chama função para manipulação da imagem para criar thumb e salvar
            $result = $this->utils->handleImageUploads($newPhoto, $user);
            $savedImages = $result['savedImages'][0];
            $thumbnailPaths = $result['thumbnailPaths'][0];

            //deleta img antiga com soft-delete
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

            //verificar se user tem foto
            $quantityPhotosUser = Photo::where('fk_user_photos_id', $user->id)->get();

            if ($quantityPhotosUser->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuário não tem nenhuma foto.'
                ]);
            }

            //verificar se foto informada existe
            $photo = Photo::where('id', $id)->first();

            if (!$photo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nenhum resultado encontrado, por favor verifique.'
                ]);
            }

            //validação para verfificar se o user pergou apenas suas imagens
            $photosUser = $photo->fk_user_photos_id;

            if ($photosUser != $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Essa foto não pertence ao usuário desta requisição.'
                ]);
            }

            //não permite o user remover todas as fotos
            if (count($quantityPhotosUser) < 2) {
                return response()->json([
                    'success' => false,
                    'message' => 'Não é possível executar essa ação. Usuário deve ter no mínimo uma foto no perfil.'
                ]);
            }

            //deleta com softdeletes
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