<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class Organization extends Model
{
    /**
    * The organizations that the user belongs to.
    */
    public function users()
    {
        return $this->belongsToMany('App\User','user_organizations')->withTimestamps();
    }
}
