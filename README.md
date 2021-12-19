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

The Salla Command Line Interface (Salla CLI) is your way to create your starter Salla Apps which works with the [Salla APIs](https://docs.salla.dev/). Your App later can be published to the [Salla App Store](https://apps.salla.sa/) and be available for installation to any of Salla [Merchants Stores](https://s.salla.sa/).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

The Salla CLI (salla-cli) is packaged to be used globally. It is available via npm and is installed globally by running `npm install salla-cli -g`.

Salla CLI comes with an easy to use, straight-forward commands that does the complete setup to either your Salla Theme or App. To be ready, you will need some prerequisites which will be listed hereafter.

What can you use Salla CLI for?

- Login to your Salla Store.
- Single-taps to create your own Salla App on Salla Partners.
- Create your own Salla Theme.

### Prerequisites

- Create a Partner account at [Salla Partners Portal](https://salla.partners/).
- Get your hands-on around creating an app on [Salla Partners Portal](https://salla.dev/blog/create-your-first-app-on-salla-developer-portal/).
- For Salla CLI's compatibility: [`PHP`](https://www.php.net/) `>= 7.4`, [`Composer`](https://getcomposer.org/) `package manager`.
- Other requirments: [`Nodejs`](https://nodejs.org/en/)`>= 10.15.0` and [`npm`](https://www.npmjs.com/)`>= 6.14.0`.

### Installation

<!-- ### Installation -->

To install Salla CLI, you need administrator privileges to execute the following command

`npm install @salla.sa/cli -g`

After installation, you will have access to the `salla` binary in your command line. You can verify that it is properly installed by simply running salla, which should present you with a help message listing all available commands.

You can check you have the right version with this command:

`salla --version`

To upgrade the global Vue CLI package, you need to run:

`npm update @salla.sa/cli -g`

## Salla CLI Commands

The following commands can be executed via Salla CLI:

  <table>
     <thead>
          <tr>
               <th>Commands</th>
          </tr>
     </thead>
     <tbody>
          <tr>
               <td>salla</td>
          </tr>
          <tr>
               <td>salla login</td>
          </tr>
          <tr>
               <td>salla app</td>
          </tr>
          <tr>
               <td>salla app create</td>
          </tr>
          <tr>
               <td>salla app delete</td>
          </tr>
          <tr>
               <td>salla app list</td>
          </tr>
          <tr>
               <td>salla app create-webhook</td>
          </tr>
          <tr>
               <td>salla app serve</td>
          </tr>
          <tr>
               <td>salla theme</td>
          </tr>
          <tr>
               <td>salla theme start</td>
          </tr>
          <tr>
               <td>salla theme serve</td>
          </tr>
          <tr>
               <td>salla theme sync</td>
          </tr>
          <tr>
               <td>salla theme watch</td>
          </tr>
          <tr>
               <td>salla theme push</td>
          </tr>
          <tr>
               <td>salla theme publish</td>
          <tr>
          </tr>
     </tbody>
</table>

### `salla`

This command lists down the available commands using the `salla` binary, such as `app` for creating [Salla Partners](http://salla.partners/) Apps, `theme` for creating Salla custom themes, and `login` to sigin to your [Salla Stores](http://salla.sa/). You can write it in your terminal in such a way:

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

### `salla login`

This command allows you to login and be authinticated with your own [stores](http://salla.sa/) at Salla. You can write it in your terminal in such a way:

```bash
salla login
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
      <td>login</td>
      <td>Used to allow logging in to your Salla Stores. The stores can either be demo stores or real stores.</td>
    </tr>
  </tbody>
  <table>

### `salla app`

This command lists down the available commands using the `salla app` binary, such as `create` for creating [Salla Partners](http://salla.partners/) Apps, `serve` for serving your Salla Partners Apps, and `create-webhook` which enables you to create your selected webhook event file. You can write it in your terminal in such a way:

```bash
salla app
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
      <td>app</td>
      <td>Used to prevail commands supported by `salla app`, such as `create`, `serve`, and `create-webhook`.</td>
    </tr>
  </tbody>
  <table>

### `salla app create`

This command allows you to create a Salla Partners App by going through a simple, intuitive, and effortless way. You can write it in your terminal in such a way:

```bash
salla app create
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
      <td>app create</td>
      <td>Used to take you through a wizard to easily create your Salla Partners App.</td>
    </tr>
  </tbody>
  <table>

### `salla app delete`

This command allows you to delete your Salla Partners App both locally and remotely. You can write it in your terminal in such a way:

```bash
salla app delete <app.id>
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
      <td>app delete</td>
      <td>Used to delete your Salla Partners App.</td>
    </tr>
  </tbody>
  <table>

### `salla app list`

This command lists down all the apps, alnogside their type and status, that are associated with your [Salla Partners](https://salla.partners/) account in a table formatted style. You can write it in your terminal in such a way:

```bash
salla app list
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
      <td>app list</td>
      <td>Used to show you all your Salla Partner Apps.</td>
    </tr>
  </tbody>
  <table>

### `salla app create-webhook`

This command allows you to create a webhook event file by choosing what event to listen to, as you may look up more on the [official documentation](https://docs.salla.dev/docs/merchant/ZG9jOjI0NTE3NDg1-webhook#list-of-events) for supported webhook events. You can write it in your terminal in such a way:

```bash
salla app create-webhook <event.name>
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
      <td>app create-webhook</td>
      <td>Used to create a webhook event file for streaming supported Salla events, such as `order.created`, `product.available`, `review.added` and more.</td>
    </tr>
  </tbody>
  <table>


### `salla app serve`

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
