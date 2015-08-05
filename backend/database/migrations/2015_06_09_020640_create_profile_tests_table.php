<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProfileTestsTable extends Migration {

  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('profile_tests', function($table){
        $table->increments('id');
        $table->integer('profile_id');
        $table->string('code');
        $table->string('style');
        $table->string('patterns');
        $table->string('score_e');
        $table->string('score_c');
        $table->string('score_i');
        $table->string('score_a');
        $table->json('answers');
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
    Schema::drop('profile_tests');
  }

}
