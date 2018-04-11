Template.FootballCoverage.events({
    'click #btn-footballs': function(e) {
        e.preventDefault();

        var coverage = "Footballs";

        Session.set('sessionCoverageType', coverage);
    },
    'click #btn-targets': function(e) {
        e.preventDefault();

        var coverage = "Targets";

        Session.set('sessionCoverageType', coverage);
    }
});

Template.FootballCoverage.helpers({
    footballsSelected: function() {
        var currentUserId = Meteor.userId();
        var theme = Options.findOne({ownerId: currentUserId}).theme;
        var coverageType = Session.get('sessionCoverageType');
        if(coverageType == "Footballs") {
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
    },
    targetsSelected: function() {
        var currentUserId = Meteor.userId();
        var theme = Options.findOne({ownerId: currentUserId}).theme;
        var coverageType = Session.get('sessionCoverageType');
        if(coverageType == "Targets") {
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
    },
    isTargets: function() {
        var coverage = Session.get('sessionCoverageType');

        if(coverage == "Targets") {
            return true
        }
    },
    coverageName: function() {
        return Session.get('sessionCoverageType');
    }
});

Template.FootballCoverage.onCreated (function () {
});

