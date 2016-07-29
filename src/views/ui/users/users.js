define(function(require) {
  'use strict';

  var _ = require('underscore');
  var Backbone = require('backbone');
  var UserPlainView = require('./user-plain/user-plain');
  var UserFriendView = require('./user-friend/user-friend');
  var tpl = _.template(require('text!./users.html'));
  var cn = JSON.parse(require('text!./users.scss.json'));

  var UsersView = Backbone.View.extend({
    className: cn.users,

    // Initialized with opts:
    //  * users: A Collection of users
    initialize: function(opts) {
      this._users = opts.users;

      this.$el.html(tpl({cn: cn}));

      this._renderUsers();
      this.listenTo(this._users, 'change', this._renderUsers);
    },

    _removeUserViews: function() {
      _.each(this._userViews, function(userView) {
        this.stopListening(userView);
        userView.remove();
      }, this);
      this.$('.' + cn.list).empty();
    },

    _createUserViews: function() {
      this._userViews = this._users.map(function(user) {
        var UserView = user.get('isFriend') ? UserFriendView : UserPlainView;
        return new UserView({user: user});
      });
    },

    _addUserViews: function() {
      _.each(this._userViews, function(userView) {
        this.listenTo(userView, 'all', this.trigger);
      }, this);
      var userViewsElms = _.pluck(this._userViews, 'el');
      this.$('.' + cn.list).append(userViewsElms);
    },

    _renderUsers: function() {
      this._removeUserViews()
      this._createUserViews();
      this._addUserViews();
    }

  });

  return UsersView;
});
