//Turns on Football Current shape
Template.FootballCurrentToggle.events({
    'click #current-toggle': function(e) {
        e.preventDefault();

        var currentFootballId = this._id;

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();

        var footballType = this.footballType;

        if (currentUserId == ownerId && footballType == "target") {
            Meteor.call('footballCurrentToggle', currentFootballId, function (error, result) {
            });
        }
    }
});

//Changes can only be made by owner, disabled for others
Template.FootballCurrentToggle.helpers({
    currentToggle: function() {
        var current = this.includeCurrent;
        switch(current) {
            case true:
                return "Hide Current";
                break;
            case false:
                return "Show Current";
                break;
        }
    }
});
