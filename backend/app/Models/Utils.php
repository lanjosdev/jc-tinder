<?php

namespace App\Models;

use Carbon\Carbon;
use Exception;

class Utils
{
    function formattedDate($model, $params)
    {
        $formatedDateWithdrawalDate = explode(" ", $model->$params);

        $formatedHoursWithdrawalDate = $formatedDateWithdrawalDate[1];
        $formatedDateWithdrawalDate = explode('-', $formatedDateWithdrawalDate[0]);
        return $formatedDateWithdrawalDate[2] . '/' . $formatedDateWithdrawalDate[1] . '/' . $formatedDateWithdrawalDate[0] . ' ' . $formatedHoursWithdrawalDate;
    }

    function verifyAdult($birth_data)
    {
        $idade = Carbon::parse($birth_data)->age;
        return $idade;
    }

    // Função para criar a miniatura dependendo do tipo de imagem
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
}