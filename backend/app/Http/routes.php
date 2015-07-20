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

use App\Models\User;
use App\Models\Organization;
use App\Models\Department;
use App\Models\UserDepartment;
use App\Models\UserOrganization;

$app->get('/', function() use ($app) {
    return $app->welcome();
});

$app->get('/group/{id}/profiles', function($id) use ($app){
  $profiles = DB::table('profiles')->get();
  $response = array(
    'status' => 'ok',
    'profiles' => $profiles,
  );
  return response()->json($response);
});

$app->get('/organizations', [
  'middleware' => 'auth',
  function() use ($app){
    $data = User::where('id', $app->request["user"]["sub"])->with('organizations')->first();
    $response = array(
      'organizations' => $data->organizations
    );
    return response()->json($response);
  }
]);

$app->get('/organizations/{id}/departments', [
  'middleware' => 'auth',
  function($org_id) use ($app){

    $data = User::where('id', $app->request["user"]["sub"])
      ->with(['departments' => function ($query) use ($org_id){
        $query->where('organization_id', $org_id);
      }])->first();

    $response = array(
      'departments' => $data->departments
    );
    return response()->json($response);
  }
]);

/** User Auth & Controller Routes **/

$app->post('/login', [
  'as' => 'userLogin',
  'uses' => 'App\Http\Controllers\AuthController@login'
]);

$app->get('/logout', [
  'as' => 'userLogout',
  'middleware' => 'auth',
  'uses' => 'App\Http\Controllers\AuthController@logout'
]);

$app->get('/me', [
  'as' => 'me',
  'middleware' => 'auth',
  'uses' => 'App\Http\Controllers\UserController@profile'
]);

$app->get('/me/emails', [
  'as' => 'meMails',
  'middleware' => 'auth',
  'uses' => 'App\Http\Controllers\UserController@emails'
]);

$app->get('/me/accounts', [
  'as' => 'meAccounts',
  'middleware' => 'auth',
  'uses' => 'App\Http\Controllers\UserController@accounts'
]);

$app->get('/me/password', [
  'as' => 'mePassword',
  'middleware' => 'auth',
  'uses' => 'App\Http\Controllers\UserController@password'
]);

$app->get('/me/password/recover', [
  'as' => 'mePasswordRecover',
  'middleware' => 'auth',
  'uses' => 'App\Http\Controllers\UserController@passwordRecover'
]);

$app->get('/me/password/new',  [
  'as' => 'userLogin',
  'middleware' => 'auth',
  'uses' => 'App\Http\Controllers\UserController@passwordNew'
]);

$app->get('/me/password/{token}', [
  'as' => 'mePasswordTokenCheck',
  'middleware' => 'auth',
  'uses' => 'App\Http\Controllers\UserController@passwordTokenCheck'
]);
