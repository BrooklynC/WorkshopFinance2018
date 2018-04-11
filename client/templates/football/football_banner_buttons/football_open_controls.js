Template.FootballOpenControls.events({
    'click .open-controls': function(e) {
        e.preventDefault();

        Session.set("footballContent", "controls")
    }
});

Template.FootballOpenControls.helpers({
    controlsSelected: function() {
        var currentUserId = Meteor.userId();
        var theme = Options.findOne({ownerId: currentUserId}).theme;
        var footballContent = Session.get('footballContent');
        if(footballContent == "controls") {
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