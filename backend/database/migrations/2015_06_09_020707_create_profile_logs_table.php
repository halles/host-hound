<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProfileLogsTable extends Migration {

  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('profile_logs', function($table){
        $table->increments('id');
        $table->integer('profile_id');
        $table->integer('user_id');
        $table->string('log_type');
        $table->text('value');
        $table->json('data');
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
    Schema::drop('profile_logs');
  }

}
