<?php

use App\Http\Controllers\Auth\LoginController as AuthLoginController;
use App\Http\Controllers\Auth\LogoutController as AuthLogoutController;
use App\Http\Controllers\Auth\MeController as AuthMeController;
use App\Http\Controllers\Auth\RegisterController as AuthRegisterController;
use App\Http\Controllers\Auth\RemoveAccountController as AuthRemoveAccountController;
use App\Http\Controllers\GenderController;
use App\Http\Controllers\HabitController;
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\SexualityController;
use App\Http\Controllers\SubGenderController;
use App\Models\SubGender;
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
    Route::delete('/remove-account', [AuthRemoveAccountController::class, 'removeAccount']);
    Route::get('/my-profile', [AuthMeController::class, 'me']);

    //get-all-genders
    Route::get('/get-all-genders', [GenderController::class ,'getAll']);
    
    //get-all-sexualities
    Route::get('/get-all-sexualities', [SexualityController::class ,'getAll']);
    
    //get-all-sub-genders
    Route::get('/get-all-sub-genders', [SubGenderController::class ,'getAll']);
    
    //get-all-habits
    Route::get('/get-all-habits', [HabitController::class ,'getAll']);

    //attribution genders and sexualities
    Route::post('/attribution-gender-sexuality', [AuthMeController::class, 'assingnedGenderAndSexuality']);

    //preferences
    Route::post('/preferences-habits', [AuthMeController::class, 'preferences']);
    
    //photos
    Route::post('/photos', [PhotoController::class, 'store']);
});