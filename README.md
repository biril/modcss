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


3: Useful scripts
-----------------

We can go over each and every one of our defined modules applying step 2. We will _have to_, given
that we need to change all our scripts to make use of generated JSON files when referencing class
names. However, we naturally want to automate the creation of CSS-modules. So here's the scripts that
we'll be using:

#### `css:create-module`

We already have that. We can run it as described in step 2 above to generate the `scss.module` and
`scss.json` files per module. (Remember to run `css:bundle` afterwards, in order to get the updated
styles into `bundle.css`.)

#### `css:create-modules`

Notice the `s` at the end. This is a script to go over _all_ defined modules in our code and run
`css:create-module` on them. This is a necessity as we don't want to be manually iterating our
codebase looking for modules and re-running `css:create-module` all the time. A user checking out
our repo will start out without any `scss.module` or `scss.json` files (these are _generated_ and
as such _not versioned_). To generate _all_ of them it should be enough to run this script. The
implementation will be based on [bash find](http://linux.die.net/man/1/find):

```json
{
  "css:create-modules":
    "find ./src -iname '*.scss' -exec npm run css:create-module -- -o '{}.module' '{}' \\;"
}
```

(The `{}` token is the path of the found file, available courtecy of `find`.)

#### `css:create-module-when-styles-change`

Watch `.scss` files and whenever they change, re-create `scss.module` / `scss.json`. So that we
don't have to do it manually. We can use [onchange](https://www.npmjs.com/package/onchange) for the
watching and delegate back to `css:create-module`:

```json
  "css:create-module-when-styles-change":
    "onchange 'src/**/*.scss' -v -- npm run css:create-module -- -o '{{changed}}.module' '{{changed}}'",
```

(The `{{changed}}` token is the path of the changed file, available courtecy of `onchange`.)

#### `css:bundle`

We've had this script all along, even before we introduced any of the modular CSS stuff. It'll always
have to be run after a `css:create-module` to get the new styles into `bundle.css`.
