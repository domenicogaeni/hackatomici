<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    public const BASIC_FIELDS = ['id', 'name', 'surname', 'email', 'institution_place_id'];

    public function getBasicInfo()
    {
        $response = [];
        foreach (self::BASIC_FIELDS as $value) {
            $response[$value] = $this->{$value};
        }
        return $response;
    }

    public function ownedPlaces()
    {
        return $this->hasMany(OwnedPlace::class);
    }

    public function favouritePlaces()
    {
        return $this->hasMany(FavouritePlace::class);
    }

    public function trips()
    {
        return $this->hasMany(Trip::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    public function votes()
    {
        return $this->hasMany(UserVote::class);
    }
}
