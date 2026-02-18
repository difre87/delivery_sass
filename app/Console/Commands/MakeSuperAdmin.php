<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class MakeSuperAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:make-super-admin {email : The email of the user}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Promote a user to super admin';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = $this->argument('email');

        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("User with email '{$email}' not found.");
            return self::FAILURE;
        }

        if ($user->is_super_admin) {
            $this->info("User '{$user->name}' is already a super admin.");
            return self::SUCCESS;
        }

        $user->update(['is_super_admin' => true]);

        $this->info("User '{$user->name}' has been promoted to super admin successfully!");

        return self::SUCCESS;
    }
}
