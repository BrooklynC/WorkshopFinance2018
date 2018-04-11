Template.GalleryItemBlockValuations.helpers({
    owner: function() {
        var ownerId = this.ownerId;
        return Meteor.users.findOne({_id:ownerId}).username;
    },
    count: function () {
        var selections = this.valuationSelections;
        if(selections) {
            return selections.length;
        }
    }
});