<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class Profile extends Model
{
    public function attributes()
    {
      return $this->belongsToMany('App\Models\Attribute', 'profile_attributes')->withTimestamps();
    }

    public function jobs()
    {
      return $this->hasMany('App\Models\ProfileJob');
    }

    public function notes()
    {
      return $this->hasMany('App\Models\ProfileNote');
    }

    public function logs()
    {
      return $this->hasMany('App\Models\ProfileLog');
    }

    public function test()
    {
      return $this->hasOne('App\Models\ProfileTest');
    }

    public function organization()
    {
      return $this->belongsTo('App\Models\Organization');
    }

}
