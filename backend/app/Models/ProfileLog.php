<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class ProfileLog extends Model
{

  public function profile()
  {
    return $this->belongsTo('App\Models\Profile');
  }

}
