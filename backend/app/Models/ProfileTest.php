<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class ProfileTest extends Model
{

  public function profile()
  {
    return $this->belongsTo('App\Models\Profile');
  }

}
