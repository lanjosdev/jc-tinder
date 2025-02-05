<?php

namespace App\Models;

use Carbon\Carbon;
use Exception;

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

    // cria miniatura da imagem original
    public function createThumbnail($imagePath, $thumbPath, $width, $height)
    {
        // Verifica o tipo de imagem
        $imageInfo = getimagesize($imagePath);
        $mimeType = $imageInfo['mime'];

        // Carregar a imagem de acordo com o tipo
        switch ($mimeType) {
            case 'image/jpeg':
                $image = imagecreatefromjpeg($imagePath);
                break;
            case 'image/png':
                $image = imagecreatefrompng($imagePath);
                break;
            case 'image/gif':
                $image = imagecreatefromgif($imagePath);
                break;
            default:
                throw new Exception("Formato de imagem não suportado para miniatura: " . $mimeType);
        }

        // Verificar se a imagem foi carregada corretamente
        if (!$image) {
            throw new Exception("Erro ao carregar a imagem: " . $imagePath);
        }

        // Obter as dimensões da imagem original
        list($originalWidth, $originalHeight) = getimagesize($imagePath);

        // Calculando a proporção da miniatura
        $ratio = min($width / $originalWidth, $height / $originalHeight);
        $thumbWidth = (int)($originalWidth * $ratio);
        $thumbHeight = (int)($originalHeight * $ratio);

        // Criar a imagem de miniatura
        $thumb = imagecreatetruecolor($thumbWidth, $thumbHeight);

        // Redimensionar a imagem
        imagecopyresampled($thumb, $image, 0, 0, 0, 0, $thumbWidth, $thumbHeight, $originalWidth, $originalHeight);

        // Salvar a miniatura no caminho especificado
        switch ($mimeType) {
            case 'image/jpeg':
                imagejpeg($thumb, $thumbPath);
                break;
            case 'image/png':
                imagepng($thumb, $thumbPath);
                break;
            case 'image/gif':
                imagegif($thumb, $thumbPath);
                break;
        }

        // Liberar a memória
        imagedestroy($image);
        imagedestroy($thumb);
    }

    // em conjunto com a função de criar img miniatura, cria e salva ela e a maior na pasta public com path completo e identificador único
    function handleImageUploads(array $photos, $user, $thumbnailWidth = 150, $thumbnailHeight = 150)
    {
        $savedImages = [];
        $thumbnailPaths = [];

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
                $utils = new Utils(); // Certifique-se de que a classe Utils esteja disponível
                $utils->createThumbnail(public_path($fullPath), public_path($thumbnailPath), $thumbnailWidth, $thumbnailHeight);

                $thumbnailPaths[] = $thumbnailPath;
            }
        }

        return [
            'savedImages' => $savedImages,
            'thumbnailPaths' => $thumbnailPaths
        ];
    }





    ////////////////////teste
    ////////////////////função para pegar imagem de uma pasta teste
    function handleFolderImageUploads($folderPath, $user, $thumbnailWidth = 150, $thumbnailHeight = 150)
    {
        $savedImages = [];
        $thumbnailPaths = [];

        $user = 1;

        if (!file_exists($folderPath) || !is_dir($folderPath)) {
            throw new Exception("A pasta fornecida não existe.");
        }

        $imageFiles = array_filter(scandir($folderPath), function ($file) use ($folderPath) {
            $filePath = $folderPath . DIRECTORY_SEPARATOR . $file;
            return is_file($filePath) && preg_match('/\.(jpg|jpeg|png|gif)$/i', $file);
        });

        foreach ($imageFiles as $file) {
            $imagePath = $folderPath . DIRECTORY_SEPARATOR . $file;

            // Gerar nome único
            $filename = $user++ . '-' . now()->format('Y-m-d_H-i-s') . '-' . uniqid() . '.' . pathinfo($file, PATHINFO_EXTENSION);

            $destinationPath = public_path('images/');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0775, true);
            }

            $newImagePath = $destinationPath . $filename;

            if (file_exists($newImagePath)) {
                continue; // Pula arquivos já copiados
            }

            copy($imagePath, $newImagePath);

            $fullPath = 'images/' . $filename;
            $savedImages[] = $fullPath;

            // Pasta para miniaturas
            $destinationPathThumbnail = public_path('images/thumbnails/');
            if (!file_exists($destinationPathThumbnail)) {
                mkdir($destinationPathThumbnail, 0775, true);
            }

            $thumbnailPath = 'images/thumbnails/thumb_' . $filename;
            $utils = new Utils();
            $utils->createThumbnail(public_path($fullPath), public_path($thumbnailPath), $thumbnailWidth, $thumbnailHeight);

            $thumbnailPaths[] = $thumbnailPath;

            // Remove a imagem original para evitar reprocessamento
            unlink($imagePath);
        }

        return [
            'savedImages' => $savedImages,
            'thumbnailPaths' => $thumbnailPaths
        ];
    }
}