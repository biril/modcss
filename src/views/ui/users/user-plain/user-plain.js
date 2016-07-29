define(function(require) {
  'use strict';

  var _ = require('underscore');
  var Backbone = require('backbone');
  var tpl = _.template(require('text!./user-plain.html'));
  var cn = JSON.parse(require('text!./user-plain.scss.json'));

  var UserPlainView = Backbone.View.extend({
    className: cn.userPlain,

    events: _.object([
      ['click .' + cn.befriendButton, function() {
        this.trigger('befriendUser', this._user.id);
      }]
    ]),

    // Initialized with opts:
    //  * user: A user Model. Must have isFriend = false
    initialize: function(opts) {
      this._user = opts.user;

      if (this._user.get('isFriend')) {
        throw new Error('UserPlainView can only be instantiated with user Model that is not a friend');
      }

      this.$el.html(tpl({cn: cn, user: this._user.attributes}));
    }
  });

  return UserPlainView;
});
