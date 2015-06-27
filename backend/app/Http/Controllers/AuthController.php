<?php namespace App\Http\Controllers;

use JWT;
use Hash;
use Config;
use Validator;
use Illuminate\Http\Request;
use GuzzleHttp;
use GuzzleHttp\Subscriber\Oauth\Oauth1;
use App\Models\User;

class AuthController extends Controller {

    /**
     * Generate JSON Web Token.
     */
    protected function createToken($user)
    {
        $payload = [
            'sub' => $user->id,
            'iat' => time(),
            'exp' => time() + (2 * 7 * 24 * 60 * 60)
        ];
        return JWT::encode($payload, $_ENV['APP_KEY']);
    }

    /**
     * Log in with Email and Password.
     */
    public function login(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');

        $user = User::where('email', '=', $email)->first();

        if (!$user)
        {
            return response()->json(['message' => 'Wrong email and/or password'], 401);
        }

        if (Hash::check($password, $user->password))
        {
            unset($user->password);

            return response()->json(['token' => $this->createToken($user)]);
        }
        else
        {
            return response()->json(['message' => 'Wrong email and/or password'], 401);
        }
    }

}
