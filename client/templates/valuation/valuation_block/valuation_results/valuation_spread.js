Template.ValuationSpread.events({
    'click .valuation-spread-up': function(e) {
        e.preventDefault();

        var currentValuationId = this._id;

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();

        if(currentUserId == ownerId) {
            Meteor.call('valuationSpreadUp', currentValuationId, function(error, result) {
            });
        }
    },
    'click .valuation-spread-down': function(e) {
        e.preventDefault();

        var currentValuationId = this._id;

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();

        if(currentUserId == ownerId) {
            Meteor.call('valuationSpreadDown', currentValuationId, function (error, result) {
            });
        }
    }
});

Template.ValuationSpread.helpers({
    spreadPct: function() {
        var valuationSpread = this.valuationSpread;
        if(valuationSpread > 0) {
            return "%"
        } else {
            return ""
        }
    }
});