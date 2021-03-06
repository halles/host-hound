<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class Department extends Model
{
    /**
    * The users that have access to a department
    */
    public function users()
    {
        return $this->belongsToMany('App\User','user_departments')->withTimestamps();
    }

    public function opportunities()
    {
      return $this->hasMany('App\Models\Opportunity');
    }

    public function organization()
    {
        return $this->belongsTo('App\Models\Organization');
    }

}
