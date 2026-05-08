<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NoteFactory extends Factory
{
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->sentence(4),
            'content' => $this->faker->paragraph(),
            'priority' => $this->faker->randomElement(['basse', 'moyenne', 'haute']),
        ];
    }
}