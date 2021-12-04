<?php

namespace App;

use App\Models\OauthToken;
use App\Models\User;
use Illuminate\Support\Traits\ForwardsCalls;
use League\OAuth2\Client\Provider\ResourceOwnerInterface;
use League\OAuth2\Client\Token\AccessToken;
use Salla\OAuth2\Client\Provider\Salla;
use Salla\OAuth2\Client\Provider\SallaUser;

/**
 * @mixin Salla
 */
class SallaAuthService
{
    use ForwardsCalls;

    /**
     * @var Salla
     */
    protected $provider;

    /**
     * @var OauthToken
     */
    public $token;

    public function __construct()
    {
        $this->provider = new Salla([
            'clientId'     => config('services.salla.client_id'), // The client ID assigned to you by Salla
            'clientSecret' => config('services.salla.client_secret'), // The client password assigned to you by Salla
            'redirectUri'  => $this->isEasyMode() ? null : route('oauth.callback'), // the url for current page in your service
        ]);
    }

    /**
     * Get the token from the user model.
     *
     * @param  User  $user
     *
     * @return $this
     */
    public function forUser(User $user)
    {
        $this->token = $user->token;

        return $this;
    }

    /**
     * @return Salla
     */
    public function getProvider(): Salla
    {
        return $this->provider;
    }

    /**
     * Get the details of store for the current token.
     *
     *  {
     *      "id": 181690847,
     *      "name": "eman elsbay",
     *      "email": "user@salla.sa",
     *      "mobile": "555454545",
     *      "role": "user",
     *      "created_at": "2018-04-28 17:46:25",
     *      "store": {
     *        "id": 633170215,
     *        "owner_id": 181690847,
     *        "owner_name": "eman elsbay",
     *        "username": "good-store",
     *        "name": "متجر الموضة",
     *        "avatar": "https://cdn.salla.sa/XrXj/g2aYPGNvafLy0TUxWiFn7OqPkKCJFkJQz4Pw8WsS.jpeg",
     *        "store_location": "26.989000873354787,49.62477639657287",
     *        "plan": "special",
     *        "status": "active",
     *        "created_at": "2019-04-28 17:46:25"
     *      }
     *    }
     * @return \League\OAuth2\Client\Provider\ResourceOwnerInterface|SallaUser
     */
    public function getStoreDetail()
    {
        return $this->provider->getResourceOwner(new AccessToken($this->token->toArray()));
    }

    /**
     * Get A new access token via refresh token.
     *
     * @return \League\OAuth2\Client\Token\AccessToken|\League\OAuth2\Client\Token\AccessTokenInterface
     * @throws \League\OAuth2\Client\Provider\Exception\IdentityProviderException
     */
    public function getNewAccessToken()
    {
        if ($this->token->hasExpired()) {
            return new AccessToken($this->token->toArray());
        }

        // let's request a new access token via refresh token.
        $token = $this->provider->getAccessToken('refresh_token', [
            'refresh_token' => $this->token->refresh_token
        ]);

        // lets update user tokens
        $this->token->update([
            'access_token'  => $token->getToken(),
            'expires_in'    => $token->getExpires(),
            'refresh_token' => $token->getRefreshToken()
        ]);

        return $token;
    }

    public function request(string $method, string $url, array $options = [])
    {
        // you need always to check the token before made a request
        // If the token expired, lets request a new one and save it to the database
        $this->getNewAccessToken();

        return $this->provider->fetchResource($method, $url, $this->token->access_token, $options);
    }

    /**
     * As shortcut to call the functions of provider class.
     *
     *
     * @param $name
     * @param $arguments
     *
     * @return mixed
     */
    public function __call($name, $arguments)
    {
        return $this->forwardCallTo($this->provider, $name, $arguments);
    }

    /**
     * Determine if the authorization mode is easy
     *
     * @return bool
     */
    public function isEasyMode(): bool
    {
        return config('services.salla.authorization_mode') === 'easy';
    }

    /**
     * Requests and returns the resource owner of given access token.
     *
     * @param  AccessToken $token
     * @return ResourceOwnerInterface
     */
    public function getResourceOwner(?AccessToken $token)
    {
        return $this->provider->getResourceOwner($token ?: new AccessToken($this->token->toArray()));
    }
}
