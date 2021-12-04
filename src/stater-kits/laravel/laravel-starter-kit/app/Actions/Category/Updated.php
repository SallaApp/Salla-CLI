<?php

namespace App\Actions\Category;

use App\Actions\BaseAction;

/**
 * @property string merchant example "1029864349"
 * @property string created_at example "Wed Jun 30 2021 12:16:25 GMT+030"
 * @property string event example "category.updated"
 * @property array data @see
 *     https://docs.salla.dev/docs/merchent/openapi.json/components/schemas/CategoryWebhookResponse
 */
class Updated extends BaseAction
{
    public function handle()
    {
        // you can do whatever you want
    }
}
