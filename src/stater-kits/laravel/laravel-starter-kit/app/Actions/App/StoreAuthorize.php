<?php

namespace App\Actions\App;

use App\Actions\BaseAction;
use App\Models\User;
use App\Services\SallaAuthService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use League\OAuth2\Client\Token\AccessToken;

/**
 * @property string merchant example "1234509876"
 * @property string created_at example "2021-10-07 12:31:25"
 * @property string event example "app.store.authorize"
 * @property array data @see https://docs.salla.dev/docs/merchent/ZG9jOjIzMjE3MjQ0-app-events#app-store-authorize
 */
class StoreAuthorize extends BaseAction
{
    public function handle()
    {
        /** @var SallaAuthService $service */
        $service = app('salla.auth');

        if (!$service->isEasyMode()) {
            return;
        }

        /*
         * Lets get the store details using the access token in the event
         */
        $storeDetails = $service->getResourceOwner(new AccessToken($this->data));

        /**
         * We can now create a user base in the details
         */
        $user = User::query()->firstOrCreate([
            'email' => $storeDetails->getEmail(),
        ], [
            'name'     => $storeDetails->getStoreOwnerName(),
            'password' => Hash::make(Str::random())
        ]);

        /**
         * Lets save the tokens for used it later.
         */
        $user->token()->create([
            'merchant'      => $storeDetails->getStoreId(),
            'access_token'  => $this->data['access_token'],
            'expires_in'    => $this->data['expires'],
            'refresh_token' => $this->data['refresh_token']
        ]);

        // You can also save the store details from $storeDetails object
        // Also you can here call any api using the access token to prepare the service for the merchant.
    }
}
