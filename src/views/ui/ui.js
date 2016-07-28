define(function(require) {
  'use strict';

  var _ = require('underscore');
  var Backbone = require('backbone');
  var UsersView = require('./users/users');
  var tpl = _.template(require('text!./ui.html'));

  var UiView = Backbone.View.extend({
    className: 'ui',

    // Initialized with opts:
    //  * users: A Collection of users
    initialize: function(opts) {
      this._usersView = new UsersView({users: opts.users});

      this.$el.html(tpl());

      this.$('.ui_users').append(this._usersView.el);
    }
  });

  return UiView;
});
