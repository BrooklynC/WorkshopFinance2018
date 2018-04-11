Template.Valuation.helpers({
    valuationIn: function() {
        var sessionValuations = Session.get('sessionValuations');
        if(sessionValuations !== "array") {
            var valuationId = this._id;
            var activeValuationId = Session.get('sessionValuations');
            if(valuationId == activeValuationId) {
                return "in";
            }
        }
    }
});

Template.Valuation.onCreated (function () {
    var self = this;
    self.autorun(function() {
        //var valuationId = Template.parentData(0)._id;
        //self.subscribe('valuation', valuationId);
        //self.subscribe('valuationCompsAdded', valuationId);
        //self.subscribe('valuationDealsAdded', valuationId);
        //self.subscribe('pillFeedComps');
        //self.subscribe('pillFeedCompsIndices');
        //self.subscribe('pillFeedDeals');
        //self.subscribe('pillFeedDealsIndices');
    });
});