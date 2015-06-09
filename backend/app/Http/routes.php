<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

use App\Models\Profile;

$app->get('/', function() use ($app) {
    return $app->welcome();
});

$app->get('/group/{id}/profiles', function($id) use ($app){
  $profiles = Profile::all();
  $response = array(
    'status' => 'ok',
    'profiles' => Profile::all(),
  );
  return response()->json($response);
});
