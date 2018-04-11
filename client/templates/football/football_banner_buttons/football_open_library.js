Template.FootballOpenLibrary.events({
    'click .open-library': function(e) {
        e.preventDefault();

        Session.set("footballContent", "library")
    }
});

Template.FootballOpenLibrary.helpers({
    librarySelected: function() {
        var currentUserId = Meteor.userId();
        var theme = Options.findOne({ownerId: currentUserId}).theme;
        var footballContent = Session.get('footballContent');
        if(footballContent == "library") {
            switch (theme) {
                case "light":
                    return "is-selected-light";
                    break;
                case "dark":
                    return "is-selected-dark";
                    break;
            }
        } else {
            switch (theme) {
                case "light":
                    return "is-notselected-light";
                    break;
                case "dark":
                    return "is-notselected-dark";
                    break;
            }
        }
    }
});