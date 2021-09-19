<?php

namespace App\Models;

class CachedPlace extends BaseModel
{
    protected $primaryKey = 'place_id';
    public $timestamps = false;
    public $incrementing = false;

    public const POINT_OF_INTEREST = 'point_of_interest';
    public const LOCALITY = 'locality';
    public const ADMINISTRATIVE_AREA_LEVEL_2 = 'administrative_area_level_2';
    public const ADMINISTRATIVE_AREA_LEVEL_1 = 'administrative_area_level_1';
    public const COUNTRY = 'country';
}
