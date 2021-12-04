<?php

namespace App\Console\Commands;

use Illuminate\Console\GeneratorCommand;
use Illuminate\Support\Str;

class MakeActionCommand extends GeneratorCommand
{
    protected $name = 'make:webhook.event';

    protected $description = 'Create a new Action to handling Salla webhook event';

    protected $type = 'Action';
    /**
     * @var string
     */
    protected $component;
    /**
     * @var string
     */
    protected $event;

    protected function getStub()
    {
        return app_path('Console/Commands/stubs/action.stub');
    }

    protected function getDefaultNamespace($rootNamespace)
    {
        return $rootNamespace.'\Actions\\'.$this->component;
    }

    /**
     * Replace the namespace for the given stub.
     *
     * @param  string  $stub
     * @param  string  $name
     *
     * @return $this
     */
    protected function replaceCustomVars(&$stub, $name)
    {
        $stub = str_replace(
            ['{{ event }}'],
            [$this->event],
            $stub
        );

        return $this;
    }

    /**
     * Build the class with the given name.
     *
     * @param  string  $name
     *
     * @return string
     *
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    protected function buildClass($name)
    {
        $stub = $this->files->get($this->getStub());

        return $this->replaceNamespace($stub, $name)
            ->replaceCustomVars($stub, $name)
            ->replaceClass($stub, $name);
    }

    public function handle()
    {
        $event = explode('.', $this->getNameInput());
        $component = $event[0];
        $action = Str::camel(Str::replace('.', '_', Str::after($this->getNameInput(), $component.'.')));

        $this->event = $this->getNameInput();
        $this->component = ucfirst($component);
        $this->input->setArgument('name', ucfirst($action));

        return parent::handle();
    }
}
