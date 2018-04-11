Template.ProfileContent.helpers({
    users: function() {
        var currentUserId = Meteor.userId();
        var currentUsername = Meteor.users.findOne({_id:currentUserId}).username;
        if(currentUsername == "workshop" || currentUsername == "Workshop") {
            return Meteor.users.find({});
        }
    }
});