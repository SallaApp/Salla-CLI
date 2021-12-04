<div id="top"></div>

<br />
<div align="center"> 
  <a href="https://salla.dev"> 
    <img src="https://salla.dev/wp-content/themes/salla-portal/dist/img/salla-logo.svg" alt="Logo" width="80" height="80"> 
  </a>
  <h1 align="center">Salla Apps Starter Kit</h1>
  <p align="center">
    An awesome starter template to create your Salla Apps today!
    <br />
    <a href="https://salla.dev/"><strong>Explore our blogs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/SallaApp/Laravel-Start-Kit/issues/new">Report Bug</a> · 
    <a href="https://github.com/SallaApp/Laravel-Start-Kit/discussions/new">Request Feature</a> . <a href="https://t.me/salladev">&lt;/Salla Developers&gt;</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details open>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#overview">Overview</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li>
        <a href="#configure-authorization-modes-">Configure Authorization Modes</a>
        <ul>
            <li><a href="#easy-mode-">Easy Mode</a></li>
            <li><a href="#custom-mode-">Custom Mode</a></li>
        </ul>
    </li>
    <li>
        <a href="#authorization-service">Authorization Service</a>
        <ul>
            <li><a href="#refreshing-a-token">Refreshing a Token</a></li>
        </ul>
    </li>
    <li>
        <a href="#webhooks">Webhooks</a>
        <ul>
            <li><a href="#order-related-webhooksactions">Order Related Webhooks/Actions</a></li>
            <li><a href="#products-related-webhooksactions">Products Related Webhooks/Actions</a></li>
            <li><a href="#customer-related-webhooksactions">Customer Related Webhooks/Actions</a></li>
            <li><a href="#category-related-webhooksactions">Category Related Webhooks/Actions</a></li>
            <li><a href="#brand-related-webhooksactions">Brand Related Webhooks/Actions</a></li>
            <li><a href="#store-related-webhooksactions">Store Related Webhooks/Actions</a></li>
            <li><a href="#coupon-related-webhooksactions">Coupon Related Webhooks/Actions</a></li>
      </ul>
    </li>
    <li>
        <a href="#commands">Commands</a>
        <ul>
            <li><a href="#setup-command">Setup command</a></li>
            <li><a href="#create-new-webhookaction-command">Create new Webhook/Action command</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- Overview -->
