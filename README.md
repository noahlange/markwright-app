# Markwright

> dead-simple desktop publishing with markdown and sass

Write your content with Markdown, style with SASS, export to PDF and move on with your life.

## Installation

### Building from source (OSX)

Currently, the fastest way to get Markwright up and running on your machine is by cloning the source repository. I'm assuming you have [Git](https://git-scm.com) and [Node](https://nodejs.org/en/) installed. You'll need to have both of these pieces of software installed on your machine on order to continue.

```bash
git clone git@code.noahlange.com:noahlange/markwright.git
```

Great. Now we have the application source cloned into the `markwright` directory. `cd` in and install the application's dependencies by running `npm i`. After the installation process is done (it may take several minutes), you can compile the app into a standalone application.

```bash
npm run dist
```

This command will package the application and deposit into the `dist/mac` directory as **Markwright.app**. Open the folder and drag the application bundle to your `/Applications` directory or wherever you'd like to run it.

Double-click on the icon and you've got yourself a Markwright.
