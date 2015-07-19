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
}
