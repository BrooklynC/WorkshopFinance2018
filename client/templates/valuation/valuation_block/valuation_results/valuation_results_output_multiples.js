Template.ValuationResultsOutputMultiples.events({
    'click .menu-result-output': function(e) {
        e.preventDefault();

        var currentValuationId = this._id;
        var selection = $(e.target).text();

        Meteor.call('valuationResultSelect', currentValuationId, selection, function(error, result) {});
    }
});

Template.ValuationResultsOutputMultiples.helpers({
    isCompany: function() {
        var marketType = this.marketType;
        if(marketType == "company") {
            return true;
        }
    },
    isComps: function() {
        var type = this.valuationType;
        if(type == "comps") {
            return true;
        }
    }
});