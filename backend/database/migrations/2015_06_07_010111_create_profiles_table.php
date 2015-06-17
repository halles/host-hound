<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProfilesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('profiles', function($table){
        $table->increments('id');
        $table->string('name');
        $table->string('sex');
        $table->string('phone');
        $table->string('id_num');
        $table->string('email');
        $table->string('latest_profile_test_id');
        $table->softDeletes();
        $table->timestamps();
    });

	}

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::drop('profiles');
  }

}
