//Creates new Valuation in Gallery using selected Comps or Deals
Template.GalleryValuationClear.events({
    'click #gallery-valuation-clear': function(e) {
        e.preventDefault();

        localSelections.remove({});
    }
});