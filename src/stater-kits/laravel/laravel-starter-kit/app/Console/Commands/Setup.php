<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class Setup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'setup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'A command to setup the project.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // 1. Setup Salla App Settings
        $client_id = $this->ask('APP Client ID');

        if (!empty($client_id)) {
            $this->writeNewEnvironmentFileWith($client_id, 'SALLA_OAUTH_CLIENT_ID');
        }

        $client_secret = $this->ask('APP Client Secret');
        if (!empty($client_secret)) {
            $this->writeNewEnvironmentFileWith($client_secret, 'SALLA_OAUTH_CLIENT_SECRET');
        }

        $auth_mode = $this->choice('Authorization Mode', [
            'easy' => 'The access token is generated automatically at Salla\'s side back to you via webhook event (App\Actions\App\StoreAuthorize.php)',
            'custom' => 'The access token is generated at current application via callback page (App/Http/Controllers/OAuthController.php)'
        ],'easy', 3);
        if (!empty($auth_mode)) {
            $this->writeNewEnvironmentFileWith($auth_mode, 'SALLA_AUTHORIZATION_MODE');
        }

        $webhook_secret = $this->ask('APP Webhook Secret');
        if (!empty($webhook_secret)) {
            $this->writeNewEnvironmentFileWith($webhook_secret, 'SALLA_WEBHOOK_SECRET');
        }

        $database_name = $this->ask('Database Name', 'laravel');
        if (!empty($database_name)) {
            $this->writeNewEnvironmentFileWith($database_name, 'DB_DATABASE');
        }

        $database_username = $this->ask('Database UserName', 'root');
        if (!empty($database_username)) {
            $this->writeNewEnvironmentFileWith($database_username, 'DB_USERNAME');
        }
        $database_password = $this->ask('Database Password', 'root');

        if (!empty($database_password)) {
            $this->writeNewEnvironmentFileWith($database_password, 'DB_PASSWORD');
        }

        $this->call('key:generate');
        $this->call('migrate');

        $this->info('You are ready 🎉 run `php artisan serve`');
    }

    /**
     * Write a new environment file with the given key.
     *
     * @param $value
     * @param  string  $key
     *
     * @return void
     */
    protected function writeNewEnvironmentFileWith($value, string $key = 'APP_KEY')
    {
        file_put_contents($this->laravel->environmentFilePath(), preg_replace(
            $this->keyReplacementPattern($key),
            $key.'='.$value,
            file_get_contents($this->laravel->environmentFilePath())
        ));
    }

    /**
     * Get a regex pattern that will match env APP_KEY with any random key.
     *
     * @return string
     */
    protected function keyReplacementPattern(string $key = 'APP_KEY')
    {
        return "/^{$key}=(.*)/m";
    }
}
