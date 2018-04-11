Template.GalleryItemBaseUsers.events({
});

Template.GalleryItemBaseUsers.helpers({
    online: function() {
        var userId = this._id;
        var userOnline = Meteor.users.find({$and:[{_id:userId},{"status.online": true}]}).fetch().length;
        if (userOnline == 1) {
            return "Logged in"
        } else {
            return "Offline"
        }
    }
});

Template.GalleryItemBaseUsers.onCreated (function () {
    var self = this;
    self.autorun(function() {
        self.subscribe('userStatus');
    });
});