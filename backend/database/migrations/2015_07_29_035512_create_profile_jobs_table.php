<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProfileJobsTable extends Migration {

  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('profile_jobs', function(Blueprint $table)
    {
      $table->increments('id');
      $table->integer('profile_id');
      $table->string('employer');
      $table->string('position');
      $table->text('description');
      $table->string('reference_name');
      $table->string('reference_phone');
      $table->string('reference_email');
      $table->date('start');
      $table->date('end')->nullable();
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
    Schema::drop('profile_jobs');
  }

}