## Overview
This is a starter App includes a Laravel application equipped with the required auth processes and webhooks/actions that help you to create your Salla App which works with the [Salla APIs](https://docs.salla.dev/). Your App later can be published to the [Salla App Store](https://apps.salla.sa/) and be available for installation to any of Salla [Merchants Stores](https://s.salla.sa/).

What can you use this starter App for?
* Create a Salla App from scratch, e.g. chatbot app or shipping service app, or any amazing app from your idea.
* Modify/Customize any of your previous Apps in order to take the advantages given by this starter App.
<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

The starter App comes with an easy _1-command step_ that does the complete setup for your starter App. To be ready, you will need some prerequisites which will be listed hereafter.

### Prerequisites
-   Create a Partner account at  [Salla Partner Portal](https://salla.partners/)
-   Create your App in [Salla Partner Portal](https://salla.dev/blog/create-your-first-app-on-salla-developer-portal/)

    > From your App dashboard at [Salla Partner Portal](https://salla.partners/), you will be able to get your App's _Client ID, Client Secret Key and Webhook Secret Key_ which you will use later duraing the setup process.

-   For Laravel compatibility: `PHP >= 7.4, Composer package manager and MySql Database`
-   Install [ngrok](https://www.npmjs.com/package/ngrok): `npm install ngrok -g`
-   Other requirments: `Nodejs and npm`

That is all!

### Installation
The installation process is straightforward as you will see in the below steps.

1. In your MySql Database: **create a database** with any name for example  `laravel`.

2.  In your command line: **run** the following `create-project` composer command to create your Laravel starter App project.
```sh
composer create-project salla/laravel-starter-kit {your-awesome-app}
```

The above `create-project` will take you through a step-by-step process in which you'll enter your App's _Client ID, Client Secret Key, and Webhook Secret Key_, which you can get from your App dashboard in the Partners Panel, as well as your database name, which is set to `laravel` by default.

![FxNjM6ii-2021-11-19 at 11 10 21](https://user-images.githubusercontent.com/10876587/142588575-f730e962-06c5-49f0-b728-837ee5dc676c.gif)

> The step will ask you to select the authorization mode for your App, which can be [Easy or Custom mode.](#auth-modes)
> In case you selected the _Custom_ mode for your App authorization, you will need to enter the **same callback Url you already entered in your App dashboard at the [Salla Partner Portal](https://salla.partners/)**

<p align="right">(<a href="#top">back to top</a>)</p>

## Usage

1. In your command line: **Run** `php artisan serve.remote` command

![XBHrsHj4-2021-11-19 at 00 37 54](https://user-images.githubusercontent.com/10876587/142501121-48608b18-a14e-4f6d-968c-022b6a29b221.gif)

Now you can open your browser to view your App at `Remote App Url` in the [output URLs.](#output-urls).  🎉

2. Login to the Laravel App with the demo account:  Email:  `awesome@salla.dev`, Password:  `in ksa`
3. Click the button to request the _Access Token_.
4. The Laravel App will redirect you to Merchant Auth Page.
5. Login using a Merchant Account (or the demo store of your app).
5. Give access to your App.


> If you are using [Easy mode.](#auth-modes.easy) the access token will push to the action ([`StoreAuthorize`](app/Actions/App/StoreAuthorize.php#L18)) via webhook
>
> If you are using [Custom mode.](#auth-modes.custom) the browser will redirect you again to the [`callback() page`](app/Http/Controllers/OAuthController.php#L26).

#### Output URLs <span id='output-urls'>

| URL               | Description                                                                                                              |
|------------------|-----------------------------------------------------------------------------------------------------------------|
| Local App Url      | The local link for your App\.                                                                                     |
| Remote App Url     | The online link to your App\. It will be always synced with the local Url                                         |
| Webhook Url        | The Url link that connects your App with any action that may happen at the Merchant store, e\.g\. \ncreate new product\. |
| OAuth Callback Url | The App entry page where the access token is generated; Note that this Url is available only for the `Custom` mode auth.                                                               |


<p align="right">(<a href="#top">back to top</a>)</p>


## Configure Authorization Modes <span id='auth-modes'>

While creating your App in the [Salla Partners Portal](https://salla.partners/), you will see that Salla provids two methods for the OAuth protocol, which are the `Easy Mode` and the `Custom Mode`.
    
> During the setup process, the default _OAuth protocol_ will be set to the `Easy Mode`, which can be configured from the file [`.env`](.env).
> All of the setup's values/keys are stored in the `.env` file as we can see in the below image.

<p align="center"><img src="https://i.imgur.com/TvSCAWC.png" width="660" alt="Salla Laravel App folder structure"></p>

#### Easy Mode <span id='auth-modes.easy'>
    
This mode is the default mode for the authorization, which means that the `access token` is generated automatically at Salla's side back to you.
You may refer to the class [`StoreAuthorize`](app/Actions/App/StoreAuthorize.php#L18) which is defined inside [`app\Actions\App\StoreAuthorize.php`](app/Actions/App/StoreAuthorize.php) to get more details on how to receive and manage the `access token`

    
#### Custom Mode <span id='auth-modes.custom'>
    
A callback Url is the Url that is triggered when the App has been granted authorization. This should be a valid Url to which the merchant's browser is redirected. In this mode, you will need to set a custom callback url from the App dashboard at the [Salla Partner Portal](https://salla.partners/). This callback url will redirect the merchants who are interested in using your app into your App entry page where the access token is generated.

You may refere to file [`app/Http/Controllers/OAuthController.php`](app/Http/Controllers/OAuthController.php) which contains the [`callback()`](app/Http/Controllers/OAuthController.php#L26) function. This function is responsible for generating the `access token`

> The custom url will redirect the merchant to the [Store Dashboard](https://s.salla.sa/apps) in order to access the Store where he needs your App to be installed.

<br />
    
## Authorization Service
    
This project comes with a simple singleton authorization service to help you with managing the access and refresh tokens
    
```php
// set the current user or any user you want to use his access tokens
app('salla.auth')->forUser(auth()->user());

// Get the get the store details
/** Salla\OAuth2\Client\Provider\SallaUser::class **/
app('salla.auth')->getResourceOwner();

// Made an API request using the current access token of the user
app('salla.auth')->request('GET', 'https://api.salla.dev/admin/v2/products')['data'];
    
// Request a new access token
app('salla.auth')->getNewAccessToken();

// Save the access token
auth()->user()->token()->create([
    'merchant'      => 'id',
    'access_token'  => 'access token',
    'expires_in'    => 'expires in sec',
    'refresh_token' => 'refresh token'
]);
```

### Refreshing a Token

Access tokens expire after one week. Once expired, you will have to refresh a user’s access token. you can easily request a new access token via the current refresh token for any user like this

```php
try {
    // set the current user
    // or any user you want to refresh his access token
    app('salla.auth')
        ->forUser(auth()->user())
        ->getNewAccessToken();
    
    // by defaul the function `getNewAccessToken` will get a new access token 
    // and save the new access token to the same user you are set it in the `forUser` function
} catch (\League\OAuth2\Client\Provider\Exception\IdentityProviderException $exception) {
    // in case the token access token & refresh token is expired
    // you should redirect the user again to Salla authorization service to get a new token
    // return redirect()->route('oauth.redirect');
}
```
<br />
    
<!-- Webhooks -->
## Webhooks
[Webhooks](https://docs.salla.dev/docs/merchant/ZG9jOjI0NTE3NDg1-webhook) simplify the communication between your App and [Salla APIs](https://docs.salla.dev/). In this way, you will be notified whenever your app receives payload/data from the Salla APIs. These webhooks are triggered along with many actions such as an order or product being created, a customer logs in, a coupon is applied, and much more.

Salla already defined a list of the webhooks/actions that are triggered automatically. The predefined webhooks/actions can be found in the folder [`app/Actions`](https://github.com/SallaApp/Laravel-Start-Kit/tree/master/app/Actions).

### Order Related Webhooks/Actions

| ** Action Name **                                                                 | ** Description **                                                              |
|-----------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| [order.created](app/Actions/Order/Created.php)                                    | This indicates a singular order has been created                               |
| [order.updated](app/Actions/Order/Updated.php)                                    | Details, data and/or content of a specific order have been refreshed updated   |
| [order.status.updated](app/Actions/Order/StatusUpdated.php)                       | Whenever there is an order status update, this is triggered                    |
| [order.cancelled](app/Actions/Order/Cancelled.php)                                | This happens when an order is cancelled                                        |
| [order.refunded](app/Actions/Order/Refunded.php)                                  | The refund action to refund the whole order is triggered.                      |
| [order.deleted](app/Actions/Order/)                                               | This indicates an order has been deleted                                       |
| [order.products.updated](app/Actions/Order/ProductsUpdated.php)                   | Order products is updated                                                      |
| [order.payment.updated](app/Actions/Order/PaymentUpdated.php)                     | A payment method has been updated                                              |
| [order.coupon.updated](app/Actions/Order/CouponUpdated.php)                       | This is triggered whenever a Coupon is updated                                 |
| [order.total.price.updated](app/Actions/Order/TotalPriceUpdated.php)              | A total price of an order has been updated                                     |
| [order.shipment.creating](app/Actions/Order/ShipmentCreating.php)                 | This indicates a new shipment is being created                                 |
| [order.shipment.created](app/Actions/Order/ShipmentCreated.php)                   | This indicates a new shipment has been created                                 |
| [order.shipment.cancelled](app/Actions/Order/ShipmentCancelled.php)               | This indicates a an order shipment has been cancelled                          |
| [order.shipment.return.creating](app/Actions/Order/ShipmentReturnCreating.php)    | This is triggered when a returned order shipment is being created              |
| [order.shipment.return.created](app/Actions/Order/ShipmentReturnCreated.php)      | This is triggered when a returned order shipment has been created              |
| [order.shipment.return.cancelled](app/Actions/Order/ShipmentReturnCancelled.php)  | This is triggered when a returned order shipment has been cancelled            |
| [order.shipping.address.updated](app/Actions/Order/ShippingAddressUpdated.php)    | Occurs when an Order shipping address is updated                               |


<p align="right">(<a href="#top">back to top</a>)</p>

### Products Related Webhooks/Actions

| ** Action Name **                                            | ** Description **                                                                     |
|--------------------------------------------------------------|---------------------------------------------------------------------------------------|
| [product.created](app/Actions/Product/Created.php)           | A new product is created. Payload of the new product are to accompanying the product  |
| [product.updated](app/Actions/Product/Updated.php)           | Add/Modify details of a product                                                       |
| [product.deleted](app/Actions/Product/Deleted.php)           | Delete a product along with all its variants and images                               |
| [product.available](app/Actions/Product/Available.php)       | Flags a product as stock available                                                    |
| [product.quantity.low](app/Actions/Product/QuantityLow.php)  | Shows warnings whenever a stock is of low quantity                                    |

<p align="right">(<a href="#top">back to top</a>)</p>

### Customer Related Webhooks/Actions

| ** Action Name **                                            | ** Description **                         |
|--------------------------------------------------------------|-------------------------------------------|
| [customer.created](app/Actions/Customer/Created.php)         | Create a new customer record              |
| [customer.updated](app/Actions/Customer/Updated.php)         | Update details for a customer             |
| [customer.login](app/Actions/Customer/Login.php)             | Triggered whenever a customer log in      |
| [customer.otp.request](app/Actions/Customer/OtpRequest.php)  | One-Time Password request for a customer  |

<p align="right">(<a href="#top">back to top</a>)</p>

### Category Related Webhooks/Actions


| ** Action Name **                                     | ** Description **                                     |
|-------------------------------------------------------|-------------------------------------------------------|
| [category.created](app/Actions/Category/Created.php)  | Creates a new category for products to be put under   |
| [category.updated](app/Actions/Category/Updated.php)  | Add new or reform existing category details           |

<p align="right">(<a href="#top">back to top</a>)</p>

### Brand Related Webhooks/Actions

| ** Action Name **                               | ** Description **                                                                      |
|-------------------------------------------------|----------------------------------------------------------------------------------------|
| [brand.created](app/Actions/Brand/Created.php)  | Creates a new Brand.                                                                   |
| [brand.updated](app/Actions/Brand/Updated.php)  | Triggered when Information about a sepcific Brand is updated/refurbished/streamlined   |
| [brand.deleted](app/Actions/Brand/Deleted.php)  | An existing brand is then deleted and removed from a store                             |

<p align="right">(<a href="#top">back to top</a>)</p>

### Store Related Webhooks/Actions

| ** Action Name **                                                  | ** Description **                    |
|--------------------------------------------------------------------|--------------------------------------|
| [store.branch.created](app/Actions/Store/BranchCreated.php)        | Creates a new store.                 |
| [store.branch.updated](app/Actions/Store/BranchUpdated.php)        | Updates an existing branch           |
| [store.branch.setDefault](app/Actions/Store/BranchSetDefault.php)  | Sets for default a specific branch   |
| [store.branch.activated](app/Actions/Store/BranchActivated.php)    | Activates a disabled branch          |
| [store.branch.deleted](app/Actions/Store/BranchDeleted.php)        | Deletes a branch                     |
| [storetax.created](app/Actions/Store/TaxCreated.php)               | Creats a new Store Tax               |

<p align="right">(<a href="#top">back to top</a>)</p>

    

### Coupon Related Webhooks/Actions

| ** Action Name **                                                          | ** Description **                                 |
|----------------------------------------------------------------------------|---------------------------------------------------|
| [coupon.applied](app/Actions/Miscellaneous/CouponApplied.php)              | Creates a discount code in the form of a coupon   |
| [review.added](app/Actions/Miscellaneous/ReviewAdded.php)                  | A product review has been added                   |
| [abandoned.cart](app/Actions/Miscellaneous/AbandonedCart.php)              | Outputs a list of abandoned carts                 |
| [specialoffer.created](app/Actions/Miscellaneous/SpecialofferCreated.php)  | Creates a new special offer                       |
| [specialoffer.updated](app/Actions/Miscellaneous/SpecialofferUpdated.php)  | Updates a special offer                           |

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- COMMANDS -->
## Commands
### Setup command
The setup file can be found in [`app/Console/Commands/Setup.php`](https://github.com/SallaApp/Laravel-Start-Kit/blob/ffbed5807075e8da28dd445049ea3aaadf688c1a/app/Console/Commands/Setup.php).

```sh
php artisan setup
```

### Create new Webhook/Action command
The predefined [Webhooks](#webhooks), events/actions, can be found in folder [`app/Actions`](https://github.com/SallaApp/Laravel-Start-Kit/tree/master/app/Actions).
> You may define your own new webhook/action the way fits your App's requirments.
```sh
php artisan make:webhook.event {event-name}
```
<br />
    
<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create.
Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request.
You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

## Security

If you discover any security-related issues, please email security@salla.sa instead of using the issue tracker.

## Credits

- [Salla](https://github.com/sallaApp)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

