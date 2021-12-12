<div id="top"></div>

<br />
<div align="center"> 
  <a href="https://salla.dev"> 
    <img src="https://salla.dev/wp-content/themes/salla-portal/dist/img/salla-logo.svg" alt="Logo" width="80" height="80"> 
  </a>
  <h1 align="center">Salla CLI</h1>
  <p align="center">
    Free and Open Source, Bringing You the Power of Salla to Your Terminal.
    <br />
    <a href="https://salla.dev/"><strong>Explore our blogs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/SallaApp/Salla-CLI/issues/new">Report Bug</a> · 
    <a href="https://github.com/SallaApp/Salla-CLI/discussions/new">Request Feature</a> . <a href="https://t.me/salladev">&lt;/Salla Developers&gt;</a>
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
      <li><a href="#contributing">Salla CLI Commands</a></li>
      <ul>
        <li><a href="#prerequisites">create app</a></li>
        </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    </li>
  </ol>
</details>
<!-- Overview -->

## Overview

The Salla Command Line Interface (Salla CLI) is your way to create your starter Salla Apps which works with the [Salla APIs](https://docs.salla.dev/). Your App later can be published to the [Salla App Store](https://apps.salla.sa/) and be available for installation to any of Salla [Merchants Stores](https://s.salla.sa/).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

The Salla CLI (salla-cli) is packaged to be used globally. It is available via npm and is installed globally by running `npm install -g salla-cli`.

Salla CLI comes with an easy to use, straight-forward commands that does the complete setup to either your Salla Theme or App. To be ready, you will need some prerequisites which will be listed hereafter.

What can you use Salla CLI for?

- Create your own Salla Theme
- Single-taps to create your own Salla App
- Login to your Salla Store

<!-- The starter App comes with an easy _1-command step_ that does the complete setup for your starter App. To be ready, you will need some prerequisites which will be listed hereafter. -->

### Prerequisites

- Create a Partner account at [Salla Partner Portal](https://salla.partners/)
- Create your App in [Salla Partner Portal](https://salla.dev/blog/create-your-first-app-on-salla-developer-portal/)

  > From your App dashboard at [Salla Partner Portal](https://salla.partners/), you will be able to get your App's _Client ID, Client Secret Key and Webhook Secret Key_ which you will use later duraing the setup process.

- For Laravel compatibility: `PHP >= 7.4, Composer package manager and MySql Database`
- Install [ngrok](https://www.npmjs.com/package/ngrok): `npm install ngrok -g`
- Other requirments: `Nodejs and npm`

That is all!

### Installation

<!-- ### Installation -->

The installation process is straightforward as you will see in the below steps.

## Salla CLI Commands

The following commands using the prefix `salla` in order to excute the commands:

- create app
- create theme

### `create app`

You can create a Salla Partners App by running the following command:

```bash
salla create app
```

<!-- ![](InteractiveTerminalActivityPicture) -->

<table>
  <thead>
    <tr>
      <th>Prefix</th>
      <th>Parameter</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>salla</td>
      <td>create app</td>
      <td>This command will take you through a wizard to easily create your Salla Partners App in a smooth way.</td>
    </tr>
  </tbody>

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