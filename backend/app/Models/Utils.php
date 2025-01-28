<?php

namespace App\Models;

use Carbon\Carbon;

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
}