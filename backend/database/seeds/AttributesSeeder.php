<?php

# database/seeds/AttributesSeeder.php

use App\Models\Attribute;
use App\Models\ProfileAttribute;
use Illuminate\Database\Seeder;

class AttributesSeeder extends Seeder
{

    public function run()
    {

      Attribute::create([
        'organization_id' => 2,
        'group' => 'Idioma',
        'attribute'  => 'Español'
      ]);
      Attribute::create([
        'organization_id' => 2,
        'group' => 'Idioma',
        'attribute'  => 'Inglés'
      ]);
      Attribute::create([
        'organization_id' => 2,
        'group' => 'Idioma',
        'attribute'  => 'Francés'
      ]);
      Attribute::create([
        'organization_id' => 2,
        'group' => 'Idioma',
        'attribute'  => 'Portugués'
      ]);
      Attribute::create([
        'organization_id' => 2,
        'group' => 'Idioma',
        'attribute'  => 'Alemán'
      ]);

      Attribute::create([
        'organization_id' => 2,
        'group' => 'Experiencia',
        'attribute'  => 'En Restaurants'
      ]);
      Attribute::create([
        'organization_id' => 2,
        'group' => 'Experiencia',
        'attribute'  => 'Trabajo en Equipo'
      ]);
      Attribute::create([
        'organization_id' => 2,
        'group' => 'Experiencia',
        'attribute'  => 'Atendiendo Público'
      ]);
      Attribute::create([
        'organization_id' => 2,
        'group' => 'Experiencia',
        'attribute'  => 'En Hotelería'
      ]);
      Attribute::create([
        'organization_id' => 2,
        'group' => 'Disponibilidad',
        'attribute'  => 'Turnos'
      ]);
      Attribute::create([
        'organization_id' => 2,
        'group' => 'Disponibilidad',
        'attribute'  => 'Fines de Semana'
      ]);
      Attribute::create([
        'organization_id' => 2,
        'group' => 'Disponibilidad',
        'attribute'  => 'Feriados'
      ]);
      Attribute::create([
        'organization_id' => 2,
        'group' => 'Disponibilidad',
        'attribute'  => 'Noche'
      ]);

      Attribute::create([
        'organization_id' => 2,
        'group' => 'Apariencia',
        'attribute'  => 'Tatuajes'
      ]);
      Attribute::create([
        'organization_id' => 2,
        'group' => 'Apariencia',
        'attribute'  => 'Pelo Largo'
      ]);
      Attribute::create([
        'organization_id' => 2,
        'group' => 'Apariencia',
        'attribute'  => 'Pelo Teñido Color Llamativo'
      ]);
      Attribute::create([
        'organization_id' => 2,
        'group' => 'Apariencia',
        'attribute'  => 'Barba'
      ]);
      Attribute::create([
        'organization_id' => 2,
        'group' => 'Situación familiar',
        'attribute'  => 'Estudiante'
      ]);
      Attribute::create([
        'organization_id' => 2,
        'group' => 'Situación familiar',
        'attribute'  => 'Casado'
      ]);
      Attribute::create([
        'organization_id' => 2,
        'group' => 'Situación familiar',
        'attribute'  => 'Soltero'
      ]);
      Attribute::create([
        'organization_id' => 2,
        'group' => 'Situación familiar',
        'attribute'  => 'Hijos'
      ]);


    }
}
