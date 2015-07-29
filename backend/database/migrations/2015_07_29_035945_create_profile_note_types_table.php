<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProfileNoteTypesTable extends Migration {

  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('profile_note_types', function(Blueprint $table)
    {
      $table->increments('id');
      $table->integer('organization_id');
      $table->string('name');
      $table->integer('score');
      $table->string('color');
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
    Schema::drop('profile_note_types');
  }

}
