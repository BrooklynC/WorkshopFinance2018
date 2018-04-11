//Should be able to refactor these into one that increases or decreases depending on id of button
Template.FootballCushion.events({
    'click #cushion-up': function(e) {
        e.preventDefault();

        var currentFootballId = this._id;

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();

        if(currentUserId == ownerId) {
            Meteor.call('footballCushionUp', currentFootballId, function(error, result) {
            });
        }
    },
    'click #cushion-down': function(e) {
        e.preventDefault();

        var currentFootballId = this._id;

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();

        if(currentUserId == ownerId) {
            Meteor.call('footballCushionDown', currentFootballId, function (error, result) {
            });
        }
    }
});

Template.FootballCushion.helpers({
});