<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Intervention\Image\Laravel\Facades\Image;

class testeController extends Controller
{

    public function store(Request $request)
    {

        $image = $request->file('image');

        $imageName = time() . '.' . $image->extension();

        $destinationPathThumbnail = public_path('images/thumbnail');
        $img = Image::read($image->path());

        $widthOld = $img->width();
        $heightOld = $img->height();

        $widthThumbnail = 400;

        $heightThumbnail = ($widthThumbnail / $widthOld) * $heightOld;

        $img->resize($widthThumbnail, $heightThumbnail, function ($constraint) {
            $constraint->aspectRatio();
        })->save($destinationPathThumbnail . '/' . 'thumb_' . $imageName);

        $destinationPath = public_path('/images');
        $image->move($destinationPath, $imageName);

        return response()->json([
            'success' => 'Image Uploaded successfully!',
            'imageName' => [
                'images/' => 'images/' . $imageName,
                'thumbnail' => 'images/thumbnail/thumb_' . $imageName,
            ]
        ]);
    }
}