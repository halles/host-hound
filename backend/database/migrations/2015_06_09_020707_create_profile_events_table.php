<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProfileEventsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('profile_events', function($table){
        $table->increments('id');
        $table->integer('profile_id');
        $table->integer('user_id');
        $table->string('value');
        $table->string('event_type');
        $table->string('data');
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
		Schema::drop('profile_events');
	}

}
