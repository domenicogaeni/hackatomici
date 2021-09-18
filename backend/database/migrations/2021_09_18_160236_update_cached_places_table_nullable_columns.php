<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateCachedPlacesTableNullableColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cached_places', function (Blueprint $table) {
            $table->string('locality', 128)->nullable()->change();
            $table->string('administrative_area_level_2', 128)->nullable()->change();
            $table->string('administrative_area_level_1', 128)->nullable()->change();
            $table->string('country', 128)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cached_places', function (Blueprint $table) {
            $table->string('locality', 128)->change();
            $table->string('administrative_area_level_2', 128)->change();
            $table->string('administrative_area_level_1', 128)->change();
            $table->string('country', 128)->change();
        });
    }
}
