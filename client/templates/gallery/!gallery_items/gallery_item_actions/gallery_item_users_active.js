Template.GalleryItemUsersActive.events({
    'click #active-change': function(e) {
        e.preventDefault();

        var userId = Template.parentData(0)._id;

        Meteor.call('userActiveChange', userId, function (error, result) {
        });
    }
});

Template.GalleryItemUsersActive.helpers({
    status: function() {
        var userId = Template.parentData(0)._id;
        var currentUsername = Meteor.user().username;
        if(currentUsername == "workshop" || currentUsername == "Workshop") {
            var userStatus = Meteor.users.findOne({_id: userId}).profile.active;
            switch(userStatus) {
                case "A":
                    return "Active";
                    break;
                case "B":
                    return "Inactive";
                    break;
            }
        }
    }
});