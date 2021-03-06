<?php

namespace App\Models;

class User extends BaseModel
{
    public const BASIC_FIELDS = [
        'id',
        'name',
        'surname',
        'email',
        'institution_place_id'
    ];

    protected $fillable = [
        'name',
        'surname',
        'email'
    ];

    public function getBasicInfo()
    {
        $response = [];
        foreach (self::BASIC_FIELDS as $value) {
            $response[$value] = $this->{$value};
        }
        return $response;
    }

    /** Relationships */
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
