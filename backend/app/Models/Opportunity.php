<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class Opportunity extends Model
{

    protected $casts = [
      'parameters' => 'array'
    ];

    public function department()
    {
        return $this->belongsTo('App\Department');
    }

}
