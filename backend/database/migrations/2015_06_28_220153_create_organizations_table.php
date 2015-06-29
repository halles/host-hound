<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrganizationsTable extends Migration {

  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {

    Schema::create('organizations', function(Blueprint $table)
    {
      $table->increments('id');
      $table->string('name');
      $table->string('domain');
      $table->softDeletes();
      $table->timestamps();
    });

    Schema::create('user_organizations', function(Blueprint $table)
    {
      $table->increments('id');
      $table->integer('user_id');
      $table->integer('organization_id');
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
    Schema::drop('user_organizations');
    Schema::drop('organizations');
  }

}
