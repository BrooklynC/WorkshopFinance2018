Template.FootballSpread.events({
    'click #spread-up': function(e) {
        e.preventDefault();

        var currentFootballId = this._id;

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();

        if(currentUserId == ownerId) {
            Meteor.call('footballSpreadUp', currentFootballId, function(error, result) {
            });
        }
    },
    'click #spread-down': function(e) {
        e.preventDefault();

        var currentFootballId = this._id;

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();

        if(currentUserId == ownerId) {
            Meteor.call('footballSpreadDown', currentFootballId, function (error, result) {
            });
        }
    }
});