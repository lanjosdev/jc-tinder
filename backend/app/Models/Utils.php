<?php

namespace App\Models;

use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

// use Intervention\Image\ImageManagerStatic as Image;


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
    // public function createThumbnail($imagePath, $thumbPath, $width, $height)
    // {
    //     // Verifica o tipo de imagem e obtém as dimensões
    //     $imageInfo = getimagesize($imagePath);
    //     $mimeType = $imageInfo['mime'];
    //     $originalWidth = $imageInfo[0];
    //     $originalHeight = $imageInfo[1];


    //     // Carregar a imagem de acordo com o tipo
    //     switch ($mimeType) {
    //         case 'image/jpeg':
    //             $image = imagecreatefromjpeg($imagePath);
    //             break;
    //         case 'image/png':
    //             $image = imagecreatefrompng($imagePath);
    //             break;
    //         case 'image/gif':
    //             $image = imagecreatefromgif($imagePath);
    //             break;
    //         default:
    //             // return response()->json([
    //             //     'success' => false,
    //             //     'message' =>  "Formato de imagem não suportado para miniatura: " . $mimeType,
    //             // ]);
    //             throw new Exception("Formato de imagem não suportado para miniatura: " . $mimeType);
    //     }

    //     // Verificar se a imagem foi carregada corretamente
    //     if (!$image) {
    //         // return response()->json([
    //         //     'success' => false,
    //         //     'message' =>  "Erro ao carregar a imagem: " . $imagePath,
    //         // ]);
    //         throw new Exception("Erro ao carregar a imagem: " . $imagePath);
    //     }

    //     // Calculando a proporção da miniatura
    //     $ratio = min($width / $originalWidth, $height / $originalHeight);
    //     $thumbWidth = (int)($originalWidth * $ratio);
    //     $thumbHeight = (int)($originalHeight * $ratio);

    //     // // Se a imagem estiver na horizontal, girar 90 graus
    //     // if ($originalWidth > $originalHeight) {
    //     //     $image = imagerotate($image, 90, 0);
    //     // }

    //     // Criar a imagem de miniatura
    //     $thumb = imagecreatetruecolor($thumbWidth, $thumbHeight);

    //     // Redimensionar a imagem
    //     imagecopyresampled($thumb, $image, 0, 0, 0, 0, $thumbWidth, $thumbHeight, $originalWidth, $originalHeight);

    //     // Salvar a miniatura no caminho especificado
    //     switch ($mimeType) {
    //         case 'image/jpeg':
    //             imagejpeg($thumb, $thumbPath);
    //             break;
    //         case 'image/png':
    //             imagepng($thumb, $thumbPath);
    //             break;
    //         case 'image/gif':
    //             imagegif($thumb, $thumbPath);
    //             break;
    //     }

    //     // Liberar a memória
    //     imagedestroy($image);
    //     imagedestroy($thumb);
    // }

    // public function createThumbnail($imagePath, $thumbPath, $width, $height)
    // {
    //     // Obtém as informações da imagem
    //     $imageInfo = getimagesize($imagePath);
    //     if (!$imageInfo) {
    //         throw new Exception("Erro ao obter informações da imagem: " . $imagePath);
    //     }

    //     $mimeType = $imageInfo['mime'];
    //     $originalWidth = $imageInfo[0];
    //     $originalHeight = $imageInfo[1];

    //     // Carregar a imagem de acordo com o tipo
    //     switch ($mimeType) {
    //         case 'image/jpeg':
    //             $image = imagecreatefromjpeg($imagePath);
    //             break;
    //         case 'image/png':
    //             $image = imagecreatefrompng($imagePath);
    //             break;
    //         case 'image/gif':
    //             $image = imagecreatefromgif($imagePath);
    //             break;
    //         default:
    //             throw new Exception("Formato de imagem não suportado: " . $mimeType);
    //     }

    //     if (!$image) {
    //         throw new Exception("Erro ao carregar a imagem: " . $imagePath);
    //     }

    //     // Corrigir rotação baseada nos metadados EXIF (apenas para JPEG)
    //     if ($mimeType === 'image/jpeg' && function_exists('exif_read_data')) {
    //         $exif = @exif_read_data($imagePath);
    //         if (!empty($exif['Orientation'])) {
    //             switch ($exif['Orientation']) {
    //                 case 3:
    //                     $image = imagerotate($image, 180, 0);
    //                     break;
    //                 case 6:
    //                     $image = imagerotate($image, -90, 0);
    //                     break;
    //                 case 8:
    //                     $image = imagerotate($image, 90, 0);
    //                     break;
    //             }
    //         }
    //     }

    //     // Criar a miniatura mantendo a proporção original
    //     $ratio = min($width / $originalWidth, $height / $originalHeight);
    //     $thumbWidth = (int)($originalWidth * $ratio);
    //     $thumbHeight = (int)($originalHeight * $ratio);

    //     // Criar imagem para miniatura
    //     $thumb = imagecreatetruecolor($thumbWidth, $thumbHeight);
    //     imagecopyresampled($thumb, $image, 0, 0, 0, 0, $thumbWidth, $thumbHeight, $originalWidth, $originalHeight);

    //     // Salvar a miniatura
    //     switch ($mimeType) {
    //         case 'image/jpeg':
    //             imagejpeg($thumb, $thumbPath, 90); // Qualidade 90%
    //             break;
    //         case 'image/png':
    //             imagepng($thumb, $thumbPath);
    //             break;
    //         case 'image/gif':
    //             imagegif($thumb, $thumbPath);
    //             break;
    //     }

    //     // Liberar memória
    //     imagedestroy($image);
    //     imagedestroy($thumb);
    // }

    // public function createThumbnail($imagePath, $thumbPath, $thumbWidth, $thumbHeight)
    // {
    //     // Obtém informações da imagem original
    //     $imageInfo = getimagesize($imagePath);
    //     $mimeType = $imageInfo['mime'];
    //     $originalWidth = $imageInfo[0];
    //     $originalHeight = $imageInfo[1];

    //     // Carrega a imagem conforme o tipo
    //     switch ($mimeType) {
    //         case 'image/jpeg':
    //             $image = imagecreatefromjpeg($imagePath);
    //             break;
    //         case 'image/png':
    //             $image = imagecreatefrompng($imagePath);
    //             break;
    //         case 'image/gif':
    //             $image = imagecreatefromgif($imagePath);
    //             break;
    //         default:
    //             return false; // Tipo não suportado
    //     }

    //     if (!$image) {
    //         return false;
    //     }

    //     // Corrigir a orientação da imagem usando EXIF (somente para JPEG)
    //     if ($mimeType === 'image/jpeg' && function_exists('exif_read_data')) {
    //         $exif = @exif_read_data($imagePath);
    //         if (!empty($exif['Orientation'])) {
    //             switch ($exif['Orientation']) {
    //                 case 3:
    //                     $image = imagerotate($image, 180, 0);
    //                     break;
    //                 case 6:
    //                     $image = imagerotate($image, -90, 0);
    //                     break;
    //                 case 8:
    //                     $image = imagerotate($image, 90, 0);
    //                     break;
    //             }
    //         }
    //     }

    //     //Calculando a proporção da miniatura
    //     $ratio = min($thumbWidth / $originalWidth, $thumbHeight / $originalHeight);
    //     $thumbWidth = (int)($originalWidth * $ratio);
    //     $thumbHeight = (int)($originalHeight * $ratio);

    //     // Criar a imagem de miniatura
    //     $thumb = imagecreatetruecolor($thumbWidth, $thumbHeight);

    //     // Redimensionar a imagem
    //     imagecopyresampled($thumb, $image, 0, 0, 0, 0, $thumbWidth, $thumbHeight, $originalWidth, $originalHeight);

    //     // Salvar a miniatura no caminho especificado
    //     switch ($mimeType) {
    //         case 'image/jpeg':
    //             imagejpeg($thumb, $thumbPath);
    //             break;
    //         case 'image/png':
    //             imagepng($thumb, $thumbPath);
    //             break;
    //         case 'image/gif':
    //             imagegif($thumb, $thumbPath);
    //             break;
    //     }

    //     // Liberar a memória
    //     imagedestroy($image);
    //     imagedestroy($thumb);
    // }

    // public function createThumbnail($imagePath, $thumbPath, $maxWidth = 400)
    // {
    //     // Verifica o tipo de imagem e obtém as dimensões
    //     $imageInfo = getimagesize($imagePath);
    //     $mimeType = $imageInfo['mime'];
    //     $originalWidth = $imageInfo[0];
    //     $originalHeight = $imageInfo[1];

    //     // Carregar a imagem de acordo com o tipo
    //     switch ($mimeType) {
    //         case 'image/jpeg':
    //             $image = imagecreatefromjpeg($imagePath);
    //             break;
    //         case 'image/png':
    //             $image = imagecreatefrompng($imagePath);
    //             break;
    //         case 'image/gif':
    //             $image = imagecreatefromgif($imagePath);
    //             break;
    //         default:
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => "Formato de imagem não suportado: " . $mimeType,
    //             ]);
    //     }

    //     if (!$image) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => "Erro ao carregar a imagem: " . $imagePath,
    //         ]);
    //     }

    //     // 🔹 Corrigir rotação automática usando EXIF (para imagens JPEG)
    //     if ($mimeType === 'image/jpeg') {
    //         $exif = @exif_read_data($imagePath);
    //         if ($exif && isset($exif['Orientation'])) {
    //             switch ($exif['Orientation']) {
    //                 case 3:
    //                     $image = imagerotate($image, 180, 0);
    //                     break;
    //                 case 6:
    //                     $image = imagerotate($image, -90, 0);
    //                     break;
    //                 case 8:
    //                     $image = imagerotate($image, 90, 0);
    //                     break;
    //             }
    //         }
    //     }

    //     // 🔹 Redimensionar mantendo a proporção sem cortar
    //     $ratio = $maxWidth / $originalWidth;
    //     $newWidth = $maxWidth;
    //     $newHeight = (int)($originalHeight * $ratio);

    //     // Criar uma nova imagem com tamanho ajustado
    //     $thumb = imagecreatetruecolor($newWidth, $newHeight);

    //     // 🔹 Preservar transparência para PNGs e GIFs
    //     if ($mimeType === 'image/png' || $mimeType === 'image/gif') {
    //         imagecolortransparent($thumb, imagecolorallocatealpha($thumb, 0, 0, 0, 127));
    //         imagealphablending($thumb, false);
    //         imagesavealpha($thumb, true);
    //     }

    //     // Redimensionar a imagem sem cortar
    //     imagecopyresampled($thumb, $image, 0, 0, 0, 0, $newWidth, $newHeight, $originalWidth, $originalHeight);

    //     // Salvar a miniatura
    //     switch ($mimeType) {
    //         case 'image/jpeg':
    //             imagejpeg($thumb, $thumbPath, 90);
    //             break;
    //         case 'image/png':
    //             imagepng($thumb, $thumbPath);
    //             break;
    //         case 'image/gif':
    //             imagegif($thumb, $thumbPath);
    //             break;
    //     }

    //     // Liberar memória
    //     imagedestroy($image);
    //     imagedestroy($thumb);
    // }


    // function createThumbnail($fullPath, $thumbnailPath, $maxWidth = 400)
    // {
    //     // // Obtendo a imagem
    //     // $image = $request->file('image');
    //     // $imageName = time() . '.' . $image->extension();

    //     // Caminho para a pasta de miniaturas
    //     // $destinationPathThumbnail = public_path('images/thumbnail');

    //     // Usando Intervention Image para processar a imagem
    //     $img = Image::make($image->path());

    //     // Obtendo as dimensões da imagem original
    //     $widthOld = $img->width();
    //     $heightOld = $img->height();

    //     // Definindo a largura da miniatura
    //     $widthThumbnail = $maxWidth;

    //     // Calculando a altura proporcional com base na largura
    //     $heightThumbnail = ($widthThumbnail / $widthOld) * $heightOld;

    //     // Caminho de destino para imagem original
    //     $destinationPath = public_path('images/');
    //     if (!file_exists($destinationPath)) {
    //         mkdir($destinationPath, 0775, true);
    //     }
    //     // Verificar e criar pasta para thumbnails
    //     $destinationPathThumbnail = public_path('images/thumbnails/');
    //     if (!file_exists($destinationPathThumbnail)) {
    //         mkdir($destinationPathThumbnail, 0775, true);
    //     }

    //     // Redimensionando a imagem para a miniatura mantendo a proporção
    //     $img->resize($widthThumbnail, $heightThumbnail, function ($constraint) {
    //         $constraint->aspectRatio(); // Mantém a proporção
    //     })->save($thumbnailPath);

    //     // Salvando a imagem original na pasta de imagens
    //     $image->move($fullPath);

    //     // Retornando a resposta com sucesso
    //     return response()->json([
    //         'success' => 'Image Uploaded successfully!',
    //         'imageName' => $imageName
    //     ]);
    // }

    // public function createThumbnail($fullPath, $thumbnailPath, $maxWidth = 400)
    // {
    //     // Usando Intervention Image para processar a imagem
    //     $img = Image::make($fullPath);

    //     // Obtendo as dimensões da imagem original
    //     $widthOld = $img->width();
    //     $heightOld = $img->height();

    //     // Definindo a largura da miniatura
    //     $widthThumbnail = $maxWidth;

    //     // Calculando a altura proporcional com base na largura
    //     $heightThumbnail = ($heightOld * $widthThumbnail) / $widthOld;

    //     // Redimensionando a imagem para a miniatura mantendo a proporção
    //     $img->resize($widthThumbnail, $heightThumbnail, function ($constraint) {
    //         $constraint->aspectRatio(); // Mantém a proporção
    //     })->save($thumbnailPath); // Salva a miniatura

    //     return true;
    // }

    // //em conjunto com a função de criar img miniatura, cria e salva ela e a maior na pasta public com path completo e identificador único
    // function handleImageUploads(array $photos, $user, $thumbnailWidth = 400, $thumbnailHeight = 150)
    // {

    //     $savedImages = [];
    //     $thumbnailPaths = [];

    //     DB::beginTransaction(); // Iniciar transação
    //     try {

    //         foreach ($photos as $photo) {
    //             if ($photo->isValid()) {
    //                 // Gerar nome de arquivo único
    //                 $filename = $user->id . '-' . now()->format('Y-m-d_H-i-s') . '-' . uniqid() . '.' . $photo->getClientOriginalExtension();

    //                 // Caminho de destino para imagem original
    //                 $destinationPath = public_path('images/');
    //                 if (!file_exists($destinationPath)) {
    //                     mkdir($destinationPath, 0775, true);
    //                 }

    //                 // Mover imagem para destino
    //                 $photo->move($destinationPath, $filename);

    //                 $fullPath = 'images/' . $filename;
    //                 $savedImages[] = $fullPath;

    //                 if (file_exists($fullPath)) {
    //                     list($widthOld, $heightOld) = getimagesize($fullPath);
    //                 } else {
    //                     throw new Exception("Largura da imagem inválida.");
    //                 }

    //                 $thumbnailHeight = ($heightOld * $thumbnailWidth) / $widthOld;

    //                 // Verificar e criar pasta para thumbnails
    //                 $destinationPathThumbnail = public_path('images/thumbnails/');
    //                 if (!file_exists($destinationPathThumbnail)) {
    //                     mkdir($destinationPathThumbnail, 0775, true);
    //                 }

    //                 // Gerar miniatura
    //                 $thumbnailPath = 'images/thumbnails/thumb_' . $filename;
    //                 $utils = new Utils(); // Certifique-se de que a classe Utils esteja disponível
    //                 $utils->createThumbnail(public_path($fullPath), public_path($thumbnailPath), $thumbnailWidth, $thumbnailHeight);

    //                 $thumbnailPaths[] = $thumbnailPath;
    //             }
    //         }

    //         DB::commit(); // Confirma a transação se tudo estiver correto

    //         return [
    //             'success' => true,
    //             'savedImages' => $savedImages,
    //             'thumbnailPaths' => $thumbnailPaths
    //         ];
    //     } catch (Exception $e) {
    //         DB::rollBack(); // Desfaz alterações no banco em caso de erro

    //         // Excluir as imagens já salvas na pasta
    //         foreach ($savedImages as $imagePath) {
    //             if (file_exists($imagePath)) {
    //                 unlink($imagePath);
    //             }
    //         }

    //         foreach ($thumbnailPaths as $thumbPath) {
    //             if (file_exists($thumbPath)) {
    //                 unlink($thumbPath);
    //             }
    //         }

    //         return [
    //             'success' => false,
    //             'message' => 'Erro ao salvar as imagens: ' . $e->getMessage()
    //         ];
    //     }
    // }

    // function handleImageUploads(array $photos, $user, $thumbnailWidth = 400, $thumbnailHeight = 150)
    // {
    //     $savedImages = [];
    //     $thumbnailPaths = [];

    //     DB::beginTransaction(); // Iniciar transação
    //     try {

    //         foreach ($photos as $photo) {
    //             if ($photo->isValid()) {
    //                 // Gerar nome de arquivo único
    //                 $filename = $user->id . '-' . now()->format('Y-m-d_H-i-s') . '-' . uniqid() . '.' . $photo->getClientOriginalExtension();

    //                 // Caminho de destino para imagem original
    //                 $destinationPath = public_path('images/');
    //                 if (!file_exists($destinationPath)) {
    //                     mkdir($destinationPath, 0775, true);
    //                 }

    //                 // Mover imagem para destino
    //                 $photo->move($destinationPath, $filename);

    //                 $fullPath = 'images/' . $filename;
    //                 $savedImages[] = $fullPath;

    //                 // Verifica se a imagem foi salva com sucesso
    //                 if (file_exists(public_path($fullPath))) {
    //                     // list($widthOld, $heightOld) = getimagesize(public_path($fullPath));
    //                 } else {
    //                     throw new Exception("Erro ao obter as dimensões da imagem.");
    //                 }

    //                 // // Calculando altura proporcional com base na largura da miniatura
    //                 // $thumbnailHeightCalculated = ($heightOld * $thumbnailWidth) / $widthOld;

    //                 // Verificar e criar pasta para thumbnails
    //                 $destinationPathThumbnail = public_path('images/thumbnails/');
    //                 if (!file_exists($destinationPathThumbnail)) {
    //                     mkdir($destinationPathThumbnail, 0775, true);
    //                 }

    //                 // Gerar miniatura
    //                 $thumbnailPath = 'images/thumbnails/thumb_' . $filename;
    //                 // $this->createThumbnail(public_path($fullPath), public_path($thumbnailPath), $thumbnailWidth);

    //                 // Usando Intervention Image para processar a imagem
    //                 $img = Image::make($fullPath);

    //                 // Obtendo as dimensões da imagem original
    //                 $widthOld = $img->width();
    //                 $heightOld = $img->height();

    //                 // Definindo a largura da miniatura
    //                 $widthThumbnail = $thumbnailWidth;

    //                 // Calculando a altura proporcional com base na largura
    //                 $heightThumbnail = ($heightOld * $widthThumbnail) / $widthOld;

    //                 // Redimensionando a imagem para a miniatura mantendo a proporção
    //                 $img->resize($widthThumbnail, $heightThumbnail, function ($constraint) {
    //                     $constraint->aspectRatio(); // Mantém a proporção
    //                 })->save($thumbnailPath); // Salva a miniatura

    //                 // Salva o caminho da miniatura gerada
    //                 $thumbnailPaths[] = $thumbnailPath;
    //             }
    //         }

    //         DB::commit(); // Confirma a transação se tudo estiver correto

    //         // Retorna as imagens e miniaturas salvas
    //         return [
    //             'success' => true,
    //             'savedImages' => $savedImages,
    //             'thumbnailPaths' => $thumbnailPaths
    //         ];
    //     } catch (\Exception $e) {
    //         DB::rollBack(); // Reverte a transação em caso de erro

    //         return [
    //             'success' => false,
    //             'error' => $e->getMessage(),
    //             'savedImages' => $savedImages ?? [],
    //             'thumbnailPaths' => $thumbnailPaths ?? []
    //         ];
    //     }
    // }










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