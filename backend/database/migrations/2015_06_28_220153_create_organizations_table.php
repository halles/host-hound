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

    Schema::table('users', function($table)
    {
      $table->integer('organization_id')->after('remember_token');
    });

  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::table('users', function($table)
    {
      $table->dropColumn('organization_id');
    });
    Schema::drop('organizations');
  }

}
