define(function(require) {
  'use strict';

  var _ = require('underscore');
  var Backbone = require('backbone');
  var UserPlainView = require('./user-plain/user-plain');
  var UserFriendView = require('./user-friend/user-friend');
  var tpl = _.template(require('text!./users.html'));

  var UsersView = Backbone.View.extend({
    className: 'users',

    // Initialized with opts:
    //  * users: A Collection of users
    initialize: function(opts) {
      this._users = opts.users;

      this.$el.html(tpl());

      this._renderUsers();
      this.listenTo(this._users, 'change', this._renderUsers);
    },

    _removeUserViews: function() {
      _.each(this._userViews, function(userView) {
        this.stopListening(userView);
        userView.remove();
      }, this);
      this.$('.users_list').empty();
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
      this.$('.users_list').append(userViewsElms);
    },

    _renderUsers: function() {
      this._removeUserViews()
      this._createUserViews();
      this._addUserViews();
    }

  });

  return UsersView;
});
