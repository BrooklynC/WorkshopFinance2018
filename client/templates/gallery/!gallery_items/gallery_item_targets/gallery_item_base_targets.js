Template.GalleryItemBaseTargets.events({
});

Template.GalleryItemBaseTargets.helpers({
    isCompany: function() {
        var itemId = Template.parentData(0).targetId;
        var company = FeedCompanies.findOne({_id:itemId});
        if(company) {
            return true;
        }
    }
});

Template.GalleryItemBaseTargets.onCreated (function () {
    var self = this;
    self.autorun(function() {
        var targetId = Template.parentData(0).targetId;
        self.subscribe('galleryItemTargetsBase', targetId);
    });
});