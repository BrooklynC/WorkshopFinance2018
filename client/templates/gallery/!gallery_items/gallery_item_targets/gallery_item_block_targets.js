Template.GalleryItemBlockTargets.helpers({
    owner: function() {
        var ownerId = Meteor.userId();
        return Meteor.users.findOne({_id:ownerId}).username;
    }
});

Template.GalleryItemBlockTargets.helpers({
    isCompany: function() {
        var itemId = Template.parentData(0).targetId;
        var company = FeedCompanies.findOne({_id:itemId});
        if(company) {
            return true;
        }
    }
});

Template.GalleryItemBlockTargets.onCreated (function () {
    var self = this;
    self.autorun(function() {
        var targetId = Template.parentData(0).targetId;
        self.subscribe('galleryItemTargetsBlock', targetId);
    });
});