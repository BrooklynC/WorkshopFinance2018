Template.ValuationResultsBuild.events({
    'click .menu-result-build': function(e) {
        e.preventDefault();

        var currentValuationId = this._id;
        var selection = $(e.target).text();
        var footballId = Template.parentData(1)._id;

        Meteor.call('valuationBuildSelect', currentValuationId, selection, footballId, function(error, result) {});
    }
});

Template.ValuationResultsBuild.helpers({
    isCompany: function() {
        var marketType = this.marketType;
        if(marketType == "company") {
            return true;
        }
    },
    isComps: function() {
        var type = this.valuationType;
        if(type == "comps" || type == "models") {
            return true;
        }
    }
});