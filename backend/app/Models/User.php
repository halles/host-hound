<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class User extends Model
{
    /**
    * The organizations that the user belongs to.
    */
    public function organizations()
    {
        return $this->belongsToMany('App\Models\Organization','user_organizations')->withTimestamps();
    }

    /**
    * The departments that the user has access to.
    */
    public function departments()
    {
        return $this->belongsToMany('App\Models\Department','user_departments')->withTimestamps();
    }
}
