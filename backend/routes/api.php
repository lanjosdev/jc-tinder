<?php

use App\Http\Controllers\Auth\LoginController as AuthLoginController;
use App\Http\Controllers\Auth\LogoutController as AuthLogoutController;
use App\Http\Controllers\Auth\MeController as AuthMeController;
use App\Http\Controllers\Auth\RegisterController as AuthRegisterController;
use App\Http\Controllers\Auth\RemoveAccountController as AuthRemoveAccountController;
use App\Http\Controllers\GenderController;
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
    Route::post('/remove-account', [AuthRemoveAccountController::class, 'removeAccount']);
    Route::get('/my-profile', [AuthMeController::class, 'me']);

    //genders
    Route::get('/get-all-genders', [GenderController::class. 'getAll']);
});