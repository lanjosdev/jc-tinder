<?php

namespace App\Models;

use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class Utils
{
    //formata data e hora para retornar ao front
    function formattedDate($model, $params)
    {
        $formatedDateWithdrawalDate = explode(" ", $model->$params);

        $formatedHoursWithdrawalDate = $formatedDateWithdrawalDate[1];
        $formatedDateWithdrawalDate = explode('-', $formatedDateWithdrawalDate[0]);
        return $formatedDateWithdrawalDate[2] . '/' . $formatedDateWithdrawalDate[1] . '/' . $formatedDateWithdrawalDate[0] . ' ' . $formatedHoursWithdrawalDate;
    }

    //verifica se é maior de idade
    function verifyAdult($birth_data)
    {
        $idade = Carbon::parse($birth_data)->age;
        return $idade;
    }

    //get os matchs que o user da requisição tem 
    function getAllMatchs($idUserRequest)
    {
        $userLikes = Matche::where('fk_user_matches_id', $idUserRequest)
            ->where('status', 1)
            ->whereNull('deleted_at')
            ->get();

        $matchedUserIds = [];

        //guarda na variavel os ids dos users "like"
        foreach ($userLikes as $like) {
            $matchingLike = Matche::where('fk_user_matches_id', $like->fk_target_user_matches_id)
                ->where('fk_target_user_matches_id', $idUserRequest)
                ->where('status', 1)
                ->whereNull('deleted_at')
                ->first();

            if ($matchingLike) {
                $matchedUserIds[] = $like->fk_target_user_matches_id;
            }
        }

        //guarda ids sem repetição
        return $matchedUserIds = array_unique($matchedUserIds);
    }

    //cria a thumb de fotos renomeia e e salva thumb e original em pastas diferentes 
    function handleImageUploads(array $photos, $user, $thumbnailWidth = 400)
    {
        $savedImages = [];
        $thumbnailPaths = [];

        DB::beginTransaction();

        try {
            foreach ($photos as $photo) {
                if ($photo->isValid()) {

                    // geraa nome de arquivo único
                    $filename = $user->id . '-' . now()->format('Y-m-d_H-i-s') . '-' . uniqid() . '.' . $photo->getClientOriginalExtension();

                    // caminho para a imagem original
                    $destinationPath = public_path('images/');
                    if (!File::exists($destinationPath)) {
                        File::makeDirectory($destinationPath, 0775, true);
                    }

                    // mover imagem original para destino
                    $photo->move($destinationPath, $filename);
                    $fullPath = 'images/' . $filename;
                    $savedImages[] = $fullPath;

                    // verifica se a imagem foi salva
                    if (!File::exists(public_path($fullPath))) {
                        throw new Exception("Erro ao salvar a imagem.");
                    }

                    // se não existir caminho para thumb, cria
                    $destinationPathThumbnail = public_path('images/thumbnails/');
                    if (!File::exists($destinationPathThumbnail)) {
                        File::makeDirectory($destinationPathThumbnail, 0775, true);
                    }

                    // instancia o objeto
                    $manager = new ImageManager(new Driver());

                    // lê a imagem original
                    $image = $manager->read(public_path($fullPath));

                    //armazena largura e altura da imagem original
                    $widthOld = $image->width();
                    $heightOld = $image->height();

                    // calcula a altura da thumb para ficar proporcional aos 400px de largura
                    $heightThumbnail = ($heightOld * $thumbnailWidth) / $widthOld;

                    // redimensiona proporcionalmente
                    $image->resize($thumbnailWidth, $heightThumbnail);

                    // Salva a thumb
                    $thumbnailPath = public_path('images/thumbnails/thumb_' . $filename);
                    $image->save($thumbnailPath);

                    // Adiciona o caminho ao array de thumbnails
                    $thumbnailPaths[] = 'images/thumbnails/thumb_' . $filename;
                }
            }

            // //Liberar memória
            // imagedestroy($image);

            DB::commit();

            return [
                'success' => true,
                'savedImages' => $savedImages,
                'thumbnailPaths' => $thumbnailPaths
            ];
        } catch (Exception $e) {
            DB::rollBack();

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'savedImages' => $savedImages ?? [],
                'thumbnailPaths' => $thumbnailPaths ?? []
            ];
        }
    }
}