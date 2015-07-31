<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class Organization extends Model
{
    /**
    * The users that belong to an organization
    */
    public function users()
    {
        return $this->belongsToMany('App\User','user_organizations')->withTimestamps();
    }

    public function profiles()
    {
      return $this->hasMany('App\Profile');
    }
}
