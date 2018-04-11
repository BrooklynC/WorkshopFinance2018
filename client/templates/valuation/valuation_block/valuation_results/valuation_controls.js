Template.ValuationControls.events({
    'click .btn-repeat': function(e) {
        e.preventDefault();

        var currentValuationId = this._id;
        var currentFootballId = Template.parentData(1)._id;

        var selections = Valuations.findOne({_id:currentValuationId}).valuationSelections;
        var selectionsCount = selections.length;

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();

        if(currentUserId == ownerId && selectionsCount > 0) {
            Meteor.call('valuationRepeat', currentValuationId, currentFootballId, function(valuationId) {
            });
        }
    },
    'click .btn-remove': function(e) {
        e.preventDefault();

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();

        if(currentUserId == ownerId) {
            if (confirm("Delete this valuation?")) {
                var currentFootballId = Template.parentData(1)._id;
                var currentValuationId = this._id;
                Meteor.call('valuationRemove', currentFootballId, currentValuationId, function () {
                })
            }
        }
        Session.set('sessionValuations', "array");
    },
    'click .btn-favorite': function(e) {
        e.preventDefault();

        var currentValuationId = this._id;
        var valuationSelections = this.valuationSelections;
        var count = valuationSelections.length;

        if(count > 0) {
            Meteor.call('valuationFavorite', currentValuationId, function (valuationId) {
            });
        }
    }
});
