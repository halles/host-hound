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
        $table->integer('organization_id');
        $table->boolean('is_employee');
        $table->string('name');
        $table->string('sex')->nullable()->default(null);
        $table->string('phone')->nullable()->default(null);
        $table->string('id_num')->nullable();
        $table->string('id_type')->default('rut');
        $table->string('email')->nullable()->default(null);
        $table->string('cv')->nullable()->default(null);
        $table->string('profile_test_id')->nullable()->default(null);
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
