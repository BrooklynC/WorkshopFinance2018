Template.GalleryItemBlockFootballs.helpers({
    valuationCount: function () {
        var footballId = this._id;
        var valuations = Footballs.findOne({_id:footballId}).footballValuations;
        if(valuations) {
            return valuations.length;
        }
    },
    owner: function() {
        var ownerId = this.ownerId;
        return Meteor.users.findOne({_id:ownerId}).username;
    }
});

Template.GalleryItemBlockFootballs.onCreated (function () {
    var self = this;
    self.autorun(function() {
        var footballId = Template.parentData(0)._id;
        self.subscribe('galleryItemFootballsTargetCompany', footballId);
    });
});