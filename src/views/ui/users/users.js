define(function(require) {
  'use strict';

  var _ = require('underscore');
  var Backbone = require('backbone');
  var UserPlainView = require('./user-plain/user-plain');
  var UserFriendView = require('./user-friend/user-friend');
  var tpl = _.template(require('text!./users.html'));

  var createUserViews = function(users) {
    return users.map(function(user) {
      var UserView = user.get('isFriend') ? UserFriendView : UserPlainView;
      return new UserView({user: user});
    });
  };

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

    _renderUsers: function() {
      var userViews = createUserViews(this._users);
      var userViewsElms = _.pluck(userViews, 'el');
      this.$('.users_list').empty().append(userViewsElms);
    }

  });

  return UsersView;
});
