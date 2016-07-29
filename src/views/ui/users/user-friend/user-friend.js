define(function(require) {
  'use strict';

  var _ = require('underscore');
  var Backbone = require('backbone');
  var tpl = _.template(require('text!./user-friend.html'));
  var cn = JSON.parse(require('text!./user-friend.scss.json'));

  var UserFriendView = Backbone.View.extend({
    className: cn.userFriend,

    // Initialized with opts:
    //  * user: A user Model. Must have isFriend = true
    initialize: function(opts) {
      this._user = opts.user;

      if (!this._user.get('isFriend')) {
        throw new Error('UserFriendView can only be instantiated with user Model that is a friend');
      }

      this.$el.html(tpl({cn: cn, user: this._user.attributes}));
    }
  });

  return UserFriendView;
});
