<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->integer('firebase_uid')->unique()->nullable();
            $table->string('name', 64)->nullable();
            $table->string('surname', 64)->nullable();
            $table->string('email', 128)->nullable();
            $table->string('institution_code', 6)->nullable();
            $table->string('institution_place_id', 256)->nullable();
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
        Schema::dropIfExists('users');
    }
}
