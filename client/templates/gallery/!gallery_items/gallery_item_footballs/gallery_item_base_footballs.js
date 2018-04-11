Template.GalleryItemBaseFootballs.events({
});

Template.GalleryItemBaseFootballs.helpers({
});

Template.GalleryItemBaseFootballs.onCreated (function () {
    var self = this;
    self.autorun(function() {
        var footballId = Template.parentData(0)._id;
        self.subscribe('galleryItemFootballsTargetCompany', footballId);
    });
});