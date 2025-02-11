<?php

use App\Http\Controllers\Auth\LoginController as AuthLoginController;
use App\Http\Controllers\Auth\LogoutController as AuthLogoutController;
use App\Http\Controllers\Auth\MeController as AuthMeController;
use App\Http\Controllers\Auth\RegisterController as AuthRegisterController;
use App\Http\Controllers\Auth\RemoveAccountController as AuthRemoveAccountController;
use App\Http\Controllers\GenderController;
use App\Http\Controllers\HabitController;
use App\Http\Controllers\MatcheController;
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\SexualityController;
use App\Http\Controllers\SubGenderController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/register', [AuthRegisterController::class, 'register']);
Route::post('/login', [AuthLoginController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
   

    
    //logout
    Route::post('/logout', [AuthLogoutController::class, 'logout']);


    
    //remove-account
    Route::delete('/remove-account', [AuthRemoveAccountController::class, 'removeAccount']);



    //my-profile
    Route::get('/my-profile', [AuthMeController::class, 'me']);
    //update-password
    Route::post('/update-password', [AuthMeController::class, 'updatePassword']);
    //update-info-user
    Route::post('/update-info-user', [AuthMeController::class, 'updateUser']);
    //attribution genders and sexualities
    Route::post('/attribution-gender-sexuality', [AuthMeController::class, 'assingnedGenderAndSexuality']);
    //preferences
    Route::post('/preferences-habits', [AuthMeController::class, 'preferences']);
    //update-preferences
    Route::post('/update-preferences', [AuthMeController::class, 'updatePreferences']);



    //get-all-genders
    Route::get('/get-all-genders', [GenderController::class, 'getAll']);

    //get-all-sexualities
    Route::get('/get-all-sexualities', [SexualityController::class, 'getAll']);

    //get-all-sub-genders
    Route::get('/get-all-sub-genders', [SubGenderController::class, 'getAll']);

    //get-all-habits
    Route::get('/get-all-habits', [HabitController::class, 'getAll']);



    //photos
    Route::post('/photos', [PhotoController::class, 'store']);
    //deleted photo
    Route::delete('/photo-delete/{id}', [PhotoController::class, 'delete']);
    //update photo
    Route::post('/photo-update/{id}', [PhotoController::class, 'update']);



    //get-all-users
    Route::get('/get-all-users', [UserController::class, 'getAll']);
    
    //get-user-especific
    Route::get('/get-user/{id}', [UserController::class, 'getUserId']);



    //match
    Route::post('/match', [MatcheController::class, 'matche']);
    Route::get('/get-all-match', [MatcheController::class, 'getAllMatches']);
});