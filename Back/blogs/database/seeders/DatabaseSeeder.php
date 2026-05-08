<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Note;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $user = User::create([
            'name' => 'Senda Salhi',
            'email' => 'senda@example.com',
            'password' => Hash::make('password123'),
        ]);

        Note::factory(5)->create([
            'user_id' => $user->id
        ]);
    }
}