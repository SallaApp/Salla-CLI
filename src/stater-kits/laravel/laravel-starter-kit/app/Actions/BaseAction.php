<?php

namespace App\Actions;

use App\Http\Requests\WebhookRequest;
use Lorisleiva\Actions\Concerns\AsAction;

abstract class BaseAction
{
    use AsAction;

    /**
     * @var WebhookRequest
     */
    protected $request;

    public function setRequest(WebhookRequest $request)
    {
        $this->request = $request;

        return $this;
    }

    public function __get($name)
    {
        return $this->request->get($name);
    }
}
