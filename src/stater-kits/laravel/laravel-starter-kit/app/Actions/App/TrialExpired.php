<?php

namespace App\Actions\App;

use App\Actions\BaseAction;

/**
 * @property string merchant example "1234509876"
 * @property string created_at example "Wed Jun 30 2021 14:32:33 GMT+0300"
 * @property string event example "app.trial.expired"
 * @property array data @see https://docs.salla.dev/docs/merchent/ZG9jOjIzMjE3MjQ0-app-events#app-trial-expire
 */
class TrialExpired extends BaseAction
{
    public function handle()
    {
        // you can do whatever you want
    }
}
