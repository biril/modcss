define(function (require) {
  'use strict';

  var $ = require('jquery');

  var usersAttrs = require('resources/users');
  var users = new Backbone.Collection(usersAttrs);

  var UiView = require('views/ui/ui');

  // Run the app: Instantiate a UI View with the given set of users and render it
  var runApp = function() {
    var uiView = new UiView({users: users});

    uiView.on('befriendUser', function(userId) {
      var userToBefriend = users.get(userId);
      userToBefriend.set({isFriend: true});
    });

    $('.ui').append(uiView.el);
  }

  // The app exposes the one-and-only `run` method
  var app = {run: runApp};

  return app;
});
