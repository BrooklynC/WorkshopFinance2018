Template.FootballOpenCoverage.events({
    'click .open-coverage': function(e) {
        e.preventDefault();

        Session.set("footballContent", "coverage");
    }
});

Template.FootballOpenCoverage.helpers({
    coverageSelected: function() {
        var currentUserId = Meteor.userId();
        var theme = Options.findOne({ownerId: currentUserId}).theme;
        var footballContent = Session.get('footballContent');
        if(footballContent == "coverage") {
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