//Adds new Comps valuation by default, valuationType can be changed within Valuation
//Will not add new Valuation if empty Valuation exists
Template.FootballValuationAddMobile.events({
    'click #football-valuation-add': function(e) {
        e.preventDefault();

        var currentFootballId = this._id;

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();

        Session.set("footballContent", "field");

        if(currentUserId == ownerId) {
            var existingValuations = this.footballValuations;
            var existingValuationsEmpty = Valuations.findOne({
                _id: {$in: existingValuations},
                valuationSelections: {$size: 0}
            });
            if(existingValuationsEmpty) {
                var existingId = existingValuationsEmpty._id;
                Session.set('sessionValuations', existingId);
            } else {
                var marketType = this.marketType;
                var type = "comps";
                var element = "security";
                var metric = getValuationInfo(marketType).metric;
                var period = getValuationInfo(marketType).period;
                var output = getValuationInfo(marketType).output;
                var outputPeriod = getValuationInfo(marketType).outputPeriod;
                var selections = [];
                var live = Footballs.findOne({_id:currentFootballId}).footballLive;
                Meteor.call('valuationAdd', marketType, type, element, metric, period, output, outputPeriod, selections, currentFootballId, live, function () {
                });
            }
        }
    }
});