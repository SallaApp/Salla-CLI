<div id="top"></div>

<br />
<div align="center">
     <a href="https://salla.dev">
          <img src="https://salla.dev/wp-content/themes/salla-portal/dist/img/salla-logo.svg" alt="Logo" width="80"
               height="80">
     </a>
     <h1 align="center">Salla CLI</h1>
     <p align="center">
          Free and Open Source, Bringing You the Power of Salla to Your Terminal.
          <br />
          <a href="https://salla.dev/"><strong>Explore our blogs »</strong></a>
          <br />
          <br />
          <a href="https://github.com/SallaApp/Salla-CLI/issues/new">Report Bug</a> ·
          <a href="https://github.com/SallaApp/Salla-CLI/discussions/new">Request Feature</a> . <a
               href="https://t.me/salladev">&lt;/Salla Developers&gt;</a>
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
          <li><a href="#salla-cli-commands">Salla CLI Commands</a></li>
          <ul>
               <li><a href="#salla">salla</a></li>
               <li><a href="#salla-login">salla login</a></li>
               <li><a href="#salla-app">salla app</a></li>
               <li><a href="#salla-app-create">salla app create</a></li>
               <li><a href="#salla-app-create">salla app list</a></li>
               <li><a href="#salla-app-create-webhook">salla app create-webhook</a></li>
               <li><a href="#salla-app-serve">salla app serve</a></li>
               <li><a href="#salla-theme">salla theme</a></li>
               <li><a href="#salla-theme-start">salla theme start</a></li>
               <li><a href="#salla-theme-serve">salla theme serve</a></li>
               <li><a href="#salla-theme-sync">salla theme sync</a></li>
               <li><a href="#salla-theme-watch">salla theme watch</a></li>
          </ul>
          </li>
          <li><a href="#contributing">Contributing</a></li>
          <li><a href="#license">License</a></li>
          </li>
     </ol>
</details>
<!-- Overview -->

## Overview

[The Salla Command Line Interface (Salla CLI)](https://github.com/SallaApp/Salla-CLI) is your way to create your starter Salla Apps which works with the [Salla APIs](https://docs.salla.dev/). Your App later can be published to the [Salla App Store](https://apps.salla.sa/) and be available for installation to any of Salla [Merchants Stores](https://salla.sa/).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

The Salla CLI (salla-cli) is available via npm and is packaged to be used globally so you can access it everywhere.

Salla CLI comes with an easy to use, straight-forward commands that does the complete setup to either your Salla Theme or App. To be ready, you will need some prerequisites which will be listed hereafter.

What can you use [Salla CLI](https://github.com/SallaApp/Salla-CLI) for?

- Login to your Salla Store.
- Single-taps to create your own Salla App on Salla Partners Portal.

### Prerequisites

- Create a Partner account at [Salla Partners Portal](https://salla.partners/).
- For Salla CLI's compatibility: [`PHP`](https://www.php.net/) `>= 7.4`, [`Composer`](https://getcomposer.org/) `package manager`.
- Other requirments: [`Nodejs`](https://nodejs.org/en/)`>= 10.15.0` and [`npm`](https://www.npmjs.com/)`>= 6.14.0`.

### Usage

<!-- ### Installation -->

To install Salla CLI, you need administrator privileges to execute the following command

`npm install @salla.sa/cli -g`

<!-- Image Workflow -->

<!-- ![](https://salla.dev/wp-content/uploads/2020/05/salla-cli-install.png) -->

After installation, you will have access to the `salla` binary in your command line. You can verify that it is properly installed by simply running salla, which should present you with a help message listing all available commands.

You can check you have the right version with this command:

`salla --version`

``` bash
The convention followed to execute Salla CLI Commands is:

salla <command>

Available Commands:
  Command:                  Description:                      Properties:
  salla app                 Manage your Salla Apps            [app] 
  salla app create          Create a new Salla App            [app]
  salla app create-webhook  Create a new Salla App Webhook    [event.name] 
  salla app delete          Delete an existing Salla App      [--id]
  salla app list            List all your Salla Apps          [app]
  salla app serve           Serve an existing Salla App       [--port] 
  salla login               Login to your Salla Store         [app] 
  salla version             Show the version of Salla CLI     [app] 
```

## Create Application

Creating your Salla Partners Portal App is much easier with Salla CLI. Run the following command to create your app:

```bash
salla app create
```

List of existing apps assocaited to your account will be displayed as well as an option to create your app on Salla Partners Portal.


<!-- ![](InteractiveTerminalActivityPicture) -->

### Serve Application

To run and test an existing Salla App, run the following command:

```bash
salla app serve
```

<!-- ![](InteractiveTerminalActivityPicture) -->

### Create Webhook

Webhooks are a way to receive notifications from Salla when an event happens in your Salla App. For example, when a new order is placed, you can receive a notification via your own webhook.

For utmost flexibility, you can stream a webhook for any event you want to receive. Run the following command to create a webhook:

```bash
salla app create-webhook
```

## Auth

### Login

To communicate with your Salla Partners Apps, you will need to be authenticated. To do so, run the following command:

```bash
salla login
```

That will handle all authentication and authorization process with your Salla App on [Salla Partners Portal](https://salla.partners/). 

### `salla`

This command lists down the available commands using the `salla` binary, such as `app` for creating [Salla Partners Portal](http://salla.partners/) Apps, `theme` for creating Salla custom themes, and `login` to sigin to your [Salla Stores](http://salla.sa/). You can write it in your terminal in such a way:

```bash
salla
```

<!-- ![](InteractiveTerminalActivityPicture) -->

<table>
  <thead>
    <tr>
      <th>Binary</th>
      <th>Parameter</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>salla</td>
      <td>-</td>
      <td>Used to prevail commands supported by Salla, such as `app`, `theme`, and `login`</td>
    </tr>
  </tbody>
  <table>



This command allows you to serve your Salla apps on a dedicated local port. You can write it in your terminal in such a way:

```bash
salla salla app serve
```

<!-- ![](InteractiveTerminalActivityPicture) -->

<table>
  <thead>
    <tr>
      <th>Binary</th>
      <th>Parameter</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>salla</td>
      <td>app serve</td>
      <td>Used to run a Salla App on a local server.</td>
    </tr>
  </tbody>
  <table>


<!-- CONTRIBUTING -->




## Upgrade

To upgrade Salla CLI package globally, you need to run:

`npm update @salla.sa/cli -g`

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
