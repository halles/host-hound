<?php

# database/seeds/UserDataSeeder.php

use App\Models\User;
use App\Models\Organization;
use App\Models\UserOrganization;
use App\Models\Department;
use App\Models\UserDepartment;
use Illuminate\Database\Seeder;

class UsersDataSeeder extends Seeder
{

    public function run()
    {

      $organizations = array(
        Organization::create([
          'name' => 'Fake Organization',
          'domain' => 'fake'
        ]),
        Organization::create([
          'name' => 'Noi Hotels',
          'domain' => 'noihotels'
        ]),
        Organization::create([
          'name' => 'Radisson Hotels',
          'domain' => 'radisson'
        ])
      );

      $organizations[0]->departments = array(
        Department::create([
          'name' => 'San Francisco',
          'organization_id' => $organizations[0]->id
        ])
      );

      $organizations[1]->departments = array(
        Department::create([
          'name' => 'Santiago',
          'organization_id' => $organizations[1]->id
        ]),
        Department::create([
          'name' => 'Isla De Pascua',
          'organization_id' => $organizations[1]->id
        ]),
      );

      $users[] = User::create([
        'name' => 'Matías Halles',
        'email' => 'matias.halles@gmail.com',
        'password' => Hash::make('123456')
      ]);

      $users[] = User::create([
        'name' => 'Sofía González',
        'email' => 'sofita.1@gmail.com',
        'password' => Hash::make('123456')
      ]);

      UserOrganization::create([
        'user_id' => $users[0]->id,
        'organization_id' => $organizations[0]->id
      ]);

      UserOrganization::create([
        'user_id' => $users[0]->id,
        'organization_id' => $organizations[1]->id
      ]);

      UserOrganization::create([
        'user_id' => $users[1]->id,
        'organization_id' => $organizations[1]->id
      ]);

      UserDepartment::create([
        'user_id' => $users[0]->id,
        'department_id' => $organizations[0]->departments[0]->id
      ]);

      UserDepartment::create([
        'user_id' => $users[0]->id,
        'department_id' => $organizations[1]->departments[0]->id
      ]);

      UserDepartment::create([
        'user_id' => $users[0]->id,
        'department_id' => $organizations[1]->departments[1]->id
      ]);

      UserDepartment::create([
        'user_id' => $users[1]->id,
        'department_id' => $organizations[1]->departments[1]->id
      ]);

      UserDepartment::create([
        'user_id' => $users[1]->id,
        'department_id' => $organizations[1]->departments[0]->id
      ]);


    }
}
