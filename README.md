<div id="top"></div>

<br />
<div align="center">
     <a href="https://salla.dev">
          <img src="https://i.ibb.co/RzH89hx/Banner-CLI-1.png" alt="Logo" width="%100"
               height="%100">
     </a>
     <h1 align="center">Salla CLI</h1>
     <p align="center">
          Bringing You the Power of Salla to Your Terminal.
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
          </li>
          <li><a href="#support">Support</a></li>
          <li><a href="#security">Security</a></li>
          <li><a href="#credits">Credits</a></li>
          <li><a href="#license">License</a></li>
          </li>
     </ol>
</details>
<!-- Overview -->

## Overview

[The Salla Command Line Interface](https://docs.salla.dev/docs/salla-cli) (Salla CLI) is your way to create your starter Salla Apps which works with the [Salla APIs](https://docs.salla.dev/). Your App later can be published to the [Salla App Store](https://apps.salla.sa/) and be available for installation to any of Salla [Merchants Stores](https://salla.sa/).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

The [Salla CLI](https://docs.salla.dev/docs/salla-cli) is available via npm and is packaged to be used globally so you can access it everywhere. With the [official documentation](https://docs.salla.dev/docs/salla-cli), take the terminal experience to the next level

[Salla CLI](https://docs.salla.dev/docs/salla-cli) comes with an easy to use, straight-forward commands that does the complete setup to your Salla App. To be ready, you will need some prerequisites which will be listed hereafter.

What can you use [Salla CLI](https://docs.salla.dev/docs/salla-cli) for?

- Single-taps to create your Salla App on [Salla Partners Portal](https://salla.partners/).
- Alternatively, use the Starter Kits to create your app.
- Serve the local app to the public for testing purposes.
- Publish the app to [Salla App Store](https://apps.salla.sa/).

### Prerequisites

- Create a Partner account at [Salla Partners Portal](https://salla.partners/).
- For Salla CLI's compatibility: [`Nodejs LTS`](https://nodejs.org/en/)`>= 16.13.1` and [`npm`](https://www.npmjs.com/)`>= 6.14.0`.
- Other requirments:[`PHP`](https://www.php.net/) `>= 7.4`, [`Composer`](https://getcomposer.org/) `package manager`.

### Usage

<!-- ### Installation -->

To install [Salla CLI](https://github.com/SallaApp/Salla-CLI), run the following command:

```bash
npm install @salla.sa/cli -g
```

And you're now ready to start building your apps with [Salla Partners Portal](https://salla.partners/) !

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
  salla login                      Login to your Salla Partners account              -
  salla version                    Show the version of Salla CLI                     -
  salla app                        Show list of commands with the binary `app`       -
  salla app create                 Create a new Salla App                            -
  salla app create-webhook         Create a new Salla App Webhook                    [event.name]
  salla app delete                 Delete an existing Salla App                      -
  salla app list                   List all your Salla Apps                          -
  salla app info                   Show detailed app information                     -
  salla app link                   Link your local app with Salla Partners           -
  salla app serve                  Serve an existing Salla App                       [-p,-l]
  salla theme create               Create a new Salla Store Theme                    -
  salla theme preview              Build, deploy, and preview the theme locally      -
  salla theme list                 List all your Salla Store Themes                  -
  salla theme delete               Delete an existing Salla Store Theme              -
  salla theme publish              Submit Theme for publishing approval              -
```

> Explore about Theme Commands through the [official documentation](https://docs.salla.dev/docs/salla-cli)

## Upgrade

To upgrade [Salla CLI](https://github.com/SallaApp/Salla-CLI) package globally, you need to run:

```bash
npm update @salla.sa/cli -g
```

## Support

The team is always here to help you. Happen to face an issue? Want to report a bug? You can submit one here on Github using the [Issue Tracker](https://github.com/SallaApp/Salla-CLI/issues/new). If you still have any questions, please contact us via the [Telegram Bot](https://t.me/SallaSupportBot) or join in the Global Developer Community on [Telegram](https://t.me/salladev).

## Security

If you discover any security-related issues, please email `security@salla.sa` instead of using the issue tracker.

## Credits

- [Salla](https://github.com/sallaApp)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

<p align="right">(<a href="#top">back to top</a>)</p>
