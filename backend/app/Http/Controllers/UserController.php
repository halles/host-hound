<?php namespace App\Http\Controllers;

use App\User;

use Illuminate\Http\Request;
use Auth;
use App;

use App\Http\Controllers\Controller;

use App\Models\Profile;

class UserController extends Controller {

  public function login(Request $request) {

    if (Auth::attempt($request->only('email', 'password'))) {
      //return response()->json($response);
      App::abort(200, 'OK');
    }else{
      App::abort(403, 'Access denied');
    }

  }

  public function logout(){

    Auth::logout();
    return response()->json(array('status' => 'OK'));

  }

  public function profile(){

  }

  public function emails(){

  }

  public function accounts(){

  }

  public function password(){

  }

  public function passwordRecover(){

  }

  public function passwordNew(){

  }

  public function passwordTokenCheck($token){

  }



}
