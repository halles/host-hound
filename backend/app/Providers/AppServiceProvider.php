<?php namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\ProfileTest;

class AppServiceProvider extends ServiceProvider
{


    public function boot()
    {
        ProfileTest::saving(function ($test) {
          $test->populateTest();
          return true;
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
