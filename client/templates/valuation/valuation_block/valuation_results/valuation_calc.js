//Toggle between millions and billions
Template.ValuationCalc.events({
    'click .btn-calc': function(e) {
        e.preventDefault();

        var currentValuationId = this._id;

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();

        if (currentUserId == ownerId) {
            Meteor.call('valuationCalcUpdate', currentValuationId, function (error, result) {
            });
        }
    }
});