require.config({
  baseUrl: './',
  paths: {
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
