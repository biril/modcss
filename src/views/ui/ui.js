define(function(require) {
  'use strict';

  var _ = require('underscore');
  var Backbone = require('backbone');
  var UsersView = require('./users/users');
  var tpl = _.template(require('text!./ui.html'));
  var cn = JSON.parse(require('text!./ui.scss.json'));

  var UiView = Backbone.View.extend({
    className: cn.ui,

    // Initialized with opts:
    //  * users: A Collection of users
    initialize: function(opts) {
      this._usersView = new UsersView({users: opts.users});
      this.listenTo(this._usersView, 'all', this.trigger); // Bubble all events

      this.$el.html(tpl({cn: cn}));

      this.$('.' + cn.users).append(this._usersView.el);
    }
  });

  return UiView;
});
