Template.GalleryItemFootballAdd.events({
    'click #gallery-football-add': function(e) {
        e.preventDefault();

        var marketType = Session.get('sessionCoverageScreenType');
        var target = Template.parentData(0);
        var valuations = [];
        var footballType = "target";

        var currentUserId = Meteor.userId();
        var currentFootballId = Options.findOne({ownerId:currentUserId}).footballActive;

        Meteor.call('footballAdd', marketType, target, valuations, footballType, currentFootballId, function() {
            Session.set('sessionValuations', "array");
        });
        Session.set('footballContent', "field");
    }
});