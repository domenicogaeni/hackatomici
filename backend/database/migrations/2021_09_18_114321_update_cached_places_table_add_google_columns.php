<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateCachedPlacesTableAddGoogleColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cached_places', function (Blueprint $table) {
            $table->string('locality', 128);
            $table->string('administrative_area_level_2', 128);
            $table->string('administrative_area_level_1', 128);
            $table->string('country', 128);
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
            $table->dropColumn(['locality', 'administrative_area_level_2', 'administrative_area_level_1', 'country']);
        });
    }
}
