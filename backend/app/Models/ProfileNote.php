<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class ProfileNote extends Model
{

  public function profile()
  {
    return $this->belongsTo('App\Models\Profile');
  }

  public function type()
  {
    return $this->belongsTo('App\Models\ProfileNoteType');
  }

}
