# Markwright

> dead-simple desktop publishing with markdown and sass

Write your content with Markdown, style with SASS, export to PDF and move on with your life.

## Installation

### Building from source (OSX)

Currently, the fastest way to get Markwright up and running on your machine is by cloning the source repository. I'm assuming you have [Git](https://git-scm.com) and [Node](https://nodejs.org/en/) installed—otherwise, you'll need to install them in order to continue.

```bash
git clone git@github.com:noahlange/markwright-app.git
```

Great. Now we have the application source cloned into the `markwright-app` directory. <kbd>cd</kbd> in and install the application's dependencies. After the installation process is done (it may take several minutes), you can compile the app into a standalone application.

```bash
# install dependencies
npm i
# generate executable
npm run dist
```

This command will package the application and deposit either the `.app` or `.exe` installer the `dist` directory. Open the folder and drag the application bundle to your `/Applications` directory or wherever you'd like to run it. Double-click on the icon and you've got yourself a Markwright.
