Template.FootballProfile.events({
    'click #profile-theme-toggle': function(e) {
        e.preventDefault();

        Meteor.call('optionsThemeToggle', function (error, result) {
        });
    }
});

Template.FootballProfile.helpers({
    indicesCreate: function() {
        var username = Meteor.user().username;
        if (username == "workshop" || username == "Workshop") {
            var dealsIndices = FeedDealsIndices.find({});
            if(dealsIndices.count() === 0) {
                return Template.GalleryDataAdd;
            } else {
                return Template.Blank;
            }
        } else {
            return Template.Blank;
        }
    },
    membership: function() {
        var currentUserId = Meteor.userId();
        var user = Meteor.users.findOne({_id:currentUserId});
        var username = user.username;
        var tier = user.profile.tier;
        if(username == "workshop" || username == "Workshop") {
            return "Workshop Finance";
        } else {
            switch(tier) {
                case "A":
                    return "Basic";
                    break;
                case "B":
                    return "Premium";
                    break;
            }
        }
    },
    themeToggle: function() {
        var currentUserId = Meteor.userId();
        var theme = Options.findOne({ownerId:currentUserId}).theme;
        switch(theme) {
            case "light":
                return "Dark Theme";
                break;
            case "dark":
                return "Light Theme";
                break;
        }
    },
    userAdd: function() {
        var currentUserId = Meteor.userId();
        var user = Meteor.users.findOne({_id:currentUserId});
        var username = user.username;
        if(username == "workshop" || username == "Workshop") {
            return Template.GalleryUserAdd;
        } else {
            return Template.Blank;
        }
    }
});

Template.FootballProfile.onCreated (function () {
    var self = this;
    self.autorun(function() {
        self.subscribe('notifications');
    });
});