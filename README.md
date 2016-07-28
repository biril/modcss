Modular CSS Playground
======================

We start out with
-----------------

* `npm run serve`: **Run a local dev server on port 8888.** (Depends on
    [local-web-server](https://www.npmjs.com/package/local-web-server), a simple web-server
    for productive front-end development.)
* `js:bundle`: **Build a JS bundle.** (Depends on
    [requirejs](https://www.npmjs.com/package/requirejs), the node adapter for RequireJS,
    for loading AMD modules. Includes the RequireJS optimizer.)
* `css:bundle`: **Build a CSS bundle.** (Depends on
    [node-sass](https://www.npmjs.com/package/node-sass), the node bindings for the Sass
    stylesheet preprocessor.)
* `css:bundle-when-changed`: **Watch for CSS changes and rebuild CSS bundle in response.**
    (Depends on [node-sass](https://www.npmjs.com/package/node-sass) and
    [onchange](https://www.npmjs.com/package/onchange) - Use glob patterns to watch file
    sets and run commands when anything is added, changed or deleted.)
