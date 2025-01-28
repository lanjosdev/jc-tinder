<?php

namespace App\Http\Controllers;

use App\Models\Gender;
use Illuminate\Http\Request;

class GenderController extends Controller
{
    protected $gender;
    
    public function __construct(Gender $gender)
    {
        $this->gender = $gender;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return 'aqui';
    }

}