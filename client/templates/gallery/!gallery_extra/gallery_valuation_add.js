//Creates new Valuation in Gallery using selected Comps or Deals
Template.GalleryValuationAdd.events({
    'click #gallery-valuation-add': function(e) {
        e.preventDefault();

        var currentUserId = Meteor.userId();
        var currentFootballId = Options.findOne({ownerId:currentUserId}).footballActive;
        var ownerId = Footballs.findOne({_id:currentFootballId}).ownerId;
        var marketType = Footballs.findOne({_id:currentFootballId}).marketType;

        var type = getValuationSelect().type;
        var element = getValuationSelect().element;

        var metric = getValuationInfo(marketType).metric;
        var period = getValuationInfo(marketType).period;

        var output = getValuationInfo(marketType).output;
        var outputPeriod = getValuationInfo(marketType).outputPeriod;

        var live = true;

        var selections = [];
        var compsSelect = localSelections.find({});
        //Push ids of selections in new array
        compsSelect.forEach(function (c) {
            var compId = c._id;
            selections.push(compId);
        });
        var length = selections.length;

        if(ownerId == currentUserId) {
            if(length > 0) {
                Meteor.call('valuationAdd', marketType, type, element, metric, period, output, outputPeriod, selections, currentFootballId, live, function(error, result) {
                });
                localSelections.remove({});
            }
        }
    }
});