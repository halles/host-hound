<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDepartmentsTable extends Migration {

  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {

    Schema::create('departments', function(Blueprint $table)
    {
      $table->increments('id');
      $table->integer('organization_id');
      $table->string('name');
      $table->softDeletes();
      $table->timestamps();
    });

    Schema::create('user_departments', function(Blueprint $table)
    {
      $table->increments('id');
      $table->integer('user_id');
      $table->integer('department_id');
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
    Schema::drop('user_departments');
    Schema::drop('departments');
  }

}
