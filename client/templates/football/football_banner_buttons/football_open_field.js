Template.FootballOpenField.events({
    'click .open-field': function(e) {
        e.preventDefault();

        Session.set("footballContent", "field")
    }
});

Template.FootballOpenField.helpers({
    fieldSelected: function() {
        var currentUserId = Meteor.userId();
        var theme = Options.findOne({ownerId: currentUserId}).theme;
        var footballContent = Session.get('footballContent');
        if(footballContent == "field") {
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