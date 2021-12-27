<div id="top"></div>

<br />
<div align="center">
     <a href="https://salla.dev">
          <img src="https://salla.dev/wp-content/uploads/2021/12/salla-cli-github-banner-1.png" alt="Logo" width="%100"
               height="%100">
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
                    <li><a href="#usage">Usage</a></li>
               </ul>
          <li><a href="#create-application">Create Appliaction</a></li>
          <ul>
                    <li><a href="#serve-application">Serve Application</a></li>
                    <li><a href="#create-webhook">Create Webhook</a></li>
               </ul>
          <li><a href="#auth">Auth</a></li>
          <ul>
                    <li><a href="#login">Login</a></li>
          </ul>
          <li><a href="#delete">Delete</a></li>
          <li><a href="#upgrade">Upgrade</a></li>
          </li>
          <li><a href="#contributing">Contributing</a></li>
          <li><a href="#security">Security</a></li>
          <li><a href="#credits">Credits</a></li>
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

The [Salla CLI](https://github.com/SallaApp/Salla-CLI) (salla-cli) is available via npm and is packaged to be used globally so you can access it everywhere.

[Salla CLI](https://github.com/SallaApp/Salla-CLI) comes with an easy to use, straight-forward commands that does the complete setup to your Salla App. To be ready, you will need some prerequisites which will be listed hereafter.

What can you use [Salla CLI](https://github.com/SallaApp/Salla-CLI) for?

- Login to your [Salla Store]().
- Single-taps to create your own Salla App on [Salla Partners Portal](https://salla.partners/).

### Prerequisites

- Create a Partner account at [Salla Partners Portal](https://salla.partners/).
- For Salla CLI's compatibility: [`Nodejs LTS`](https://nodejs.org/en/)`>= 16.13.1` and [`npm`](https://www.npmjs.com/)`>= 6.14.0`.
- Other requirments:[`PHP`](https://www.php.net/) `>= 7.4`, [`Composer`](https://getcomposer.org/) `package manager`.

### Usage

<!-- ### Installation -->

To install [Salla CLI](https://github.com/SallaApp/Salla-CLI), you need administrator privileges to execute the following command

```bash
npm install @salla.sa/cli -g
```

And you're now ready to start building your apps with [Salla Partners Portal](https://salla.partners/)!

<!-- Image Workflow -->

<!-- ![](https://salla.dev/wp-content/uploads/2020/05/salla-cli-install.png) -->

After installation, you will have access to the `salla` binary in your command line. You can verify that the CLI is properly installed by simply running the binary command, `salla`, which should present you with a help message listing all available commands.

You can check you have the right version with this command:

```bash
salla --version
```

The convention followed to execute Salla CLI Commands is:

```bash

salla <command>

Available Commands:
  Command:                         Description:                                      Properties:
  salla app                        Show list of commands with the binary `app`       -
  salla app create                 Create a new Salla App                            -
  salla app create-webhook         Create a new Salla App Webhook                    [event.name]
  salla app delete                 Delete an existing Salla App                      [app.id]
  salla app list                   List all your Salla Apps                          -
  salla app info                   Show detailed app information                     -
  salla app serve                  Serve an existing Salla App                       [-p,-l]
  salla login                      Login to your Salla Store                         -
  salla version                    Show the version of Salla CLI                     -
```

## Create Application

Creating your [Salla App](https://salla.partners/) App is much easier with [Salla CLI](https://github.com/SallaApp/Salla-CLI). Run the following command to go through the wizard that would help you create your app:

```bash
salla app create
```

List of existing apps assocaited to your account will be displayed as well as an option to create your app on [Salla Partners Portal](https://salla.partners/). Afterwards, you will be presented with easy-to

![Salla App Create Command](https://i.ibb.co/HXpMdqx/Clean-Shot-2021-12-26-at-21-58-00.gif)

### Serve Application

To run and test an existing Salla App, run the following command:

```bash
salla app serve
```

![Salla App Serve Command](https://i.ibb.co/Ny9sL3T/Clean-Shot-2021-12-26-at-21-59-21.gif)

### Create Webhook

Webhooks are a way to receive notifications from Salla when an event happens in your Salla App. For example, when a new order is placed, you can receive a notification via your own webhook. Read more on [the Official Docs](https://docs.salla.dev/docs/merchant/ZG9jOjI0NTE3NDg1-webhook).

For utmost flexibility, you can stream a webhook for any event you want to receive. Run the following command to create a webhook:

```bash
salla app create-webhook
```

![Salla App Create-Webhook Command](https://i.ibb.co/vkKbTXD/salla-app-create-webhook.gif)

## Auth

### Login

To communicate with your [Salla Partners Portal](https://salla.partners/) Apps, you will need to be authenticated. To do so, run the following command:

```bash
salla login
```

That will handle all authentication and authorization process with your account on [Salla Partners Portal](https://salla.partners/).

<!-- ![](InteractiveTerminalActivityPicture) -->

## Delete

To delete your app directly from the CLI, you need to run:

```bash
salla app delete --id <app_id>
```

![Salla App Delete Command](https://i.ibb.co/ynBf4vD/Clean-Shot-2021-12-27-at-15-06-20.gif)

## Upgrade

To upgrade [Salla CLI](https://github.com/SallaApp/Salla-CLI) package globally, you need to run:

```bash
npm update @salla.sa/cli -g
```

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
