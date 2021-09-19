<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsSubscriptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notifications_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->string('place_id', 256);
            $table->integer('favourite_place_id')->nullable();
            $table->integer('trip_point_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notifications_subscriptions');
    }
}
