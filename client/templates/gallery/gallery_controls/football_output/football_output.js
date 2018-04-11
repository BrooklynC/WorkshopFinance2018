//Changes Football Output options and updates Football document
Template.FootballOutput.events({
    'click .menu-output-text': function(e) {
        e.preventDefault();

        var newFootballOutput = $(e.target).text();
        var footballType = this.footballType;

        var currentFootballId = this._id;

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();

        if(currentUserId == ownerId && footballType == "target") {
            Meteor.call('footballOutputUpdate', currentFootballId, newFootballOutput, function(error, result) {
            });
        }
    }
});