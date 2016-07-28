require.config({
  baseUrl: './',
  paths: {
    'text': 'node_modules/requirejs-text/text',
    'jquery': 'node_modules/jquery/dist/jquery',
    'underscore': 'node_modules/underscore/underscore',
    'backbone': 'node_modules/backbone/backbone'
  },
  name: 'main',
  out: 'bundle.js'
});

require(['app'], function(app) {
  app.run();
});
