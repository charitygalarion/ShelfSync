<?php
// database/seeders/DatabaseSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Book;
use App\Models\Announcement;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User (only if doesn't exist)
        User::firstOrCreate(
            ['email' => 'admin@library.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'active'
            ]
        );

        // Create Regular Users (only if don't exist)
        User::firstOrCreate(
            ['email' => 'john@example.com'],
            [
                'name' => 'John Doe',
                'password' => Hash::make('password'),
                'role' => 'user',
                'status' => 'active'
            ]
        );

        User::firstOrCreate(
            ['email' => 'jane@example.com'],
            [
                'name' => 'Jane Smith',
                'password' => Hash::make('password'),
                'role' => 'user',
                'status' => 'active'
            ]
        );

        // Create Sample Books (only if don't exist)
        Book::firstOrCreate(
            ['isbn' => '978-0486404529'],
            [
                'title' => 'Calculus Made Easy',
                'author' => 'Silvanus Thompson',
                'subject' => 'math',
                'description' => 'A comprehensive guide to calculus concepts with practical examples and exercises.',
                'total_copies' => 5,
                'available_copies' => 5,
                'status' => 'available',
                'cover' => '📘',
                'is_new' => true
            ]
        );

        Book::firstOrCreate(
            ['isbn' => '978-1440582786'],
            [
                'title' => 'Psychology 101',
                'author' => 'Paul Kleinman',
                'subject' => 'psychology',
                'description' => 'Introduction to psychology covering major theories and concepts.',
                'total_copies' => 3,
                'available_copies' => 3,
                'status' => 'available',
                'cover' => '📙',
                'is_new' => true
            ]
        );

        Book::firstOrCreate(
            ['isbn' => '978-0743477109'],
            [
                'title' => 'English Literature',
                'author' => 'William Shakespeare',
                'subject' => 'literature',
                'description' => 'Classic English literature works and analysis.',
                'total_copies' => 4,
                'available_copies' => 4,
                'status' => 'available',
                'cover' => '📓',
                'is_new' => false
            ]
        );

        Book::firstOrCreate(
            ['isbn' => '978-0123456789'],
            [
                'title' => 'Advanced Mathematics',
                'author' => 'John Peterson',
                'subject' => 'math',
                'description' => 'Advanced mathematical theories and applications for university students.',
                'total_copies' => 2,
                'available_copies' => 2,
                'status' => 'available',
                'cover' => '📗',
                'is_new' => false
            ]
        );

        Book::firstOrCreate(
            ['isbn' => '978-0987654321'],
            [
                'title' => 'Cognitive Psychology',
                'author' => 'Robert Sternberg',
                'subject' => 'psychology',
                'description' => 'In-depth study of cognitive processes and mental functions.',
                'total_copies' => 3,
                'available_copies' => 3,
                'status' => 'available',
                'cover' => '📕',
                'is_new' => true
            ]
        );

        // Create Sample Announcements
        $announcements = [
            [
                'title' => 'Library Holiday Schedule',
                'content' => 'The library will be closed on January 26th for Republic Day.',
                'date' => now()->subDays(5),
                'status' => 'active'
            ],
            [
                'title' => 'New Book Arrivals',
                'content' => 'Check out our new collection of science fiction and fantasy books!',
                'date' => now()->subDays(2),
                'status' => 'active'
            ],
            [
                'title' => 'Extended Hours',
                'content' => 'Library hours extended until 8 PM on weekdays starting next month.',
                'date' => now()->subDays(1),
                'status' => 'active'
            ]
        ];

        foreach ($announcements as $announcement) {
            Announcement::firstOrCreate(
                ['title' => $announcement['title']],
                $announcement
            );
        }
    }
}