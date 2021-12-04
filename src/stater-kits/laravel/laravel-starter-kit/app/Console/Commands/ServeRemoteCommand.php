<?php

namespace App\Console\Commands;

use App\Services\SallaAuthService;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Process\Process;

class ServeRemoteCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'serve.remote
                            {--port= : The port to share}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Share the application with ngrok';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(): int
    {
        if (!$this->verifyCommand('ngrok')) {
            $this->comment('Ngrok required to share your project publicly, you can install ngrok via');
            $this->comment('`npm install ngrok -g` or `yarn install ngrok -g`.');
            return 1;
        }

        $port = $this->option('port') ? : '8000';

        $command = ['ngrok', 'http', '--log', 'stdout'];
        $command[] = $port;


        $webhook_url = route('webhook', [], false);
        $callback_url = route('oauth.callback', [], false);

        $process = new Process($command, null, null, null, null);
        $process->setOptions(['create_new_console' => true]);
        $process->start();
        $process->waitUntil(function ($type, $data) use ($webhook_url, $callback_url, $process) {
//            if (preg_match('/msg="starting web service".*? addr=(?<addr>\S+)/', $data, $matches)) {
//                $this->line('<fg=green>Ngrok Web Interface: </fg=green>'.'http://'.$matches['addr']);
//            }

            if (preg_match('/msg="started tunnel".*? addr=(?<addr>\S+)/', $data, $matches)) {
                $this->line('<fg=green>Local App URL: </fg=green>'.$matches['addr']);
            }

            if (preg_match_all('/msg="started tunnel".*? url=(?<url>\S+)/m', $data, $matches)) {
                $this->newLine(1);
                $this->comment("Please go to \"Salla Partners Portal\" And copy the following \"Webhook Url\" \nto the Callback URL field in the \"App Details -> Webhooks/Notifications\" section:");
                $webhook_urls = collect($matches['url'])->filter(function ($url) {
                    return Str::startsWith($url, 'https');
                })->map(function ($url) use ($webhook_url) {
                    return $url.$webhook_url;
                })->implode(', ');
                $this->line('<fg=green>Webhook URL: </fg=green>'.$webhook_urls);
                $this->newLine(1);

                if (!app(SallaAuthService::class)->isEasyMode()) {

                    $this->newLine(1);
                    $this->comment("Please go to \"Salla Partners Portal\" and copy the following \"OAuth Callback URL\" \nto the Callback URL field in the \"App Details -> Applications Keys\" section:");
                    $callback_urls = collect($matches['url'])->filter(function ($url) {
                        return Str::startsWith($url, 'https');
                    })->map(function ($url) use ($callback_url) {
                        return $url.$callback_url;
                    })->implode(', ');
                    $this->line('<fg=green>OAuth Callback URL: </fg=green>'.$callback_urls);
                    $this->newLine(1);
                }


                $this->line('🎉 Now you can open your broswer to view your App at ');
                $this->line('<fg=green>Remote App URL: </fg=green>'.$matches['url'][1] ?? $matches['url'][0]);
                $this->comment('As always, happy hacking! 🙌');
            }


            if ($process::OUT === $type) {
                $this->line($data, null, 'vv');
            } else {
                $this->warn("Failed start ngrok :- ".$data);
            }

            return Str::contains($data, 'started tunnel');
        });

        $this->{$this->verbosity !== OutputInterface::VERBOSITY_NORMAL ? 'call' : 'callSilent'}('serve', [
            '--port' => $port
        ]);

        return 0;
    }

    protected function verifyCommand($command): bool
    {
        $windows = strncmp(PHP_OS, 'WIN', 3) === 0;
        $test = $windows ? 'where' : 'command -v';
        return is_executable(trim(shell_exec("$test $command")));
    }
}
