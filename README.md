Modular CSS with postCSS and npm scripts
========================================

This is an experiment in achieving 'modular CSS' by use of postCSS as a build-step, invoked
by appropriately constructed npm scripts. We start out with an example project (see
`./index.html` / `./src`) which uses a BEM-ish approach to enforce modular styles. We then
gradually tweak it until we get to the point where we can get rid of the unique prefixes and
the relevant maintenance hassle.

There are 5 stages to this, 0 to 4, which are laid out below. For each stage you can
`git checkout` the relevant tag (`0basics` to `3usefulScripts`) to force the example project's
source to the state which is relevant to the stage.


0: Basics
---------

* `npm run serve`: **Run a local dev server on port 8888.** (Depends on
    [local-web-server](https://www.npmjs.com/package/local-web-server), a simple web-server
    for productive front-end development.)
* `js:bundle`: **Build a JS bundle.** (Depends on
    [requirejs](https://www.npmjs.com/package/requirejs), the node adapter for RequireJS,
    for loading AMD modules. Includes the RequireJS optimizer.)
* `css:bundle`: **Build a CSS bundle.** (Depends on
    [node-sass](https://www.npmjs.com/package/node-sass), the node bindings for the Sass
    stylesheet preprocessor.) This will transpile all the `*.scss` files in our project and output
    a `bundle.css` at the root of our app - which is the (one-and-only) CSS file referenced in
    `index.html`. Note that `css:bundle` relies on `style/style.scss` to 'know' which `.scss` files
    to bundle. We need to maintain `style/style.scss` as we add/remove/relocate `.scss` files.
* `css:bundle-when-styles-change`: **Watch for style changes and rebuild CSS bundle in response.**
    (Depends on [node-sass](https://www.npmjs.com/package/node-sass) and
    [onchange](https://www.npmjs.com/package/onchange). The latter module facilitates the use of
    glob patterns to watch file sets and run commands when anything is added, changed or deleted.)


1: PostCSS - Does this thing even work?
---------------------------------------

Install [postcss](https://www.npmjs.com/package/postcss). Also install
[postcss-cli](https://www.npmjs.com/package/postcss-cli), the command line for postcss.

Let's create an experimental `css:prefix` script based on
[autoprefixer](https://www.npmjs.com/package/autoprefixer) (yes, install that too). Take a
look at [browserslist](https://github.com/ai/browserslist) for a way to configure autoprefixer
(go ahead and add a browserslist file). Our script should look like:

```json
{
  "css:prefix": "postcss -u autoprefixer"
}
```

try `npm run css:prefix -- ./src/views/ui/users/user-plain/user-plain.scss`.

(The `--` token allows passing custom arguments to invoked scripts, courtecy of
[npm's `run-script`](https://docs.npmjs.com/cli/run-script).)


2: Enter the CSS module
-----------------------

Okay, we're now ready to add a `css:create-module` npm script. Let's install
[postcss-modules](https://www.npmjs.com/package/postcss-modules) and create a new script based on
the previous `css:prefix`:

```json
{
  "css:create-module": "postcss -u autoprefixer -u postcss-modules"
}
```

Using autoprefixer is not really relevant at this point but it's a nice-to-have so let's leave it
in there. Try out our new script with
`npm run css:create-module -- ./src/views/ui/users/user-plain/user-plain.scss`. Notice the
generated `.scss.json`. Revel in its glory.

We now have a method of uniquefying the class names per module without having to manually prefix
them. Let's pick a module and remove all prefixes, applying our `create-module` script and making use
of the generated JSON files to get the unique class names into our templates.

We'll have to run `css:create-module` script with the `-o` switch to generate a `scss.module` file:

```bash
npm run css:create-module -- -o ./src/views/.../foo.scss.module ./src/views/.../foo.scss
```

Having generated the `.scss.module` file we'll have to `@import` it in `styles/modules.scss` in
place of the original `.scss` file: It is the `.scss.module` file that contains the uniquefied
class names that we want in our stylesheets. On the JS side, we'll have to swap direct references to
class names for references to attributes in the generated `.scss.json` file. Something along the
lines of:

```javascript
var classNames = JSON.parse(require('./foo.scss.json'));

// .. and then, further down
$(classNames.title).text('War and Peace'); // Instead of $('.title').text('War and Peace')
```
