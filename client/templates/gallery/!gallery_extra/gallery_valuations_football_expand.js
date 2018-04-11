//Add selected Valuations to active Football
Template.GalleryValuationsFootballExpand.events({
    'click #gallery-football-expand': function(e) {
        e.preventDefault();

        var marketType = Session.get('sessionCoverageScreenType');

        var selections = [];
        var valuationsSelect = localSelections.find({});
        valuationsSelect.forEach(function (v) {
            var valuationId = v._id;
            selections.push(valuationId);
        });
        Meteor.call('footballValuationsExpand', marketType, selections, function() {
        });
        Session.set('footballContent', "field");
        localSelections.remove({});
    }
});