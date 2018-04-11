Template.FootballNewFootball.events({
    'click #new-football': function(e) {
        e.preventDefault();

        var marketType = "company";

        var target = {
            targetId: "none",
            targetType: "none",
            targetData: "none"
        };
        var valuations = [];

        var footballType = "market";

        var currentUserId = Meteor.userId();
        var currentFootballId = Options.findOne({ownerId:currentUserId}).footballActive;

        Session.set('footballContent', "field");

        Meteor.call('footballAdd', marketType, target, valuations, footballType, currentFootballId, function() {
            Session.set('sessionValuations', "array");
        });
    }
});

