<?php

namespace App\Models;

class CachedPlace extends BaseModel
{
    protected $primaryKey = 'place_id';
    public $timestamps = false;
    public $incrementing = false;
}
