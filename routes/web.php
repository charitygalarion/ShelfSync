<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('react');
});

Route::get('/{any}', function (){
     return view('react');
})->where('any', '.*');
   

